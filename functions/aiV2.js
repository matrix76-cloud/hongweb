// aiV2.js (CommonJS 버전, TTS/요약 + 번역 + 갤러리 스케줄 + Worknet API)

// ──────────────────────────────── 공통 준비
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const corsMW = require("cors")({ origin: true });



try {
    if (!admin.apps.length) admin.initializeApp();
} catch (e) { }

const db = admin.firestore();
const storage = admin.storage();

const DEFAULT_REGION = "asia-northeast1";
const DEFAULT_TZ = "Asia/Seoul";

// env
const GEMINI_API_KEY = functions.config().gemini?.key || "";
const GOOGLE_TTS_KEY = functions.config().googletts?.key || "";
const PAPAGO_ID = functions.config().papago?.client_id || "";
const PAPAGO_SECRET = functions.config().papago?.client_secret || "";
const REPLICATE_KEY = functions.config().replicate?.key || "";

// ──────────────────────────────── Gemini 요약 → Google TTS
async function generateSummary(worker) {
    const prompt = `
이 구직자는 ${worker.age || "30대"} ${worker.gender === "male" ? "남성" : "여성"}입니다.
${worker.address || "서울 지역"}에 거주하고 있으며, 자기소개는:
"${worker.selfIntro || "성실하고 책임감 있는 사람입니다."}"
→ 따뜻하고 신뢰감 있게 소개하는 1줄 요약 멘트를 만들어줘.`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
    );
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

async function generateTTS(text) {
    const res = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                input: { text },
                voice: { languageCode: "ko-KR", name: "ko-KR-Wavenet-B" },
                audioConfig: { audioEncoding: "MP3" },
            }),
        }
    );
    const json = await res.json();
    if (!json?.audioContent) throw new Error("TTS audioContent 없음");
    return Buffer.from(json.audioContent, "base64");
}

async function uploadToStorage(userId, audioBuffer) {
    const filePath = `tts_audio/${userId}_${Date.now()}.mp3`;
    await storage
        .bucket()
        .file(filePath)
        .save(audioBuffer, { contentType: "audio/mpeg" });

    return `https://storage.googleapis.com/${storage.bucket().name}/${filePath}`;
}

// 인증 구직자 → 요약/tts 저장
exports.generateAudioForVerifiedWorkers = functions
    .runWith({ timeoutSeconds: 540, memory: "1GB" })
    .region(DEFAULT_REGION)
    .https.onRequest(async (req, res) => {
        try {
            const snapshot = await db
                .collection("WORKERS")
                .where("official", "==", true)
                .get();

            let success = 0,
                skipped = 0,
                failed = 0;

            for (const doc of snapshot.docs) {
                const userId = doc.id;
                const data = doc.data();
                if (data.tts_audio_url) {
                    skipped++;
                    continue;
                }

                try {
                    const summary = await generateSummary(data);
                    const ttsBuf = await generateTTS(summary);
                    const audioUrl = await uploadToStorage(userId, ttsBuf);

                    await db.collection("WORKERS").doc(userId).update({
                        tts_audio_url: audioUrl,
                        tts_summary_text: summary,
                    });
                    success++;
                } catch (e) {
                    failed++;
                }
            }

            res
                .status(200)
                .send(`완료: 성공 ${success}, 실패 ${failed}, 스킵 ${skipped}`);
        } catch (e) {
            res.status(500).send(e.message);
        }
    });

// 프롬프트 → TTS
exports.generateCreateTTSFromPrompt = functions
    .region(DEFAULT_REGION)
    .https.onRequest((req, res) => {
        corsMW(req, res, async () => {
            try {
                const { users_id, prompt } = req.body || {};
                if (!users_id || !prompt)
                    return res
                        .status(400)
                        .json({ error: "Missing users_id or prompt" });

                const ttsRes = await fetch(
                    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_KEY}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            input: { text: prompt },
                            voice: { languageCode: "ko-KR", name: "ko-KR-Wavenet-B" },
                            audioConfig: { audioEncoding: "MP3" },
                        }),
                    }
                );
                const json = await ttsRes.json();
                if (!json?.audioContent) throw new Error("TTS audioContent 없음");

                const buf = Buffer.from(json.audioContent, "base64");
                const filePath = `tts_audio/${users_id}_${Date.now()}.mp3`;
                await storage
                    .bucket()
                    .file(filePath)
                    .save(buf, { contentType: "audio/mpeg" });

                const url = `https://storage.googleapis.com/${storage.bucket().name}/${filePath}`;
                res.json({ ttsUrl: url });
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    });

// Papago 번역
exports.translateKoToEn = functions
    .region(DEFAULT_REGION)
    .https.onRequest((req, res) => {
        corsMW(req, res, async () => {
            try {
                const { text } = req.body || {};
                if (!text) return res.status(400).json({ error: "No text" });

                const result = await fetch(
                    "https://papago.apigw.ntruss.com/nmt/v1/translation",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "X-NCP-APIGW-API-KEY-ID": PAPAGO_ID,
                            "X-NCP-APIGW-API-KEY": PAPAGO_SECRET,
                        },
                        body: new URLSearchParams({ source: "ko", target: "en", text }),
                    }
                );
                const raw = await result.text();
                const json = JSON.parse(raw);
                res.json({
                    translatedText: json?.message?.result?.translatedText || "",
                });
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    });

// ──────────────────────────────── AI 갤러리 스케줄 (Gemini→Papago→Replicate)

// 워커 → 한글 설명 프롬프트
function generateKoreanPromptFromWorker(worker) {
    const gender = worker.gender === "male" ? "남성" : "여성";
    const age = worker.age || "30대";
    const region = (worker.address || "서울").split(" ").slice(0, 2).join(" ");
    const selfIntro = worker.selfIntro || "성실하고 믿을 수 있는 사람입니다.";
    const availableTime = worker.availableTime || "시간 조율이 가능합니다.";
    const career = worker.career || "다양한 서비스 경험이 있습니다.";
    const rawTags = worker.tags || [];
    const tagText = rawTags.length ? rawTags.join(", ") : "다양한 일";

    return `${age}의 ${gender}로, ${region}에 거주하며, 주요 활동 분야는 ${tagText}입니다. 가능한 시간은 ${availableTime}입니다. 자기소개 "${selfIntro}"의 분위기가 이미지에 드러나게 해주세요. 또한 "${career}" 경력도 반영해주세요. 주요 활동 분야를 가장 크게 반영하고, 배경은 자연스러운 실내/업무 환경으로 설정해주세요.`;
}

// Papago로 ko→en
async function translatePromptServerSide(text) {
    if (!PAPAGO_ID || !PAPAGO_SECRET) return text;
    try {
        const result = await fetch(
            "https://papago.apigw.ntruss.com/nmt/v1/translation",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-NCP-APIGW-API-KEY-ID": PAPAGO_ID,
                    "X-NCP-APIGW-API-KEY": PAPAGO_SECRET,
                },
                body: new URLSearchParams({ source: "ko", target: "en", text }),
            }
        );
        const raw = await result.text();
        const json = JSON.parse(raw);
        return json?.message?.result?.translatedText || text;
    } catch {
        return text;
    }
}

const replicateModelVersions = [
    "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc", // SDXL
    "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // SD v2.1
];

// 스케줄: 10분마다 최대 50명 생성
exports.scheduledGenerateAiGallery = functions
    .runWith({ timeoutSeconds: 540, memory: "1GB" })
    .region(DEFAULT_REGION)
    .pubsub.schedule("every 10 minutes")
    .timeZone(DEFAULT_TZ)
    .onRun(async () => {
        const snapshot = await db
            .collection("WORKERS")
            .orderBy("createdAt", "desc")
            .limit(1100)
            .get();

        const workers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const isImageUrlValid = async (url) => {
            try {
                const res = await fetch(url, { method: "HEAD" });
                const type = res.headers.get("Content-Type") || "";
                return res.ok && type.includes("image");
            } catch {
                return false;
            }
        };

        let fixedCount = 0;
        for (const worker of workers) {
            if (fixedCount >= 50) break;

            const version = replicateModelVersions[0];
            const userId = worker.users_id || worker.id;
            if (!userId || worker.AI_NEWIMAGE) continue;

            fixedCount++;

            const koPrompt = generateKoreanPromptFromWorker(worker);
            const enPrompt = await translatePromptServerSide(koPrompt);

            try {
                const startRes = await fetch("https://api.replicate.com/v1/predictions", {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${REPLICATE_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        version,
                        input: { prompt: enPrompt, width: 1024, height: 1024 },
                    }),
                });
                const startJson = await startRes.json();
                if (!startJson?.id) continue;

                let imageUrl = null;
                for (let i = 0; i < 20; i++) {
                    const poll = await fetch(
                        `https://api.replicate.com/v1/predictions/${startJson.id}`,
                        { headers: { Authorization: `Token ${REPLICATE_KEY}` } }
                    );
                    const status = await poll.json();
                    if (status?.status === "succeeded") {
                        imageUrl = status?.output?.[0];
                        break;
                    }
                    if (status?.status === "failed") throw new Error("Replicate failed");
                    await new Promise((r) => setTimeout(r, 2000));
                }

                if (!imageUrl || !(await isImageUrlValid(imageUrl))) {
                    await db.collection("WORKERS").doc(worker.id).update({ AI_GENERATED: false });
                    continue;
                }

                const resp = await fetch(imageUrl);
                const buf = Buffer.from(await resp.arrayBuffer());
                const filePath = `aiimage/${worker.id}_${Date.now()}.png`;
                await admin
                    .storage()
                    .bucket()
                    .file(filePath)
                    .save(buf, { contentType: "image/png" });

                const publicUrl = `https://storage.googleapis.com/${admin.storage().bucket().name}/${filePath}`;

                await db.collection("WORKERS").doc(worker.id).update({
                    AI_NEWIMAGE: publicUrl,
                    AI_GENERATED: true,
                    AI_MODEL_VERSION: version,
                });
            } catch (err) {
                functions.logger.warn(
                    `[scheduledGenerateAiGallery] ${userId} 실패: ${err.message}`
                );
                continue;
            }
        }

        functions.logger.info("✅ scheduledGenerateAiGallery 종료");
        return null;
    });

// ──────────────────────────────── Worknet 요양보호사 조회 API (v2 onRequest)
// GET https://<region>-<project>.cloudfunctions.net/careworkerJobs?limit=300
// 증분:  .../careworkerJobs?since=2026-01-25T12:00:00&limit=500
// 페이지네이션: .../careworkerJobs?cursor=<base64>&limit=300
// 옵션: includeClosed=1, includeDetails=1

const JOBS_COL = "worknet_v2_jobs";
const CAREGIVER_CATEGORY = "caregiver";

function safeInt(v, d = 200) {
    const n = Number(v);
    if (!Number.isFinite(n)) return d;
    return Math.max(1, Math.min(1000, Math.floor(n)));
}

function decodeCursor(cursor) {
    if (!cursor) return null;
    try {
        const json = Buffer.from(String(cursor), "base64").toString("utf8");
        const obj = JSON.parse(json);
        if (!obj || typeof obj !== "object") return null;
        const { mod, id, dir } = obj;
        if (!mod || !id || !dir) return null;
        return { mod: String(mod), id: String(id), dir: dir === "asc" ? "asc" : "desc" };
    } catch (e) {
        return null;
    }
}

function encodeCursor({ mod, id, dir }) {
    const payload = JSON.stringify({ mod, id, dir });
    return Buffer.from(payload, "utf8").toString("base64");
}

function toDTO(docId, data, includeDetails) {
    const d = data || {};
    const dto = {
        id: docId,
        wantedAuthNo: d.wantedAuthNo || docId,
        title: d.title || d.wantedTitle || "",
        company: d.company || d.corpNm || "",
        basicAddr: d.basicAddr || "",
        closeDt: d.closeDt || "",
        status: d.status || "OPEN",
        lastModifiedAtForWorknet: d.lastModifiedAtForWorknet || d.smodifyDtm || null,
        latitude: typeof d.latitude === "number" ? d.latitude : null,
        longitude: typeof d.longitude === "number" ? d.longitude : null,
        geoReason: d.geoReason || "none",
        salTpNm: d.salTpNm || null,
        sal: d.sal || null,
        empTpCd: d.empTpCd || null,
        jobsCd: d.jobsCd || null,
        primaryCategory: d.primaryCategory || null,
        workCategories: Array.isArray(d.workCategories) ? d.workCategories : [],
    };
    if (includeDetails) dto.details = d.details || null;
    return dto;
}

exports.careworkerJobs = functions
    .region("asia-northeast1")
    .https.onRequest((req, res) => {
        corsMW(req, res, async () => {
            try {
                if (req.method !== "GET") {
                    res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
                    return;
                }

                const limit = safeInt(req.query.limit, 300);
                const includeClosed = String(req.query.includeClosed || "") === "1";
                const includeDetails = String(req.query.includeDetails || "") === "1";

                const since = String(req.query.since || "").trim();
                const cursor = decodeCursor(req.query.cursor);

                const incremental = !!since;
                const dir = incremental ? "asc" : "desc";

                let q = db.collection(JOBS_COL).where("primaryCategory", "==", CAREGIVER_CATEGORY);

                if (!includeClosed) q = q.where("status", "==", "OPEN");
                if (incremental) q = q.where("lastModifiedAtForWorknet", ">", since);

                q = q
                    .orderBy("lastModifiedAtForWorknet", dir)
                    .orderBy(admin.firestore.FieldPath.documentId(), dir);

                if (cursor && cursor.dir === dir) {
                    q = q.startAfter(cursor.mod, cursor.id);
                }

                q = q.limit(limit);

                const snap = await q.get();

                const items = [];
                let last = null;

                snap.forEach((doc) => {
                    const dto = toDTO(doc.id, doc.data(), includeDetails);
                    items.push(dto);
                    last = { id: doc.id, mod: dto.lastModifiedAtForWorknet || "" };
                });

                let nextCursor = null;
                if (last && items.length === limit) {
                    nextCursor = encodeCursor({ mod: last.mod, id: last.id, dir });
                }

                res.status(200).json({
                    ok: true,
                    mode: incremental ? "incremental" : "latest",
                    dir,
                    limit,
                    count: items.length,
                    nextCursor,
                    serverTime: admin.firestore.Timestamp.now().toDate().toISOString(),
                    items,
                });
            } catch (e) {
                functions.logger.error("[careworkerJobs] fail:", e?.message || e, e?.stack || "");
                res.status(500).json({ ok: false, error: "INTERNAL_ERROR", detail: e?.message || "" });
            }
        });
    });

// ──────────────────────────────── Worknet 식당알바 조회 API
// GET https://<region>-<project>.cloudfunctions.net/foodworkerJobs?limit=300
// 증분:  .../foodworkerJobs?since=2026-01-25T12:00:00&limit=500
// 페이지네이션: .../foodworkerJobs?cursor=<base64>&limit=300
// 옵션: includeClosed=1, includeDetails=1

const FOOD_CATEGORIES = ["food_service", "restaurant", "chef"];

exports.foodworkerJobs = functions
    .region("asia-northeast1")
    .https.onRequest((req, res) => {
        corsMW(req, res, async () => {
            try {
                if (req.method !== "GET") {
                    res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
                    return;
                }

                const limit = safeInt(req.query.limit, 300);
                const includeClosed = String(req.query.includeClosed || "") === "1";
                const includeDetails = String(req.query.includeDetails || "") === "1";

                const since = String(req.query.since || "").trim();
                const cursor = decodeCursor(req.query.cursor);

                const incremental = !!since;
                const dir = incremental ? "asc" : "desc";

                let q = db.collection(JOBS_COL).where("primaryCategory", "in", FOOD_CATEGORIES);

                if (!includeClosed) q = q.where("status", "==", "OPEN");
                if (incremental) q = q.where("lastModifiedAtForWorknet", ">", since);

                q = q
                    .orderBy("lastModifiedAtForWorknet", dir)
                    .orderBy(admin.firestore.FieldPath.documentId(), dir);

                if (cursor && cursor.dir === dir) {
                    q = q.startAfter(cursor.mod, cursor.id);
                }

                q = q.limit(limit);

                const snap = await q.get();

                const items = [];
                let last = null;

                snap.forEach((doc) => {
                    const dto = toDTO(doc.id, doc.data(), includeDetails);
                    items.push(dto);
                    last = { id: doc.id, mod: dto.lastModifiedAtForWorknet || "" };
                });

                let nextCursor = null;
                if (last && items.length === limit) {
                    nextCursor = encodeCursor({ mod: last.mod, id: last.id, dir });
                }

                res.status(200).json({
                    ok: true,
                    mode: incremental ? "incremental" : "latest",
                    dir,
                    limit,
                    count: items.length,
                    nextCursor,
                    serverTime: admin.firestore.Timestamp.now().toDate().toISOString(),
                    items,
                });
            } catch (e) {
                functions.logger.error("[foodworkerJobs] fail:", e?.message || e);
                res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
            }
        });
    });

// ─── patrolworkerJobs (경비원: security, guard) ───
const PATROL_CATEGORIES = ["security", "guard"];

exports.patrolworkerJobs = functions
    .region("asia-northeast1")
    .https.onRequest((req, res) => {
        corsMW(req, res, async () => {
            try {
                if (req.method !== "GET") {
                    res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
                    return;
                }

                const limit = safeInt(req.query.limit, 300);
                const includeClosed = String(req.query.includeClosed || "") === "1";
                const includeDetails = String(req.query.includeDetails || "") === "1";

                const since = String(req.query.since || "").trim();
                const cursor = decodeCursor(req.query.cursor);

                const incremental = !!since;
                const dir = incremental ? "asc" : "desc";

                let q = db.collection(JOBS_COL).where("primaryCategory", "in", PATROL_CATEGORIES);

                if (!includeClosed) q = q.where("status", "==", "OPEN");
                if (incremental) q = q.where("lastModifiedAtForWorknet", ">", since);

                q = q
                    .orderBy("lastModifiedAtForWorknet", dir)
                    .orderBy(admin.firestore.FieldPath.documentId(), dir);

                if (cursor && cursor.dir === dir) {
                    q = q.startAfter(cursor.mod, cursor.id);
                }

                q = q.limit(limit);

                const snap = await q.get();

                const items = [];
                let last = null;

                snap.forEach((doc) => {
                    const dto = toDTO(doc.id, doc.data(), includeDetails);
                    items.push(dto);
                    last = { id: doc.id, mod: dto.lastModifiedAtForWorknet || "" };
                });

                let nextCursor = null;
                if (last && items.length === limit) {
                    nextCursor = encodeCursor({ mod: last.mod, id: last.id, dir });
                }

                res.status(200).json({
                    ok: true,
                    mode: incremental ? "incremental" : "latest",
                    dir,
                    limit,
                    count: items.length,
                    nextCursor,
                    serverTime: admin.firestore.Timestamp.now().toDate().toISOString(),
                    items,
                });
            } catch (e) {
                functions.logger.error("[patrolworkerJobs] fail:", e?.message || e);
                res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
            }
        });
    });

// functions/dailyWorknet.js  (CommonJS, 1st Gen / Node 18)

// --- Node18 File 폴리필 (undici 회피용, 최상단 유지) ---
const { Blob } = require("buffer");
if (typeof globalThis.File === "undefined") {
    globalThis.File = class File extends Blob {
        constructor(chunks = [], name = "file", options = {}) {
            super(chunks, options);
            this.name = String(name);
            this.lastModified = options.lastModified ?? Date.now();
            this.type = options.type ?? "";
        }
    };
}

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment-timezone");

try { admin.app(); } catch (_) { admin.initializeApp(); }
const db = admin.firestore();

// ──────────────────────────────
// 설정
// ──────────────────────────────
const REGION = "asia-northeast1";
const TZ = "Asia/Seoul";
const RADIUS_KM = 7;                // ← 요구사항: 7km
const MAX_SENDS_PER_RUN = 5000;     // 안전 상한(필요시 조절)
const SEND_THROTTLE_MS = 15;        // 전송 간 딜레이(과도한 burst 방지)
const REQUIRE_TOKEN = true;         // 토큰 없는 유저는 제외(실발송만 카운트)

// ──────────────────────────────
// 유틸
// ──────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const todayY4 = () => moment().tz(TZ).format("YYYY-MM-DD"); // 유저 플래그용

function haversineKm(aLat, aLng, bLat, bLng) {
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
}

// 오늘(KST) regDt로 올라온 공고(좌표 있는 것만) 로드
async function fetchTodayJobsAll() {
    const jobs = [];
    const y2dash = moment().tz(TZ).format("YY-MM-DD");    // 25-09-05
    const y4dash = moment().tz(TZ).format("YYYY-MM-DD");  // 2025-09-05
    const y4 = moment().tz(TZ).format("YYYYMMDD");    // 20250905
    const y2 = moment().tz(TZ).format("YYMMDD");      // 250905

    const candidates = [y2dash, y4dash, y4, y2];
    let used = null;

    for (const val of candidates) {
        let snap = await db
            .collection("worknet_v2_jobs")
            .where("regDt", "==", val)
            .orderBy(admin.firestore.FieldPath.documentId())
            .limit(500)
            .get();

        if (snap.empty) continue;
        used = val;

        while (!snap.empty) {
            snap.forEach((d) => {
                const data = d.data();
                if (typeof data.latitude === "number" && typeof data.longitude === "number") {
                    jobs.push({ id: d.id, ...data });
                }
            });
            const last = snap.docs[snap.docs.length - 1];
            snap = await db
                .collection("worknet_v2_jobs")
                .where("regDt", "==", val)
                .orderBy(admin.firestore.FieldPath.documentId())
                .startAfter(last)
                .limit(500)
                .get();
        }
        break; // 첫 매칭 형식에서 완료했으면 종료
    }

    functions.logger.info(`[worknetDaily] jobsLoaded=${jobs.length} using regDt=${used || "none"}`);
    return jobs;
}

// ──────────────────────────────
// 실서비스: 매일 08:15 KST, 7km 내 1건 푸시, 유저당 하루 1회
// ──────────────────────────────
exports.pushWorknetDaily = functions
    .region(REGION)
    .runWith({ timeoutSeconds: 540, memory: "1GB" })
    .pubsub.schedule("15 13 * * *")       
    .timeZone(TZ)
    .onRun(async () => {
        const todaysJobs = await fetchTodayJobsAll();
        if (!todaysJobs.length) {
            functions.logger.info("[worknetDaily] no jobs for today.");
            return null;
        }

        const today = todayY4();
        let sent = 0, scanned = 0, matched = 0;

        const pageSize = 500;
        let snap = await db
            .collection("USERS")
            .orderBy(admin.firestore.FieldPath.documentId())
            .limit(pageSize)
            .get();

        while (!snap.empty) {
            for (const doc of snap.docs) {
                if (sent >= MAX_SENDS_PER_RUN) {
                    functions.logger.warn(`[worknetDaily] reached MAX_SENDS_PER_RUN=${MAX_SENDS_PER_RUN}`);
                    break;
                }

                scanned++;
                const uid = doc.id;
                const user = doc.data() || {};
                const info = user.USERINFO || {};
                const token = info.token;
                const uLat = info.latitude;
                const uLng = info.longitude;

                if (REQUIRE_TOKEN && (!token || typeof uLat !== "number" || typeof uLng !== "number")) {
                    continue;
                }

                // 이미 오늘 보냈으면 skip
                const lastDate = user?.worknetDaily?.lastSentDateKST;
                if (lastDate === today) continue;

                // 근처(7km)에서 best 1건 고르기 (가까움 > 최신성)
                let best = null;
                for (const job of todaysJobs) {
                    const jLat = job.latitude;
                    const jLng = job.longitude;
                    if (typeof jLat !== "number" || typeof jLng !== "number") continue;

                    const dist = haversineKm(uLat, uLng, jLat, jLng);
                    if (dist > RADIUS_KM) continue;

                    if (!best) {
                        best = { job, distanceKm: dist };
                    } else {
                        if (dist < best.distanceKm - 1e-6) {
                            best = { job, distanceKm: dist };
                        } else if (Math.abs(dist - best.distanceKm) <= 1e-6) {
                            const a = job.postedAtMillisKST || 0;
                            const b = best.job.postedAtMillisKST || 0;
                            if (a > b) best = { job, distanceKm: dist };
                        }
                    }
                }

                if (!best) continue; // 반경 내 공고 없음
                matched++;

                const userRef = db.collection("USERS").doc(uid);
                let granted = false;
                let jobForLog = null;

                // 선점(중복 방지): 오늘 미발송인 경우에만 today로 마킹
                await db.runTransaction(async (tx) => {
                    const s = await tx.get(userRef);
                    const cur = s.data() || {};
                    if (cur?.worknetDaily?.lastSentDateKST === today) {
                        granted = false; // 다른 워커/재실행에 의해 이미 처리됨
                        return;
                    }
                    const job = best.job;
                    const jobId = job.jobId || job.id;

                    tx.set(
                        userRef,
                        {
                            worknetDaily: {
                                lastSentDateKST: today,
                                lastRunAt: admin.firestore.FieldValue.serverTimestamp(),
                                lastJobId: String(jobId),
                                lastDistanceKm: Number(best.distanceKm.toFixed(3)),
                                lastRegion: job.region || null,
                            },
                        },
                        { merge: true }
                    );
                    jobForLog = { jobId, region: job.region || "", dist: best.distanceKm };
                    granted = true;
                });

                if (!granted) continue;

                // 🔔 실제 푸시
                try {
                    const jobId = String(best.job.jobId || best.job.id);
                    const title = "🆕 내 주변 새 일자리";
                    const body = "오늘 내 주변에 새로운 일자리 공고가 올라왔어요. 지금 확인해보세요!";

                    await admin.messaging().send({
                        token,
                        notification: { title, body },
                        android: {
                            notification: {
                                sound: "alarm_sound",
                                channel_id: "custom_channel_id_v2",
                                tag: jobId, // 동일 공고 콜랩스
                            },
                        },
                        data: {
                            type: "worknet",
                            jobId,
                            // 목록 열고 싶으면 아래로 교체 가능
                            // deeplink: "https://honglady.co.kr/share?type=worknet&uid=today"
                            deeplink: `https://honglady.co.kr/share?type=worknet&uid=${encodeURIComponent(jobId)}`
                        },
                    });

                    sent++;
                    if (SEND_THROTTLE_MS > 0) await sleep(SEND_THROTTLE_MS);
                    functions.logger.info(
                        `[worknetDaily] sent uid=${uid} jobId=${jobForLog.jobId} region=${jobForLog.region} distKm=${Number(jobForLog.dist.toFixed(3))}`
                    );
                } catch (e) {
                    // 실패해도 하루 1회 정책은 유지(선점 기록은 그대로)
                    functions.logger.error(`[worknetDaily] send fail uid=${uid} ${e.message}`);
                }
            }

            if (sent >= MAX_SENDS_PER_RUN) break;
            const last = snap.docs[snap.docs.length - 1];
            snap = await db
                .collection("USERS")
                .orderBy(admin.firestore.FieldPath.documentId())
                .startAfter(last)
                .limit(pageSize)
                .get();
        }

        functions.logger.info(`[worknetDaily] Summary scanned=${scanned} matched=${matched} sent=${sent} jobsLoaded=${todaysJobs.length}`);
        return null;
    });

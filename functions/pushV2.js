// functions/pushV2.js  (CommonJS 버전)
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

try { admin.app(); } catch (_) { admin.initializeApp(); }
const db = admin.firestore();

const CHANNEL_ID = "custom_channel_id_v2";
const DEFAULT_SOUND = "alarm_sound";
const DEFAULT_REGION = "asia-northeast1";
const DEFAULT_TZ = "Asia/Seoul";

// █ 테스트 토큰 (형이 준 값)
const TEST_TOKEN = "eaA3lQnPS1W46o7EqnKer2:APA91bGM_rCuhe06luK63CiuHYkma5YhvMcclKXkCUU4MxcltIkf7mxeQvwGhIGpnGlcqjOw21Fmv3O4HeaXpNhXobCCI5I2-PDAv51Khf6D_GDeE723WYU";

// 공통 전송기
async function sendFCM({ token, title, body, image, androidOverride = {} }) {
    if (!token) throw new Error("FCM token is required");

    const payload = {
        token,
        notification: { title, body, ...(image ? { image } : {}) },
        android: {
            notification: {
                sound: DEFAULT_SOUND,
                channel_id: CHANNEL_ID,
                ...androidOverride,
            },
        },
    };
    return admin.messaging().send(payload);
}

// 채팅 타입별 안내 문구
function alertMessageByType(type) {
    switch (type) {
        case "입장": return "상대방이 채팅방에 입장했어요.";
        case "의뢰인서명": return "서명을 요청드려요. 아직 서명이 완료되지 않았습니다.";
        case "홍여사서명": return "홍여사가 서명하셨어요. 다음 단계로 진행해주세요.";
        case "결제": return "결제가 필요해요. 아래 버튼을 눌러 진행해주세요.";
        case "완료": return "작업이 완료되었어요. 확인해 주세요.";
        case "후기": return "후기가 작성되었습니다.";
        case "TEXT":
        default: return "홍여사가 기다리고 있어요. 답장 부탁드려요!";
    }
}

// 간단 푸시 래퍼
const Push = {
    simple: (token, title, body, androidOverride = {}) =>
        sendFCM({ token, title, body, androidOverride }),
    chatByType: (token, type, androidOverride = {}) => {
        const body = alertMessageByType(type);
        return sendFCM({ token, title: "💬 채팅 알림", body, androidOverride });
    },
};

// ─────────────────────────────────────────────
// ① 스케줄: 채팅 무응답 리마인드
// ─────────────────────────────────────────────
exports.pushChatReminder = functions
    .region(DEFAULT_REGION)
    .pubsub.schedule("* * * * *") // 매분 체크(필요시 조정)
    .timeZone(DEFAULT_TZ)
    .onRun(async () => {
        const now = Date.now();
        const chatSnap = await db.collection("CHAT").get();

        for (const room of chatSnap.docs) {
            const chatId = room.id;
            if (chatId.startsWith("hongyeosa_fixed_")) continue;

            const msgs = await db
                .collection(`CHAT/${chatId}/messages`)
                .orderBy("CREATEDAT", "desc")
                .limit(1)
                .get();
            if (msgs.empty) continue;

            const latestDoc = msgs.docs[0];
            const latest = latestDoc.data();

            const createdAtMs = latest?.CREATEDAT?.toMillis
                ? latest.CREATEDAT.toMillis()
                : Number(latest?.CREATEDAT || 0);
            if (!createdAtMs) continue;

            const hours = (now - createdAtMs) / 36e5;
            if (hours > 72) continue; // 72시간 초과는 스킵

            const rData = room.data();
            const sender = latest.USERS_ID;
            const receiver =
                sender === rData.OWNER_ID ? rData.SUPPORTER_ID : rData.OWNER_ID;
            if (!receiver) continue;

            // 이미 읽음 여부
            const readBy = latest.READ_BY;
            const isRead = Array.isArray(readBy)
                ? readBy.includes(receiver)
                : !!(readBy && (readBy[receiver] === true));
            if (isRead) continue;

            // 이미 푸시 보냈으면 스킵
            if (latest.PUSH_SENT_FOR) continue;

            // 토큰 조회
            const userDoc = await db.collection("USERS").doc(receiver).get();
            const token = userDoc.data()?.USERINFO?.token;
            if (!token) continue;

            try {
                await Push.chatByType(token, latest.CHAT_CONTENT_TYPE || "TEXT");
                await db
                    .collection(`CHAT/${chatId}/messages`)
                    .doc(latestDoc.id)
                    .update({ PUSH_SENT_FOR: true });
            } catch (e) {
                functions.logger.warn(`[pushChatReminder] send fail: ${e.message}`);
            }
        }
        return null;
    });

// ─────────────────────────────────────────────
// ② 스케줄: 기념일 알림
// ─────────────────────────────────────────────
exports.scheduledAnniversaryAlert = functions
    .region(DEFAULT_REGION)
    .pubsub.schedule("0 10 * * *") // 매일 10:00
    .timeZone(DEFAULT_TZ)
    .onRun(async () => {
        const moment = require("moment-timezone");
        const today = moment().tz(DEFAULT_TZ).startOf("day");

        const memoSnap = await db.collection("MEMO").get();
        for (const doc of memoSnap.docs) {
            const data = doc.data();
            if (data.MEMOTYPE !== "기념일관리" || !data.DATE || data.ALARM === false) continue;

            const dday = moment(data.DATE).diff(today, "days");
            if (![3, 1, 0].includes(dday)) continue;

            const uid = data.USERS_ID;
            const userDoc = await db.collection("USERS").doc(uid).get();
            const token = userDoc.data()?.USERINFO?.token;
            if (!token) continue;

            const name = data.NAME || "기념일";
            let body = "";
            if (dday === 3) body = `3일 뒤는 "${name}"입니다. 미리 준비해 보세요 🎁`;
            if (dday === 1) body = `내일은 "${name}"입니다. 잊지 않으셨죠? 💡`;
            if (dday === 0) body = `오늘은 "${name}"입니다. 꼭 축하해 주세요! 💐`;

            try {
                await Push.simple(token, "🎉 기념일 알림", body);
            } catch (e) {
                functions.logger.warn(`[scheduledAnniversaryAlert] send fail: ${e.message}`);
            }
        }
        return null;
    });

// ─────────────────────────────────────────────
// ③ 스케줄: 5분마다 특정 토큰에 테스트 푸시
// ─────────────────────────────────────────────
exports.pushTestEvery5min = functions
    .region(DEFAULT_REGION)
    .pubsub.schedule("every 60 minutes")
    .timeZone(DEFAULT_TZ)
    .onRun(async () => {
        try {
            const t = new Date().toLocaleTimeString("ko-KR", { hour12: false, timeZone: DEFAULT_TZ });
            await sendFCM({
                token: TEST_TOKEN,
                title: "⏰ 테스트 푸시",
                body: `5분마다 발송되는 테스트 알림 (${t})`,
            });
            functions.logger.info("✅ 테스트 푸시 발송 성공");
        } catch (e) {
            functions.logger.error("❌ 테스트 푸시 발송 실패:", e.message);
        }
        return null;
    });

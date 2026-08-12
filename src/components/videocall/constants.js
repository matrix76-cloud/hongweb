// 🔧 WebRTC ICE 서버 설정
export const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
];

// 🔄 signaling용 Firestore 경로 (컬렉션명)
export const SIGNALING_COLLECTION = "video_signals";

// ⏱ 통화 제한 시간 (ms)
export const VIDEO_CALL_TIMEOUT = 180000; // 3분

// 🎛 모달 레이어 z-index 기준선
export const VIDEO_LAYER_Z_INDEX = 9999;
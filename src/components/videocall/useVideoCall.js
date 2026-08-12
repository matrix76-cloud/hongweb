import { useRef, useState, useContext, useEffect } from "react";
import { doc, setDoc, deleteDoc, onSnapshot, getDoc } from "firebase/firestore";
import { UserContext } from "../../context/User";
import { db } from "../../api/config";
import { SIGNALING_COLLECTION } from "./constants";

const ICE_SERVERS = [
    {
        urls: ["stun:hk-turn1.xirsys.com"]
    },
    {
        username: "3WqGIPj7Y0Y8dG7jlm6mlMv-u7VheSy7B0r0389BpNC_5xMNZTZy3L_B7Bj3WHxhAAAAAGhlLMtsZWVocg==",
        credential: "275c1a2a-5744-11f0-92bf-0242ac120004",
        urls: [
            "turn:hk-turn1.xirsys.com:80?transport=udp",
            "turn:hk-turn1.xirsys.com:3478?transport=udp",
            "turn:hk-turn1.xirsys.com:80?transport=tcp",
            "turn:hk-turn1.xirsys.com:3478?transport=tcp",
            "turns:hk-turn1.xirsys.com:443?transport=tcp",
            "turns:hk-turn1.xirsys.com:5349?transport=tcp"
        ]
    }
  ];


/**
 * 🎥 useVideoCall 훅
 * --------------------------------------------
 * 영상통화 기능의 모든 흐름을 제어하는 핵심 훅입니다.
 * 
 * 이 훅은 발신자와 수신자 양쪽에서 사용되며,
 * WebRTC 기반의 peer 연결을 생성하고, Firestore를 통해 signaling 데이터를 교환합니다.
 * 
 *  * 🔸 이 훅은 두 곳에서 각각 호출됩니다:
 * 
 * 1. App.js (수신자)
 *    - 상대방의 offer 신호를 감지하고 acceptCall() 실행
 *    - 수신자 역할: 상대방 연결을 수락하는 흐름 담당
 * 
 * 2. ContentLayout (또는 VideoChatModal 등, 발신자 UI)
 *    - startCall()을 통해 내가 먼저 통화 연결 시작
 *    - 발신자 역할: offer 생성, signaling 문서 생성
 * 
 * 각 인스턴스는 독립적으로 자신의 peer 연결 및 stream을 관리하며,
 * 상대방과의 signaling 데이터를 Firestore를 통해 교환합니다.
 * 
 * 
 * ✅ 주요 기능:
 * - startCall(): 발신자 → offer 생성 및 Firestore signaling 등록
 * - acceptCall(): 수신자 → offer 수신 후 answer 응답
 * - endCall(): peer 연결 종료 + signaling 문서 정리
 * - setupPeerConnection(): local/remote stream 설정, ICE candidate 감지/처리
 * 
 * ✅ 사용 예:
 * const {
 *   startCall,
 *   acceptCall,
 *   endCall,
 *   localRef,
 *   remoteRef,
 *   started,
 * } = useVideoCall({ chatId, isCaller, onRemoteConnected, receiverId });
 * 
 * ✅ 구성 요소:
 * - chatId: 통화 대상 채팅방 ID
 * - isCaller: 발신자인지 여부 (true면 startCall, false면 acceptCall)
 * - localRef / remoteRef: 내/상대방 영상 연결용 video DOM 참조
 * - onRemoteConnected: 상대방 stream 수신 완료 시 콜백 (ex. waiting → false)
 * - receiverId: 상대방 UID (signaling 저장에 사용)
 * 
 * 🔐 Firestore signaling 구조:
 * - {chatId}_offer: 발신자 offer 저장
 * - {chatId}_answer: 수신자 answer 저장
 * - {chatId}_ice: ICE candidate 교환용
 * 
 * 📞 이 훅은 영상통화의 연결, 유지, 종료까지 모든 흐름을 담당합니다.
 * 
/**
 * 📄 SDP (Session Description Protocol)
 * → "내가 어떤 방식으로 통화할 수 있는지 설명한 명세서"
 *    - 사용 가능한 오디오/비디오 코덱
 *    - 트랙 정보 (몇 개의 오디오/비디오 포함)
 *    - 연결 방식 (ICE 사용 여부 등)
 *    - 연결 전 협상 필수 (offer/answer)
 *
 * ❄️ ICE (Interactive Connectivity Establishment)
 * → "상대방과 연결할 수 있는 주소 후보(경로)를 찾는 과정"
 *    - 내부 IP, 외부 IP, TURN 서버 경로 등 다양한 candidate 생성
 *    - 각 candidate를 signaling 서버(Firebase 등)를 통해 교환
 *    - 가장 적합한 경로를 자동으로 선택하여 연결 시도
 */



const useVideoCall = ({ chatId, isCaller, onRemoteConnected, receiverId, localRef, remoteRef,user }) => {
    const pcRef = useRef(null);
    const [started, setStarted] = useState(false);
    let pendingCandidates = [];
    let remoteStream = null;

    const setupPeerConnection = async () => {
        console.log("🧪 setupPeerConnection 시작");

        if (pcRef.current && pcRef.current.signalingState !== "stable") {
            console.warn("⚠️ signalingState가 stable 아님 → Peer 초기화");
            pcRef.current.close();
            pcRef.current = null;
        }

        pcRef.current = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        console.log("🎥 로컬 스트림 요청");
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (localRef.current) {
            localRef.current.srcObject = localStream;
            console.log("📺 localRef 연결 완료");
        } else {
            console.warn("⚠️ localRef 없음");
        }

        localStream.getTracks().forEach((track) => {
            pcRef.current.addTrack(track, localStream);
            console.log("➕ 트랙 추가:", track.kind);
        });

        remoteStream = new MediaStream();

        pcRef.current.ontrack = (event) => {
            console.log("📡 ontrack 수신됨", event.streams);
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });




            const assignRemoteStream = () => {
                if (remoteRef.current) {
                    remoteRef.current.srcObject = remoteStream;
                    console.log("📺 remoteRef 연결 완료", remoteRef.current.srcObject);
                } else {
                    console.warn("⚠️ remoteRef 없음 (재시도 예정)");
                    setTimeout(assignRemoteStream, 200); // 재귀적으로 다시 시도
                }
            };

            assignRemoteStream();
        };

        pcRef.current.onicecandidate = async (event) => {
            if (event.candidate) {
                console.log("❄️ ICE candidate 생성:", event.candidate);
                try {
                    await setDoc(doc(db, SIGNALING_COLLECTION, `${chatId}_ice`), {
                        type: "ice",
                        candidate: {
                            candidate: event.candidate.candidate,
                            sdpMid: event.candidate.sdpMid,
                            sdpMLineIndex: event.candidate.sdpMLineIndex,
                        },
                    });
                    console.log("✅ ICE candidate Firestore 저장됨");
                } catch (err) {
                    console.error("❌ ICE 저장 실패", err.message);
                }
            }
        };

        onSnapshot(doc(db, SIGNALING_COLLECTION, `${chatId}_ice`), (docSnap) => {
            if (!docSnap.exists() || !docSnap.data()?.candidate) return;
            const { candidate, sdpMid, sdpMLineIndex } = docSnap.data().candidate;
            const iceCandidate = new RTCIceCandidate({ candidate, sdpMid, sdpMLineIndex });

            if (pcRef.current?.remoteDescription) {
                pcRef.current.addIceCandidate(iceCandidate)
                    .then(() => console.log("✅ ICE candidate 적용됨"))
                    .catch(err => console.warn("❌ ICE 추가 실패:", err.message));
            } else {
                console.warn("⏳ remoteDescription 없음 → ICE 보류 → 큐 저장");
                pendingCandidates.push(iceCandidate);
            }
        });

        console.log("🧪 setupPeerConnection 완료");
    };

    let answerHandled = false;
    const startCall = async () => {
        if (started || !isCaller) {
            console.warn("⛔ startCall 조건 불일치 - 이미 시작했거나 isCaller 아님");
            return;
        }

        try {
            console.log("🚀 startCall() 발신자 시작");
            await setupPeerConnection();

            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            console.log("📤 setLocalDescription 완료");

            await setDoc(doc(db, SIGNALING_COLLECTION, `${chatId}_offer`), {
                ...offer,
                type: "offer",
                callerId: user.USERS_ID,
                receiverId,
                callerName: user.USERINFO?.nickname || "익명",
            });
            console.log("✅ Firestore offer 저장 완료");
        } catch (err) {
            console.error("❌ startCall 중 오류", err.message);
        }

        onSnapshot(doc(db, SIGNALING_COLLECTION, `${chatId}_answer`), (docSnap) => {
            if (!docSnap.exists()) return;
            if (!pcRef.current || answerHandled) return;

            answerHandled = true;
            const answer = new RTCSessionDescription(docSnap.data());
            console.log("📥 answer 수신 감지", answer);
            console.log("📶 signalingState:", pcRef.current.signalingState);
            console.log("📶 currentRemoteDescription:", pcRef.current.remoteDescription?.type);

            pcRef.current.setRemoteDescription(answer).then(() => {
                console.log("📥 answer 설정 완료");

                for (const candidate of pendingCandidates) {
                    pcRef.current.addIceCandidate(candidate);
                }
                pendingCandidates = [];

                onRemoteConnected?.();
            }).catch(err => console.error("❌ setRemoteDescription 실패:", err.message));
        });

        setStarted(true);
    };

    const acceptCall = async () => {
        if (started || isCaller) {
            console.warn("⛔ acceptCall 조건 불일치 - 이미 시작했거나 수신자가 아님");
            return;
        }

        try {
            console.log("📞 수신자 acceptCall 시작");
            await setupPeerConnection();

            const offerSnap = await getDoc(doc(db, SIGNALING_COLLECTION, `${chatId}_offer`));
            if (!offerSnap.exists()) {
                console.error("❌ offer 문서가 존재하지 않음");
                return;
            }

            const offer = new RTCSessionDescription(offerSnap.data());
            await pcRef.current.setRemoteDescription(offer);
            console.log("📍 setRemoteDescription 완료");

            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            console.log("📤 setLocalDescription(answer) 완료");

            await setDoc(doc(db, SIGNALING_COLLECTION, `${chatId}_answer`), answer);
            console.log("✅ Firestore answer 저장 완료");

            for (const candidate of pendingCandidates) {
                pcRef.current.addIceCandidate(candidate);
            }
            pendingCandidates = [];

            onRemoteConnected?.();
            setStarted(true);
        } catch (err) {
            console.error("❌ acceptCall 중 오류", err.message);
        }
    };

    const endCall = async () => {
        try {
            console.log("📴 endCall 호출됨");
            pcRef.current?.close();
            pcRef.current = null;
            setStarted(false);

            await deleteDoc(doc(db, SIGNALING_COLLECTION, `${chatId}_offer`));
            await deleteDoc(doc(db, SIGNALING_COLLECTION, `${chatId}_answer`));
            await deleteDoc(doc(db, SIGNALING_COLLECTION, `${chatId}_ice`));
            console.log("🧹 signaling 문서 삭제 완료");
        } catch (err) {
            console.error("❌ endCall 중 오류", err.message);
        }
    };

    return {
        startCall,
        acceptCall,
        endCall,
        started,
    };
};

export default useVideoCall;

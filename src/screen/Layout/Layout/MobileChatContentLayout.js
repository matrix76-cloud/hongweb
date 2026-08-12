

import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import MobileFooter from "../Footer/MobileFooter";
import MobileChatContentheader from "../Header/MobileChatContentheader";
import MobileCommunityheader from "../Header/MobileCommunityheader";
import CommonHeader from "../../../components/CommonHeader";
import { imageDB } from "../../../utility/imageData";
import { FiVideo } from "react-icons/fi";
import MobileWorkerPopup from "../../../modal/MobileWorkerPopup";
import { getWorkerByUserId } from "../../../service/WorkerService";
import { Readuserbyusersid } from "../../../service/UserService";
import useVideoCall from "../../../components/videocall/useVideoCall";
import VideoChatModal from "../../../components/videocall/VideoChatModal";
import styled from "styled-components";
import { getFontSize } from "../../../utility/fontsize";



const MobileChatContentLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showCallerModal, setShowCallerModal] = useState(false);

  const isFixedChat = props.ITEM.CHAT_ID?.startsWith("hongyeosa_fixed_");

  const isMeOwner = user?.USERS_ID === props.ITEM.OWNER_ID;
  const targetUser = isMeOwner ? props.ITEM.SUPPORTER : props.ITEM.OWNER;
  const [waiting, setWaiting] = useState(true);
  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const lastMessage = props.messages?.[props.messages.length - 1];
  const isBlocked = lastMessage?.CHAT_CONTENT_TYPE === "EXIT" && lastMessage?.USERS_ID !== user.USERS_ID;
  


  const {
    startCall: callerStartCall,
    endCall: callerEndCall,
    started: callerStarted
  } = useVideoCall({
    chatId: props.ITEM.CHAT_ID,
    isCaller: true, // 발신자용
    receiverId: targetUser?.USERS_ID,
    localRef,
    remoteRef,
    onRemoteConnected: () => {
      console.log("✅ 연결 성공 → waiting 해제");
      setWaiting(false); // ← 이게 **반드시 호출돼야 함**
    }
  });


  const handleProfilePopup = async () => {
    const workers = await getWorkerByUserId(targetUser.USERS_ID);

    if (workers.length > 0) {
      // ✅ 워커 등록된 경우 → MobileWorkerPopup 열기
      setSelectedWorker(workers[0]);
    } else {
      // ❗️워커가 아니라면 → USERS 컬렉션 정보 가져오기
      const userData = await Readuserbyusersid(targetUser.USERS_ID);
      if (!userData) {
        alert("상대방 정보를 확인할 수 없습니다.");
        return;
      }

      // ✅ 일반 사용자 팝업 오픈 (별도 컴포넌트 추천)
      setSelectedUser(userData);
    }
  };

  const handleChat = async (SUPPORTER) => {
      const OWNER = user;
      if (!SUPPORTER || !OWNER) return;

      if (OWNER.USERS_ID === SUPPORTER.users_id) {
          alert("본인에게는 채팅을 시작할 수 없습니다.");
          return;
      }

      const CHAT_ID = await checkExistingRoom({
          OWNER_ID: OWNER.USERS_ID,
          SUPPORTER_ID: SUPPORTER.users_id,
      });

      if (CHAT_ID) {
          // 기존 채팅방으로 이동
          window.location.href = `/chat/${CHAT_ID}`;
          return;
      }

      const { id: WORK_ID, WORK_INFO } = await createVirtualWork({ OWNER });

      if (WORK_ID === -1) {
          alert("일감 생성 실패. 잠시 후 다시 시도해주세요.");
          return;
      }

      await ChatRequestComplete(WORK_ID, SUPPORTER, WORK_INFO);
  };

  const chatId = props.ITEM?.CHAT_ID;


  const handleStartVideoCall = () => {


    const slimUser = {
      USERS_ID: user.USERS_ID,
      nickname: user.USERINFO?.nickname || "익명",
      profileImg: user.USERINFO?.userimg || "",
    };

    const userEncoded = encodeURIComponent(JSON.stringify(slimUser));


    const query = new URLSearchParams({
      chatId: props.ITEM.CHAT_ID,
      calleeName: targetUser?.USERINFO?.nickname || "상대방",
      calleeProfileImg: targetUser?.USERINFO?.userimg || "",
      receiverId: props.ITEM.SUPPORTER.USERS_ID,
      isCaller: true,
    }).toString();

    const finalUrl = `/VideoCall?${query}&user=${userEncoded}`;

    window.open(finalUrl, '_blank'); // 또는 '_self'

  };

  return (
    <div style={{ovderflow:"hidden"}}> 


      <CommonHeader
        title={isFixedChat ? "고객센터 님과 대화" : `${props.name} 님과 대화`}
        rightImage={isFixedChat ? imageDB.hongladywebtoon : props.image}
        onRightImageClick={() => {
          console.log("✅ 우측 이미지 클릭!");
          handleProfilePopup();

        }}
        pattern="default"
        titleAlign="left"
        pageId="Mobile_chatcontent"
        videoCallIcon={
          !isBlocked && isFixedChat ? null : (
            <></>
            // <VideoCallTextButton onClick={handleStartVideoCall}>
            //   <FiVideo size={18} color="#FFF" />
            //   <VideoCallLabel>영상통화</VideoCallLabel>
            // </VideoCallTextButton>
          )
        }
      />

      <main>
        {props.children}
      </main>

      {showCallerModal && (
        <VideoChatModal
          localRef={localRef}
          remoteRef={remoteRef}
          startCall={callerStartCall}
          endCall={callerEndCall}
          chatId={chatId}
          onClose={() => {
            callerEndCall();
            setShowCallerModal(false);
          }}
          user={user}
          waiting={waiting} // 응답 대기 중 UI
          calleeName={targetUser?.USERINFO?.nickname || "상대방"}
          calleeProfileImg={targetUser?.USERINFO?.userimg}
        />
      )}


      {selectedWorker && (
        <MobileWorkerPopup
          data={selectedWorker}
          containerStyle={{ height: 'calc(100vh - 40px)' }}
          onChat={() => {
            handleChat(selectedWorker);
          }}
          onClose={() => setSelectedWorker(null)}
        />)}

    </div>
  );
};

export default MobileChatContentLayout;


const VideoCallTextButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 6px;
  background: #2577ff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;

  
`;

const VideoCallLabel = styled.span`
  font-size: ${() => getFontSize(13)}px !important;
  color: #FFF;
`;
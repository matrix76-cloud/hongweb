

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
import CommonAIHeader from "../../../components/CommonAIHeader";



const MobileAIContentLayout = (props) => {
  const { user, dispatch } = useContext(UserContext);
  const navigation = useNavigate();

  return (
    <div style={{ovderflow:"hidden"}}> 

      <CommonAIHeader
        title={props.name}
        onResetConversation={props.onResetConversation} // ✅ 삭제 버튼 콜백
        resetting={props.resetting}                     // ✅ 진행중 표시
      />

      <main>
        {props.children}
      </main>



    </div>
  );
};

export default MobileAIContentLayout;



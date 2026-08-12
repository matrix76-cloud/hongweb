

import React, { Fragment, useContext, useEffect, useState} from "react";
import './Footer.css';
import styled, { keyframes } from 'styled-components';
import { imageDB } from '../../../utility/imageData';
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User";
import { FiHome, FiUser, FiShare2,FiGrid } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { MOBILEMAINMENU } from "../../../utility/screen";
import { useMediaQuery } from "react-responsive";
import { getFontSize, getFontSizeEx } from "../../../utility/fontsize";
import { IoMdHome } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { GrDocumentConfig } from "react-icons/gr";
import { AiOutlineCoffee } from "react-icons/ai";
import { useUnreadChatCount } from "../../../hooks/useUnreadChatCount";
import moment from "moment";
import { Readuserbyusersid } from "../../../service/UserService";



const ConfessButtonWrapper = styled.div`
  position: relative;
  width: 60px; /* 공간 확보용 */
`;



const FooterContent = styled.div`
  padding: 20px;
  justify-content: flex-start;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom);
`

const ButtonEnableText = styled.div`
  font-size: ${() => getFontSizeEx(12)}px !important;
  color :#1A1E28;
  font-family: 'Pretendard-SemiBold';
`

const ButtonDisableText = styled.div`
  font-size: ${() => getFontSizeEx(11) }px !important;
  color :#BOBOBO;
  font-family: 'Pretendard-Regular';

`

const FooterButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ChatButton = styled(FooterButton)`
  margin-right: 4px;
`;

const LifeButton = styled(FooterButton)`
  margin-left: 4px;
`;
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 126, 25, 0.4);
    border-width: 2px;
  }
  50% {
    box-shadow: 0 0 0 6px rgba(255, 126, 25, 0.15);
    border-width: 3px; /* ✅ 살짝 더 두껍게 */
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 126, 25, 0.4);
    border-width: 2px;
  }
`;
const ConfessButton = styled.button`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FFF0DF;
  border :0.5px solid #f7f6f6;
  border-radius: 50%;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 0;

  animation: ${pulse} 2.4s infinite ease-in-out;
  border: 0.5px solid rgba(255, 126, 25, 0.4); // 약간의 붉은 테두리
`;

const ConfessIcon = styled.img`
  width: ${() => getFontSize(40)}px;
  height: ${() => getFontSize(40)}px;
  object-fit: contain;
`;


const ChatIconWrapper = styled.div`
  position: relative;
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -6px;
  background-color: #FF4D4F;
  color: #fff;
  font-size: ${() => getFontSize(10)}px !important;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transform: scale(0.95);
  z-index: 1;
`;



const MobileFooter = ({type}) => {

  const navigation = useNavigate();
  const {user, dispatch} = useContext(UserContext);
  const [foottype, setFoottype] = useState(0);
  const [refresh, setRefresh] = useState(1);
  const location = useLocation();

  useEffect(()=>{

  },[refresh])

  const _handleMain = () => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      mapDiv.remove(); // ✅ 수동 제거
    }
    navigation("/Mobilemain");
  }
  const _handleRoom=()=>{
    navigation("/Mobileroom");  
  }
  const _handleMap=()=>{
    navigation("/Mobilemap" ,{state :{WORK_ID :"", TYPE : ""}});
  }
  const _handleCommunity=()=>{
    navigation("/Mobilecommunity");
  }

  const _handleLeisure=()=>{
    navigation("/Mobileleisure");
  }
  const _handleLife = () => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      mapDiv.remove(); // ✅ 수동 제거
    }
    navigation("/Mobilelife");
  }

  const _handleChat = () => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      mapDiv.remove(); // ✅ 수동 제거
    }
    navigation("/Mobilechat");   
  }

  const _handleConfig = () => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      mapDiv.remove(); // ✅ 수동 제거
    }
    navigation("/Mobileconfig");
  }

  const _handleConfess = () => {
    navigation("/Mobileconfess");
  }

  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 500, maxWidth: 767 });

  const { totalUnread } = useUnreadChatCount(user?.USERS_ID);


  
  useEffect(() => {
    const trySendSupportMessages = async () => {
      if (!user?.USERS_ID) return;

      const USERS_ID = user.USERS_ID;
      const userinfo = await Readuserbyusersid({ USERS_ID });
      const flags = userinfo.supportChatFlags || {};

      const today = moment().format("YYYY-MM-DD");
      const createdDate = moment(
        typeof userinfo.CREATEDT === "number"
          ? userinfo.CREATEDT
          : userinfo.CREATEDT?.toDate?.()
      ).format("YYYY-MM-DD");

      try {
        // 🎯 1. 오늘 설치 + welcome 안 보낸 유저만
        if (createdDate === today && !flags.welcomeSent) {
          await axios.post("https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/supportWelcomeMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: USERS_ID,
              userInfo: userinfo.USERINFO,
              CREATEDT: userinfo.CREATEDT,
              supportChatFlags: flags,
            }),
          });

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // 🎯 2. 리마인드는 조건 상관없이 무조건 호출 (서버는 무지성 저장)
        if (!flags.remindSent) {
          await axios.post("https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/supportRemindMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: USERS_ID,
              userInfo: userinfo.USERINFO,
              LASTLOGINDT: userinfo.LASTLOGINDT,
              CREATEDT: userinfo.CREATEDT,
              supportChatFlags: flags,
            }),
          });
        }
      } catch (e) {
        console.warn("📛 메시지 전송 실패", e);
      }
    };

    trySendSupportMessages();
  }, [user?.USERS_ID]);
  



  return (
    <Fragment>
      <div className={`${isGalaxyFlipUnfolded ? "site-mobile-footer1" : "site-mobile-footer2"}`}>
        <div className="buttonview">
          <div className="button">
            {type === MOBILEMAINMENU.HOMEMENU ? (
              <>
                <div className="imageicon" onClick={_handleMain}>
                  <IoMdHome size={28} />
                </div>
                <ButtonEnableText>홈</ButtonEnableText>
              </>
            ) : (
              <>
                <div className="imageicon" onClick={_handleMain}>
                  <IoMdHome size={28} color={'#999'} />
                </div>
                <ButtonDisableText>홈</ButtonDisableText>
              </>
            )}
          </div>
          <div className="button chat-button">
            {type === MOBILEMAINMENU.CHATMENU ? (
              <>
                <div className="imageicon" onClick={_handleChat}>
                  <ChatIconWrapper>
                    <IoChatbubbleEllipsesOutline size={28} />
                    {totalUnread > 0 && <UnreadBadge>{totalUnread}</UnreadBadge>}
                  </ChatIconWrapper>
                </div>
                <ButtonEnableText>채팅하기</ButtonEnableText>
              </>
            ) : (
              <>
                <div className="imageicon" onClick={_handleChat}>
                  <ChatIconWrapper>
                    <IoChatbubbleEllipsesOutline size={28} color={'#999'} />
                    {totalUnread > 0 && <UnreadBadge>{totalUnread}</UnreadBadge>}
                  </ChatIconWrapper>
                </div>
                <ButtonDisableText>채팅하기</ButtonDisableText>
              </>
            )}
          </div>

          {/* 🔥 고발 버튼 */}
          {/* <div className="confess-button-wrapper">
            <ConfessButton onClick={_handleConfess}>
              {
                type === MOBILEMAINMENU.CONFESSMENU ? (<ConfessIcon src={imageDB.nosound} alt="confess" />) : (<ConfessIcon src={imageDB.sound} alt="confess" />)
              }

            </ConfessButton>
          </div> */}
          <div className="button life-button" >
            {type === MOBILEMAINMENU.LIFEMENU ? (
              <>
                <div className="imageicon" onClick={_handleLife}>
                  <AiOutlineCoffee size={28} />
                </div>
                <ButtonEnableText>라이프</ButtonEnableText>
              </>
            ) : (
              <>
                <div className="imageicon" onClick={_handleLife}>
                  <AiOutlineCoffee size={28} color={'#999'} />
                </div>
                <ButtonDisableText>라이프</ButtonDisableText>
              </>
            )}
          </div>



          <div className="button">
            {type === MOBILEMAINMENU.CONFIGMENU ? (
              <>
                <div className="imageicon" onClick={_handleConfig}>
                  <GrDocumentConfig size={28} />
                </div>
                <ButtonEnableText>마이</ButtonEnableText>
              </>
            ) : (
              <>
                <div className="imageicon" onClick={_handleConfig}>
                  <GrDocumentConfig size={28} color={'#999'} />
                </div>
                <ButtonDisableText>마이</ButtonDisableText>
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MobileFooter;

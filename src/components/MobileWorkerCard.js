import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MobileWorkerPopup from "../modal/MobileWorkerPopup";
import { IoTimeOutline } from "react-icons/io5";
import { GiMoneyStack } from "react-icons/gi";
import { Column, FlexstartColumn } from "../common/Column";
import { FlexstartRow } from "../common/Row";
import { getFontSize } from "../utility/fontsize";
import { UserContext } from "../context/User";
import { distanceFunc } from "../utility/region";
import HongButton from "./HongButton";
import { checkExistingRoom, createVirtualWork, ReadWorkByIndividually } from "../service/WorkService";
import { Readuserbyusersid } from "../service/UserService";
import { CreateChat, NewCreateMessage } from "../service/ChatService";
import { CreateContact } from "../service/ContactService";
import { CHATCONTENTTYPE, CONTACTTYPE, PCMAINMENU } from "../utility/screen";

import { Toaster, toast } from 'sonner';
import { imageDB } from "../utility/imageData";




const ExpertBadge = styled.div`
  display: inline-block;
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: bold;
  color: #d97706;
  background: #fef3c7;
  padding: 2px 8px;
  border-radius: 999px;
  margin-top: 4px;
  margin-right: 4px;
`;

const IntroBadge = styled.div`
  display: inline-block;
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: bold;
  color: #2563eb;
  background: #dbeafe;
  padding: 2px 8px;
  border-radius: 999px;
  margin-top: 4px;
`;



const CardContainer = styled.div`
  display: flex;
  padding: 16px 0;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  align-items: center;
  border-bottom: 6px solid #f2f3f5;
  margin-left: -16px;
  padding-left: 16px;
  padding-right: 16px;
  width: calc(100% + 32px);
  box-sizing: border-box;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  margin-right: 12px;
`;


const CardInfoArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NameRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${() => getFontSize(14)}px !important;
`;

const Nickname = styled.div`
  font-weight: bold;
  color: #111;
`;

const PhoneOn = styled.span`
  font-size: ${() => getFontSize(10)}px !important;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #FF6B6B, #ee5a24);
  padding: 2px 7px;
  border-radius: 999px;
  line-height: 1.2;
`;

const PhoneOff = styled.span`
  font-size: ${() => getFontSize(10)}px !important;
  font-weight: 600;
  color: #bbb;
  background: #f0f0f0;
  padding: 2px 7px;
  border-radius: 999px;
  line-height: 1.2;
`;

const Meta = styled.div`
  color: #555;
  font-size: ${() => getFontSize(13)}px !important;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TAG_COLORS = [
  { bg: "#EEF2FF", color: "#4338CA" },
  { bg: "#FFF1F2", color: "#BE123C" },
  { bg: "#ECFDF5", color: "#047857" },
  { bg: "#FFF7ED", color: "#C2410C" },
  { bg: "#F0F9FF", color: "#0369A1" },
  { bg: "#FDF4FF", color: "#9333EA" },
];

const Tag = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 600;
  background: ${({ $idx }) => TAG_COLORS[$idx % TAG_COLORS.length].bg};
  color: ${({ $idx }) => TAG_COLORS[$idx % TAG_COLORS.length].color};
  padding: 5px 12px;
  border-radius: 999px;
`;

const DistanceRow = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #888;
  display: flex;
  distplay: flex;
  align-items: center;
`;

const IntroText = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;



const Card = styled.div`
  padding: 20px;
  border-radius: 16px;
  min-height: 300px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;                // ✅ 연한 테두리 추가
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);   // ✅ 살짝 더 깊은 그림자
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width:100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 21px !important;
  font-weight: bold;
  margin-top: 4px;
`;

const SubInfo = styled.div`
  font-size: 14.5px !important;
  color: #666;
`;


const TagBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
`;


const Row = styled.div`
  font-size: 14px !important;
  margin: 4px 0;
  white-space: pre-line;
`;

const SelfIntroRow = styled.div`
  font-size: 14px !important;
  margin-top: 6px;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Button = styled.button`
  margin-top: 14px;
  width: 100%;
  background: #4F8BFF;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16.5px !important;
`;

const Badge = styled.div`
  font-size: 13px !important;
  font-weight: 600;
  color: ${(props) => (props.isBusiness ? "#d97706" : "#2563eb")};
  background: ${(props) => (props.isBusiness ? "#fef3c7" : "#eff6ff")};
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 6px;
`;

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 4px 0;

  svg {
    margin-right: 6px;
    font-size: 16px;
    vertical-align: middle;
  }
`;



const ApplyButton = styled.button`
  margin-top: 16px;
  width: 100%;
  background: #ededed;
  color: #333;
  padding: 12px 0;
  font-weight: bold;
  font-size: 16.5px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ddd;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ListenButton = styled.div`
  margin-top: 4px;
  padding: 4px 8px;
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 6px;
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
  width: fit-content;
  align-self: flex-start;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

// ✅ 스켈레톤 + 블러업 이미지
const ImgFrame = styled.div`
  position: relative;
  width: ${({ size }) => size || 80}px;
  height: ${({ size }) => size || 80}px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
  margin-right: 12px;
`;

const Shimmer = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(90deg,#f3f4f6 0%, #eee 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shine 1.1s linear infinite;
  @keyframes shine { 0%{background-position: 200% 0} 100%{background-position: -200% 0} }
`;

const Img = styled.img`
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  filter: ${({ $blur }) => ($blur ? "blur(12px) saturate(110%)" : "none")};
  transform: scale(${({ $blur }) => ($blur ? 1.05 : 1)});
  transition: opacity .25s ease, filter .35s ease, transform .35s ease;
`;

function SmartImage({ thumb, src, alt = "", size = 80 }) {
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);

  return (
    <ImgFrame size={size} aria-label={alt}>
      {!fullLoaded && <Shimmer />}
      {thumb && (
        <Img
          src={thumb}
          alt=""
          $blur
          $show={thumbLoaded && !fullLoaded}
          decoding="async"
          loading="eager"
          onLoad={() => setThumbLoaded(true)}
          onError={() => setThumbLoaded(true)}
        />
      )}
      <Img
        src={src}
        alt={alt}
        $show={fullLoaded}
        decoding="async"
        loading="lazy"
        fetchpriority="low"
        onLoad={() => setFullLoaded(true)}
        onError={() => setFullLoaded(true)} // 실패해도 스켈레톤 제거
      />
    </ImgFrame>
  );
}



const MobileWorkerCard = ({ data }) => {
  const navigate = useNavigate();
  const isBusiness = data.type === "business";
  const { dispatch, user } = useContext(UserContext);

  const [selectedWorker, setSelectedWorker] = useState(null);
  

  let distanceKm = null;
  if (user?.USERINFO?.latitude && user?.USERINFO?.longitude && data?.latitude && data?.longitude) {
    const raw = distanceFunc(user?.USERINFO?.latitude, user?.USERINFO?.longitude, data.latitude, data.longitude);
    distanceKm = raw.toFixed(1);
  }


  const onChat = async () => {
    
    const SUPPORTER =  selectedWorker;

    const OWNER = user;

    if (!SUPPORTER || !OWNER) return;

    console.log("TCL: onChat -> OWNER", OWNER);
    console.log("TCL: onChat -> SUPPORTER", SUPPORTER);

    // 1. 자기 자신 방지
    if (OWNER.USERS_ID === SUPPORTER.USERS_ID) {
      toast.info("본인에게는 채팅을 시작할 수 없습니다.");
      return;
    }

    // 2. 기존 채팅방 있는지 확인
    const ROOM_ID = await checkExistingRoom({
      OWNER_ID: OWNER.USERS_ID,
      SUPPORTER_ID: SUPPORTER.users_id,
    });

    console.log("TCL: onChat -> ROOM_ID", ROOM_ID);
    
    if (ROOM_ID) {
      _handleChat();
      return;
    }

    // 3. 가상 일감 생성
    const { id: WORK_ID, WORK_INFO } = await createVirtualWork({ OWNER });

    if (WORK_ID === -1) {
      toast.error("일감 생성 실패. 잠시 후 다시 시도해주세요.");
      return;
    }

    console.log("TCL: onChat -> WORK_ID", WORK_ID);
    // 4. 기존 채팅 흐름 호출
    await ChatRequestComplete(WORK_ID, SUPPORTER, WORK_INFO); // SUPPORTER 인자 추가해야 될 수도 있음
  }

  const ChatRequestComplete = async (WORK_ID, SUPPORTER, WORK_INFO) => {


    const WORK_DATA = await ReadWorkByIndividually({ WORK_ID });

    console.log("reqcomplete", WORK_DATA);


    const OWNER = await Readuserbyusersid({ USERS_ID: WORK_DATA.USERS_ID });

    console.log("OWNER", OWNER);
    console.log("SUPPORTER", SUPPORTER);
    const OWNER_ID = OWNER.USERS_ID;
    const SUPPORTER_ID = SUPPORTER.users_id;

  
    // ✅ 지원자 전체 정보 조회
    const SUPPORTER_INFO = await Readuserbyusersid({ USERS_ID: SUPPORTER_ID });

    if (!SUPPORTER_INFO || !SUPPORTER_INFO.USERS_ID || !SUPPORTER_INFO.USERINFO) {
      alert("해당 지원자의 정보가 없습니다.");
      return;
    }

    const TYPE = PCMAINMENU.HOMEMENU;
    const INFO = {
      ...WORK_DATA,
      isVirtualWork: true
    };

    const CHAT_ID = await CreateChat({
      OWNER, OWNER_ID, SUPPORTER: SUPPORTER_INFO, SUPPORTER_ID, INFO, TYPE,
    });

    const CONTACT_INFO = WORK_INFO;
    const createcontact = await CreateContact({
      OWNER_ID, SUPPORTER_ID, CONTACT_STATUS: CONTACTTYPE.INIT,
      CONTACT_INFO, ID: CHAT_ID, RIGHT_SIGN: "", WORKTYPE: TYPE,
    });

    const CHAT_CONTENT_TYPE = CHATCONTENTTYPE.ENTER;
    const read = [user.USERS_ID, SUPPORTER_ID];
    const msg = `${OWNER.USERINFO.nickname}님이 대화를 시작하였습니다.`;

    await NewCreateMessage({
      CHAT_ID,
      msg,
      users_id: user.USERS_ID,
      read,
      CHAT_CONTENT_TYPE,
      AlarmTarget_ID: SUPPORTER_ID
    });

    _handleChat();

  };


  const _handleChat = () => {
 
    navigate("/Mobilechat");
  }


  return (
    <CardContainer >

    {selectedWorker && (
          <MobileWorkerPopup
          data={selectedWorker}
          onChat={onChat}
          onClose={() => setSelectedWorker(null)}
          />
      )}
      
      <Column onClick={() => { setSelectedWorker(data) }}>
        <SmartImage
          src={data.profileImg || imageDB.hongladywebtoon}
          alt={data.chatName || "프로필"}
          size={100}
        />
      </Column>


      <CardInfoArea>
        <NameRow>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Nickname>{data.chatName}</Nickname>
            {data.phone?.trim()
              ? <PhoneOn>연락가능</PhoneOn>
              : <PhoneOff>번호없음</PhoneOff>
            }
          </div>
          <Meta>{data.gender === 'male' ? '남성' : '여성'} / {data.age}</Meta>
        </NameRow>
        
        {distanceKm && (
          <DistanceRow>📍내 위치로부터 약 {distanceKm}km</DistanceRow>
        )}


        <TagRow>
          {data.tags?.slice(0, 3).map((tag, i) => (
            <Tag key={i} $idx={i}>#{tag}</Tag>
          ))}
        </TagRow>
      </CardInfoArea>
      <Toaster position="bottom-right"/>
    </CardContainer>
           );
};

export default MobileWorkerCard;

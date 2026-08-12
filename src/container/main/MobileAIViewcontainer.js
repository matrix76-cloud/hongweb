import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../context/User";
import { DataContext } from "../../context/Data";
import { useSelector } from "react-redux";
import { getFontSize } from "../../utility/fontsize";
import { Column, FlexstartColumn } from "../../common/Column";
import Empty from "../../components/Empty";
import { imageDB } from "../../utility/imageData";
import { getAiWorkers } from "../../service/WorkerService";
import { BetweenRow } from "../../common/Row";
import { doc, updateDoc, serverTimestamp, deleteField } from 'firebase/firestore';
import { db } from "../../api/config";
import MobileWorkerPopup from "../../modal/MobileWorkerPopup";
import { checkExistingRoom, createVirtualWork, ReadWorkByIndividually } from "../../service/WorkService";
import { Readuserbyusersid } from "../../service/UserService";
import { CreateChat } from "../../service/ChatService";
import { CreateContact } from "../../service/ContactService";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // 꼭 import 해야 blur 동작함

import { Toaster, toast } from 'sonner';

const HEADER_HEIGHT = 47;
const FOOT_HEIGHT = 65;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT + FOOT_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
  background-color: #fff;
  padding: 0 16px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const AiImageCard = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  background: #fff;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: filter 0.4s ease;
`;

const Caption = styled.div`
  padding: 8px 12px;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 500;
  color: #333;
`;


const Name = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  font-family: Pretendard-SemiBold;
  color: #111;
`;

const Meta = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  color: #666;
`;

const CategoryList = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top:5px;
`;

const CategoryTag = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  background: #E6F0FF;
  color: #333;
  border-radius: 9999px;
  padding: 2px 6px;
  white-space: nowrap;
  flex-shrink: 0;
  border: 1px solid #ddd; // 또는 accent 컬러
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


const MobileAIViewcontainer = ({ containerStyle }) => {
  const { value } = useSelector((state) => state.menu);
  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [aiList, setAiList] = useState([]);

  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {

      const latitude = user?.USERINFO?.latitude;
      const longitude = user?.USERINFO?.longitude;
      const checkdistance = 4;

      const list = await getAiWorkers(latitude, longitude, checkdistance);

      console.log("AI AI_NEWIMAGE_COMPRESSED", list.length);
      setAiList(list || []);
    };
    fetchAI();
  }, []);


  const handleImageDelete = async (item) => {


  };

    // ✅ 채팅 핸들러 내부 구현
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
    };
  
  return (
    <>
      <Container style={containerStyle}>
        <ImageGrid>
          {aiList.map((item, idx) => (
            <AiImageCard key={idx} onClick={() => setSelectedWorker(item)}>
       

              <LazyLoadImage
                alt="AI Image"
                src={item.AI_NEWIMAGE_COMPRESSED}
                effect="blur"
                width="100%"
                style={{
                  aspectRatio: "1 / 1", // 정사각형 비율
                  objectFit: "cover",
                  borderRadius: 12
                }}
              />


              <FlexstartColumn style={{padding:5}}>
                <BetweenRow style={{width:"100%"}}>
                  <Name>{item.chatName}</Name>
                  <Meta>{item.gender === 'male' ? '남성' : item.gender === 'female' ? '여성' : '-'} / {item.age}</Meta>
                </BetweenRow>
                {item.official && item.tts_audio_url && (
                  <ListenButton
                    onClick={(e) => {
                      e.stopPropagation();
                         const audio = new Audio(item.tts_audio_url);
           
                             // 🎧 로딩 표시
                             const toastId = toast.loading("🎧 음성 준비 중입니다...", {
                               duration: Infinity,
                               style: {
                                 fontSize: '13px',
                                 padding: '6px 10px',
                                 borderRadius: '8px',
                                 background: '#f4f4f5',
                                 color: '#111',
                                 boxShadow: 'none',
                               }
                             });
           
                             audio.onloadeddata = () => {
                               // 로딩 토스트 제거
                               toast.dismiss(toastId);
           
                               // 🎧 재생 중 표시
                               const playToastId = toast("🎧 음성을 재생 중입니다...", {
                                 duration: Infinity, // ✅ 직접 닫기 전까지 유지
                                 style: {
                                   fontSize: '13px',
                                   padding: '6px 10px',
                                   borderRadius: '8px',
                                   background: '#f4f4f5',
                                   color: '#111',
                                   boxShadow: 'none',
                                 }
                               });
           
                               audio.play();
           
                               audio.onended = () => {
                                 toast.dismiss(playToastId); // ✅ 재생 끝나면 닫기
                               };
                             };
           
                             audio.onerror = () => {
                               toast.dismiss(toastId);
                               toast.error("음성 재생에 실패했습니다 😢");
                             };
                    }}
                  >
                    🎧 AI 요약 듣기
                  </ListenButton>
                )}
                <CategoryList>
                  {item.tags.map((cat, idx) => (
                    <CategoryTag key={idx}>{cat}</CategoryTag>
                  ))}
                </CategoryList>
              </FlexstartColumn>
  
      
            </AiImageCard>
          ))}

          {selectedWorker && (
                <MobileWorkerPopup
                    data={selectedWorker}
                    containerStyle={{ height: 'calc(100vh - 40px)'}}
                    onChat={() => handleChat(selectedWorker)}
                    onClose={() => setSelectedWorker(null)}
                />
          )}
          
        </ImageGrid>
                <Toaster position="bottom-right" richColors />
      </Container>
    </>
  );
};

export default MobileAIViewcontainer;

import React, { useContext, useState } from "react";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { UserContext } from "../context/User";
import { distanceFunc } from "../utility/region";
import MobileWorkerPopup from "../modal/MobileWorkerPopup";
import { checkExistingRoom, createVirtualWork, ReadWorkByIndividually } from "../service/WorkService";
import { Readuserbyusersid } from "../service/UserService";
import { CreateChat, NewCreateMessage } from "../service/ChatService";
import { CreateContact } from "../service/ContactService";
import { CHATCONTENTTYPE, CONTACTTYPE, PCMAINMENU } from "../utility/screen";
import { useNavigate } from "react-router-dom";

const SelfIntroworker = ({ list = [] }) => {
  const { user } = useContext(UserContext);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const navigate = useNavigate();

  console.log("list", list);

  if (!list.length) return null;

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
  }
  return (
    <CardListContainer>
      <CardList>
        {list.map((item, idx) => (
          <CardWrapper key={idx} onClick={() => setSelectedWorker(item)}>
            <ThumbnailBox>
              {item.videoThumbnail ? (
                <>
                  <ThumbnailImage src={item.videoThumbnail} alt="썸네일" />
                  <PlayButtonCenter>▶</PlayButtonCenter>
                </>
              ) : (
                <ThumbnailPlaceholder>
                  영상 등록
                </ThumbnailPlaceholder>
              )}
            </ThumbnailBox>

            <Info>
              <NameRow>
                <Name>
                  {item.chatName} ({item.age} / {item.gender === 'male' ? '남성' : item.gender === 'female' ? '여성' : '기타'})
                </Name>
              </NameRow>
              <Tags>
                {item.tags?.map((tag, i) => (
                  <Tag key={i}>#{tag}</Tag>
                ))}
              </Tags>
            </Info>
          </CardWrapper>


        ))}
      </CardList>
      {selectedWorker && (
        <MobileWorkerPopup
          data={selectedWorker}
          containerStyle={{ height: 'calc(100vh - 40px)' }}
          onChat={() => {
            handleChat(selectedWorker);
          }}
          onClose={() => setSelectedWorker(null)}
        />
      )}
    </CardListContainer>
  );
};

export default SelfIntroworker;

// -------------------- Styled Components --------------------

const CardListContainer = styled.div`
  padding: 8px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
`;

const ThumbnailBox = styled.div`
  position: relative;
  width: 76px;
  height: 76px;
  padding: 6px;
  border: 2px solid #ededed;
  border-radius: 50%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const ThumbnailImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
`;

const ThumbnailPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #ccc;
  color: #fff;
  font-weight: bold;
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayButtonCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const Info = styled.div`
  flex: 1;
  padding-right: 8px;
`;


const NameRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const Name = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 600;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.div`
  background: #eee;
  color: #333;
  font-size: ${() => getFontSize(11)}px !important;
  padding: 2px 6px;
  border-radius: 6px;
`;

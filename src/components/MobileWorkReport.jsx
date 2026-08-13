
import React, {Fragment, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../common/Button";
import LottieAnimation from "../common/LottieAnimation";
import { UserContext } from "../context/User";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import MobileWorkMapPopup from "../modal/MobileMapPopup/MobileWorkMapPopup";
import MobileSuccessPopup from "../modal/MobileSuccessPopup/MobileSuccessPopup";
import MobileWarningPopup from "../modal/MobileWarningPopup/MobileWarningPopup";
import { CreateChat, ReadChat } from "../service/ChatService";

import { Readuserbyusersid } from "../service/UserService";
import { ReadWorkByIndividually } from "../service/WorkService";
import { imageDB, Seekimage } from "../utility/imageData";
import { REQUESTINFO } from "../utility/work_";
import { workOf } from "../utility/chat";
import { shortRegion } from "../utility/region";
import WorkLocationMap from "./WorkLocationMap";
import WorkPhotoGrid from "./WorkPhotoGrid";
import { IsFavorite, ToggleFavorite } from "../service/FavoriteService";
import { PiHeartBold, PiHeartFill, PiPhoneBold } from "react-icons/pi";
import { isGuestUser, LOGIN_NEEDED } from "../utility/guest";
import LoginGate from "./LoginGate";




const Container = styled.div`
  width:90%;
`
const style = {
  display: "flex"
};

const ResultContent = {
  width: '180px',
  fontSize: '14px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
 
}

const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

/* 지원 버튼 — 화면에 붙여두지 않고 내용 다 읽은 맨 아래에 둔다 (형 리뷰 2026-08-13).
   전에는 fixed 로 늘 떠 있어서 지도·사진을 가렸다. */
const ActionBar = styled.div`
  width: 100%;
  margin-top: 28px;
  padding: 20px 0 calc(24px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--border-soft);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`
/* 며칠 전인지 사람 말로 */
const timeAgoText = (ts) => {
  const ms = Date.now() - Number(ts || 0);
  if (!Number.isFinite(ms) || ms < 0) return '';
  const m = Math.floor(ms / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  const w = Math.floor(d / 7);
  return w < 5 ? `${w}주 전` : `${Math.floor(d / 30)}개월 전`;
};

/* 일감 요약 헤더 (형 리뷰 2026-08-13 "이부분은 스타일리쉬 하게").
   전에는 "고객님이 작성하신 요구 사항은 다음과 같습니다" 한 줄만 있어서,
   무슨 일이 얼마짜리인지는 아래 표를 읽어야 알 수 있었다. 제일 중요한 걸 위로 올린다. */
const Head = styled.div`
  padding: 6px 2px 16px;
`
const HeadTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const HeadType = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.25;
  word-break: keep-all;
`
/* 상태는 뱃지 대신 글자 색으로만 (전역 UI 규칙) */
const HeadState = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ $done }) => ($done ? 'var(--text-weak)' : '#FF4E19')};
`
const HeadPrice = styled.div`
  margin-top: 10px;
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.5px;
  span { font-size: 18px; font-weight: 600; margin-left: 2px; }
`
const HeadMeta = styled.div`
  margin-top: 8px;
  font-size: 15px;
  color: var(--text-sub);
`
const HeadLine = styled.div`
  height: 1px;
  background: var(--border-soft);
  margin: 16px 0 14px;
`
/* 표 위 작은 제목 */
const SectionLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 22px 0 2px;
`

/* 조회수 · 채팅 진행중 건수 (형 리뷰 2026-08-12) */
const CountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 2px 14px;
`
const CountItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #8A8A8A;
  .label { color: #8A8A8A; }
  .value { color: var(--text); font-weight: 700; }
`
/* 찜 버튼 — 조회수 줄 오른쪽 (형 리뷰 2026-08-13) */
const FavButton = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid ${({ $on }) => ($on ? '#FF4E19' : 'var(--border)')};
  border-radius: 100px;
  background: var(--surface);
  color: ${({ $on }) => ($on ? '#FF4E19' : '#666')};
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  padding: 6px 12px;
  cursor: pointer;
  &:active { background: var(--bg-soft); }
`
const CountDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 100px;
  background: #D9D9D9;
`

/* 요구사항 목록 — 표 대신 한 줄에 라벨/값 (형 리뷰 2026-08-12) */
const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border-soft);
`
const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 2px;
  border-bottom: 1px solid var(--border);
`
const InfoLabel = styled.div`
  flex: 0 0 88px;
  font-size: 15px;
  color: #8A8A8A;
  line-height: 1.5;
`
const InfoValue = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.5;
  text-align: right;
  word-break: keep-all;
`
/* 요구사항처럼 긴 글은 오른쪽 정렬이 읽기 나쁘다 — 왼쪽으로 흘린다 */
const InfoLongText = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  font-size: 16px;
  color: var(--text);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`

/* 안내 한 줄 + 버튼 두 개 (형 리뷰 2026-08-13) */
const ActionWrap = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
/* 대화방 말풍선 모양 그대로 (형 리뷰 2026-08-13 "대화 말풍선 처럼 처리해줘").
   상대가 건네는 말이라 왼쪽 말풍선(좌상단만 각진 모서리)을 쓴다.
   허용한 일감은 브랜드 연한 살구색, 아닌 경우는 회색 — 대화방의 두 말풍선 색을 그대로 가져왔다. */
const VoiceNotice = styled.div`
  position: relative;
  align-self: flex-start;
  max-width: 88%;
  width: fit-content;
  box-sizing: border-box;
  padding: 11px 14px;
  border-radius: 14px;
  border-top-left-radius: 4px;
  background: ${({ $on }) => ($on ? '#FFEDE6' : '#F4F4F5')};
  color: var(--text);
  font-size: 15px;
  line-height: 1.5;
  text-align: left;
  font-weight: 500;
  word-break: keep-all;

  /* 아래 보이스톡 버튼을 가리키는 꼬리 (형 리뷰 2026-08-13).
     말풍선과 같은 색 삼각형을 아래쪽에 붙여 어느 버튼 이야기인지 알려준다.
     버튼이 왼쪽 칸이라 꼬리도 왼쪽에 둔다. */
  &::after {
    content: '';
    position: absolute;
    left: 26px;
    bottom: -8px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 9px solid ${({ $on }) => ($on ? '#FFEDE6' : '#F4F4F5')};
  }
`
/* 허용 안 한 일감에서는 꺼진 모습으로 둔다 — 아예 숨기면 그런 기능이 있는 줄도 모른다 */
const VoiceButton = styled.button`
  height: 52px;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 700;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  background: var(--surface);
  border: 1px solid ${({ $on }) => ($on ? '#FF4E19' : 'var(--border)')};
  color: ${({ $on }) => ($on ? '#FF4E19' : 'var(--text-weak)')};
  &:active { opacity: .8; }
`

/* 보이스톡을 허용한 일감이면 버튼이 둘이라 나란히 놓는다 */
const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 90%;
  & > * { flex: 1 1 0; min-width: 0; }
`

const MobileWorkReport =({containerStyle, messages, WORK_ID, WORKTYPE, WORK_STATUS}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [popupstatus, setPopupstatus] = useState(false);

  const [latitude, setLatitude] = useState('');
  const [longitudie, setLongitude] = useState('');
  const [worktype, setWorktype] = useState(WORKTYPE);


  const [supporterwork, setSupporterwork] = useState(false);
  const [ownerwork, setOwnerwork] = useState(false);
  const [closework, setClosework] = useState(false);
  const [currentloading, setCurrentloading] = useState(true);
  /* 올린 사람이 보이스톡 허용을 켰는지 (일 등록 마지막 '연락 옵션') */
  const [voicetalk, setVoicetalk] = useState(false);
  const [voicetalknotice, setVoicetalknotice] = useState(false);
  const [voiceoffnotice, setVoiceoffnotice] = useState(false);   // 허용 안 한 일감에서 눌렀을 때
  const [logingate, setLogingate] = useState(null);   // 둘러보기 중 로그인 유도 (형 리뷰 2026-08-13)
  /* 조회수·진행중 건수를 쓰려고 일감 원본을 들고 있는다 (형 리뷰 2026-08-12) */
  const [workinfo, setWorkinfo] = useState({});
  /* 찜 (형 리뷰 2026-08-13) — 내 정보 > 찜한 일감 으로 모인다 */
  const [faved, setFaved] = useState(false);

  const [supportWorkSuccess, setSupportWorkSuccess] = useState(false);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setPopupstatus(popupstatus);  
    setSupporterwork(supporterwork);
    setOwnerwork(ownerwork);
    setClosework(closework);
    setSupportWorkSuccess(supportWorkSuccess);
    setCurrentloading(currentloading);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      // 마감되었는지 확인 필요
      if(WORK_STATUS == 1){
          setClosework(true);
       }

       // 자신의 소유인지 확인 필요
       const WORK_INFO = await ReadWorkByIndividually({WORK_ID});
       setWorkinfo(WORK_INFO || {});
       if(WORK_INFO.USERS_ID == user.users_id){
          setOwnerwork(true);
       }

       // 올린 사람이 보이스톡을 허용한 일감에서만 버튼을 연다 (형 리뷰 2026-08-12)
       setVoicetalk(WORK_INFO?.WORK_OPTION?.VOICETALK == true);

       setFaved(await IsFavorite(user?.users_id, WORK_ID));

       // 지원 햇는지 확인 필요
       const USERS_ID = user.users_id;
       const chatitems = await ReadChat({USERS_ID});


       if(chatitems != -1){
        const FindIndex = chatitems.findIndex(x=>workOf(x).WORK_ID == WORK_ID);
        if(FindIndex != -1){
         if(chatitems[FindIndex].SUPPORTER_ID == USERS_ID){
           setSupporterwork(true);
         }
        }
       }
  
       setCurrentloading(false);
      }
      FetchData();
  }, [])
  const _handleReset = () =>{

  }

  /**
   * WORK_ID를가지고 
   * 1) WORK 정보를 가져돈다
   * 2) 지원자 의 정보를 가져온다
   */
 const _handleReqComplete = async(WORK_ID) =>{
     if(isGuestUser(user)){ setLogingate(LOGIN_NEEDED.SUPPORT); return; }
  
     const WORK_INFO = await ReadWorkByIndividually({WORK_ID});

    

     let USERS_ID = WORK_INFO.USERS_ID;
     let OWNER = await Readuserbyusersid({USERS_ID});

     console.log("TCL: _handleReqComplete -> WORK_INFO", USERS_ID, OWNER)
     if(OWNER == -1){
       return;
     }
     const OWNER_ID = OWNER.USERS_ID;

     USERS_ID = user.users_id;;
     const SUPPORTER = await Readuserbyusersid({USERS_ID});
     const SUPPORTER_ID = SUPPORTER.USERS_ID;
     const createchat = await CreateChat({OWNER, OWNER_ID,  SUPPORTER, SUPPORTER_ID, WORK_INFO});

     setSupportWorkSuccess(true);
     setRefresh((refresh) => refresh +1);


  }

  const _handleFavorite = async () =>{
    if(isGuestUser(user)){ setLogingate(LOGIN_NEEDED.FAVORITE); return; }
    const next = await ToggleFavorite(user?.users_id, WORK_ID);
    setFaved(next);
    setRefresh((refresh) => refresh +1);
  }

  const popupcallback = async () => {
    setPopupstatus(!popupstatus);
    setRefresh((refresh) => refresh +1);
  };

  const supportsuccesscallback = async () =>{
    setSupportWorkSuccess(false);
    navigate("/Mobilechat");
    setRefresh((refresh) => refresh +1);
  }

  /* 금액류에는 "원"을 붙인다 (형 리뷰 2026-08-12).
     "협의필요" 같은 문구나 이미 원이 붙은 값은 그대로 둔다. */
  const MONEY_TYPES = ['금액', '시간과 금액', REQUESTINFO.MONEY];
  const formatValue = (type, value) => {
    const v = String(value ?? '');
    if (!MONEY_TYPES.includes(type)) return v;
    if (!/[0-9]/.test(v) || v.includes('원')) return v;
    const num = Number(v.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(num) && num > 0 ? `${num.toLocaleString('ko-KR')}원` : v;
  };

  // 지역 좌표 — 아이콘을 눌러 팝업을 띄우는 대신 화면에 바로 지도를 보여준다
  /* 헤더에 쓸 금액·지역·등록일 (형 리뷰 2026-08-13) */
  const headPrice = (()=>{
    const d = (messages || []).find((x)=> x && x.requesttype == '금액');
    if(!d) return '';
    const num = Number(String(d.result ?? '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(num) && num > 0 ? num.toLocaleString('ko-KR') : '';
  })();
  const headMeta = (()=>{
    const d = (messages || []).find((x)=> x && x.requesttype == '지역');
    const region = d ? shortRegion(d.result) : '';
    const when = workinfo.CREATEDT ? timeAgoText(workinfo.CREATEDT) : '';
    return [region, when].filter(Boolean).join(' · ');
  })();

  const regionPoint = (() => {
    const d = (messages || []).find((x) => x && x.requesttype === REQUESTINFO.CUSTOMERREGION && x.latitude);
    return d ? { lat: d.latitude, lng: d.longitude, addr: d.result } : null;
  })();

  const _handleMapview= (lat, long, worktype)=>{

    setPopupstatus(true);
    setLatitude(lat);
    setLongitude(long);
    setWorktype(worktype);
    setClosework(closework);
    setSupporterwork(supporterwork);
    setOwnerwork(ownerwork);

    setRefresh((refresh) => refresh +1);

  }

 
  return (

    <Container style={containerStyle}>

      {
        popupstatus == true && <MobileWorkMapPopup callback={popupcallback} latitude={latitude} longitude={longitudie}
        top={'30%'}  left={'10%'} height={'280px'} width={'280px'} name={worktype} markerimg={Seekimage(worktype)}
        />
      }

      {
        supportWorkSuccess == true && <MobileSuccessPopup callback={supportsuccesscallback} content ={'일감에 정상적으로 지원되었습니다'} />
      }

      <LoginGate reason={logingate} onClose={()=>setLogingate(null)} />

      {
        voicetalknotice == true && <MobileWarningPopup callback={()=>{setVoicetalknotice(false)}} content ={'보이스톡은 준비 중입니다. 지금은 지원하기로 채팅을 열어 연락해 주세요.'} />
      }

      {
        voiceoffnotice == true && <MobileWarningPopup callback={()=>{setVoiceoffnotice(false)}} content ={'이 일감은 올린 분이 보이스톡을 받지 않기로 했습니다. 지원하기를 눌러 채팅으로 이야기해 주세요.'} />
      }

      {
        currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>) :(<>
          <Head>
            <HeadTop>
              <HeadType>{WORKTYPE || workinfo.WORKTYPE}</HeadType>
              <HeadState $done={closework}>{closework ? '마감' : '진행중'}</HeadState>
            </HeadTop>
            {headPrice && <HeadPrice>{headPrice}<span>원</span></HeadPrice>}
            <HeadMeta>{headMeta}</HeadMeta>
            <HeadLine />
          </Head>

          {/* 홈 카드에 있던 조회수·진행중 건수를 상세에도 (형 리뷰 2026-08-12) */}
          <CountRow>
            <CountItem>
              <img className="mono-icon" src={imageDB.eyesolid} alt="조회수" style={{width:16, height:16, objectFit:'contain'}}/>
              <span>{workinfo.VIEW_COUNT ?? 0}</span>
            </CountItem>
            <CountDot />
            <CountItem>
              <span className="label">채팅중인 건수</span>
              <span className="value">{workinfo.APPLY_COUNT ?? 0}건</span>
            </CountItem>
            <FavButton onClick={_handleFavorite} aria-label={faved ? '찜 해제' : '찜하기'} $on={faved}>
              {faved ? <PiHeartFill size={18}/> : <PiHeartBold size={18}/>}
              {faved ? '찜함' : '찜하기'}
            </FavButton>
          </CountRow>

          {/* 표 대신 항목 목록 — 칸이 갈라져 답답했다 (형 리뷰 2026-08-12) */}
          <SectionLabel>요청 내용</SectionLabel>
          <InfoList>
            {
              (messages || []).filter((d)=> d && d.type =='response').map((data, index)=>(
                <InfoRow key={index}>
                  <InfoLabel>{data.requesttype}</InfoLabel>
                  {
                    data.requesttype == REQUESTINFO.COMMENT
                      ? (<InfoLongText>{data.result}</InfoLongText>)
                      : (<InfoValue>{formatValue(data.requesttype, data.result)}</InfoValue>)
                  }
                </InfoRow>
              ))
            }
          </InfoList>

          {/* 참고 사진 — 지도 위에 한 줄 세 칸 격자 (형 리뷰 2026-08-12) */}
          <WorkPhotoGrid photos={workinfo.WORK_PHOTOS} />

          {/* 위치 지도 — 팝업 대신 화면에 바로 (형 리뷰 2026-08-12) */}
          {regionPoint && (
            <WorkLocationMap
              latitude={regionPoint.lat}
              longitude={regionPoint.lng}
              address={regionPoint.addr}
              markerimg={Seekimage(WORKTYPE)}
            />
          )}

          <ActionBar>
   

       {
         closework == true ? (<Button containerStyle={{border: 'none', fontSize:17, fontWeight:700}} height={'52px'} width={'90%'} radius={'10px'} bgcolor={'var(--border-soft)'} color={'#999'} text={'이미 마감된 일감'}/>)
         :(
           <>
             {
               supporterwork == true && <Button containerStyle={{border: 'none', fontSize:17, fontWeight:700}} height={'52px'} width={'90%'} radius={'10px'} bgcolor={'var(--border-soft)'} color={'#999'} text={'이미 지원한 일감'}/>
             }

             {
               ownerwork == true && <Button containerStyle={{border: 'none', fontSize:17, fontWeight:700}} height={'52px'} width={'90%'} radius={'10px'} bgcolor={'var(--border-soft)'} color={'#999'} text={'본인이 등록한 일감'}/>
             }
             {
               /* 보이스톡 버튼은 항상 둔다. 올린 사람이 허용을 켰으면 살아 있고, 아니면 꺼진 채로 보인다.
                  위에 왜 되는지/안 되는지 한 줄로 알려준다. (형 리뷰 2026-08-13) */
               (supporterwork ==false && ownerwork == false) && (
                 <ActionWrap>
                   <VoiceNotice $on={voicetalk}>
                     {voicetalk
                       ? '보이스톡을 허용한 일감이에요. 지금 바로 통화해보세요'
                       : '보이스톡을 받지 않는 일감이에요. 지원하기를 눌러 채팅으로 이야기해보세요'}
                   </VoiceNotice>
                   <ActionButtons>
                     <VoiceButton
                       $on={voicetalk}
                       onClick={()=>{ voicetalk ? setVoicetalknotice(true) : setVoiceoffnotice(true); }}
                     >
                       <PiPhoneBold size={18}/>보이스톡
                     </VoiceButton>
                     <Button containerStyle={{border: 'none', fontSize:17, fontWeight:700}} onPress={()=>{_handleReqComplete(WORK_ID)}} height={'52px'} width={'100%'} radius={'10px'} bgcolor={'#FF4E19'} color={'#fff'} text={'지원하기'}/>
                   </ActionButtons>
                 </ActionWrap>
               )
             }
           </>
         )
       }
          </ActionBar>
          </>)
      }


    </Container>
  );

}

export default MobileWorkReport;


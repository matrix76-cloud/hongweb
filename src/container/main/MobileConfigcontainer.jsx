import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Row } from "../../common/Row";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";

import { RiArrowRightSLine } from "react-icons/ri";
import { PiSignOutBold, PiUserMinusBold, PiTextAaBold } from "react-icons/pi";
import localforage from 'localforage';
import MobileConfirmPopup from "../../modal/MobileConfirmPopup/MobileConfirmPopup";
import { WithdrawUser, Update_userinfobyusersid } from "../../service/UserService";
import { signOutAll, withdrawAccount } from "../../service/AuthService";
import { unregisterWebPushToken } from "../../service/fcmService";
import { clearGuest } from "../../utility/guest";
import { PiCameraBold } from "react-icons/pi";
import { PiMoonBold, PiSpeakerHighBold } from "react-icons/pi";
import { PiBroom } from "react-icons/pi";
import { BiClinic } from "react-icons/bi";
import { VscCloseAll } from "react-icons/vsc";
import { CiHeart } from "react-icons/ci";
import { BsClipboard } from "react-icons/bs";
import { VscBell } from "react-icons/vsc";
import { CiBellOn } from "react-icons/ci";
import { GrTransaction } from "react-icons/gr";
import { CiMedicalClipboard } from "react-icons/ci";
import { CiCreditCard1 } from "react-icons/ci";
import { CiBank } from "react-icons/ci";
import { SlEvent } from "react-icons/sl";
import { CiCircleQuestion } from "react-icons/ci";
import { VscWorkspaceUnknown } from "react-icons/vsc";
import { MdOutlinePolicy } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { CONFIGMOVE } from "../../utility/screen";
import { PiBellBold, PiBellRingingBold, PiCheckCircleBold, PiClipboardTextBold, PiCreditCardBold, PiFileTextBold, PiHandshakeBold, PiHeadsetBold, PiHeartBold, PiInfoBold, PiLockKeyBold, PiMapPinBold, PiMegaphoneBold, PiNavigationArrowBold, PiQuestionBold, PiSealCheckBold, PiWalletBold } from "react-icons/pi";
import ChatprofileImage from "../../components/ChatprofileImage";
import NicknameEditor from "../../components/NicknameEditor";




/* 홈처럼 컨테이너가 자체 스크롤을 가진다 — 화면 전체(app-frame)가 스크롤되면
   하단 탭(fixed)이 내용을 따라 올라가 버린다 (형 리뷰 2026-08-15 "풋바가 따라 올라가나").
   높이 = 화면 - 하단탭(76px). 하단 여백은 안쪽 패딩으로 준다. */
const Container = styled.div`
  padding-top:55px;
  padding-bottom: 30px;
  background-color : var(--bg-soft);
  box-sizing: border-box;
  height: calc(100dvh - 76px);
  overflow-y: auto;
  scrollbar-width: none;
`
const BoxItem = styled.div`

  background: var(--surface);
  color: rgb(0, 0, 0);
  display: flex;
  flex-direction : column;
  width: 85%;
  margin: 10px auto;
  border-radius: 10px;
  padding: 10px;
`
const Name = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 16px;
  padding-left:5px;
`
const ProfileConfigBtn = styled.div`
  background: var(--bg-soft);
  padding: 10px;
  font-family: 'Pretendard-SemiBold';
  font-size: 12px;
`
/* 홍여사 등록 유도 배너 (형 리뷰 2026-08-12 — UI 정돈) */
const RegistHong = styled.div`
  box-sizing: border-box;
  border: 1px solid var(--border-soft);
  /* 살구빛 바탕(#FFFBF8)을 뺐다 — 어두운 모드에서 이 칸만 하얗게 떠 있기도 했다 (형 리뷰 2026-08-16) */
  background: var(--surface);
  margin: 16px 0 4px;
  padding: 16px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`
/* 주황 채움이 너무 진해서 배너 전체가 무거웠다 — 테두리만 남긴다 (형 리뷰 2026-08-13) */
const RegistLayer = styled.div`
  height: 50px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  &:active { transform: scale(0.98); }
  transition: transform .12s ease;
`
const RegistLayerContent = styled.div`
  color: var(--text);
  font-size: 16px;
  font-weight: 700;
`
/* 프로필 사진 + 카메라 배지 */
const AvatarBtn = styled.div`
  position: relative;
  flex: none;
  cursor: pointer;
`
const CameraBadge = styled.div`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #131313;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Label = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  padding: 20px 12px 10px;
`
const SubLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 58px;
  padding-left: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  /* 좌측 메뉴 아이콘 — 기본 16px 라 너무 작았다 (형 지시 2026-08-12) */
  > div > svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: #4a4a4a;
  }

  &:active { background: var(--bg-soft); }
`

const SubLabelContent = styled.div`
  font-family: 'Pretendard-Regular';
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  padding: 0 0 0 12px;
`


const MobileConfigcontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  console.log("TCL: MobileConfigcontainer -> user", user)
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [dialog, setDialog] = useState(null);   // 로그아웃·탈퇴 확인창
  const [img, setImg] = useState('');           // 방금 고른 프로필 사진
  const [nickediting, setNickediting] = useState(false);  // 대화명 편집 중이면 옆 버튼을 접는다
  const fileInput = useRef();

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
    } 
    FetchData();
  }, [])
  useEffect(()=>{

  },[refresh])


  const _handleMyWork = () =>{
    navigate("/Mobileconfigcontent", {state :{NAME : CONFIGMOVE.MYWORK}});
  }
  const _handleSearchRange = () =>{
    navigate("/Mobileconfigcontent", {state :{NAME : CONFIGMOVE.SEARCHRANGE}});
  }
  /* 실시간 알림설정 (형 리뷰 2026-08-12) */
  const _handleNotiSetting = () =>{
    navigate("/Mobileconfigcontent", {state :{NAME : CONFIGMOVE.NOTISETTING}});
  }
  /* 준비중이던 메뉴들을 실제 화면으로 (형 리뷰 2026-08-13 "모두 처리 해줘") */
  const _handleConfigMove = (NAME) =>{
    navigate("/Mobileconfigcontent", {state :{NAME}});
  }
  const _handleClosedWork = () =>{
    navigate("/Mobileconfigcontent", {state :{NAME : CONFIGMOVE.CLOSEDWORK}});
  }
  // 아직 만들지 않은 메뉴 — 눌러도 아무 반응 없는 것보다 상태를 알려준다
  const _handleNotReady = (label) =>{
    alert(`${label}은 준비 중입니다`);
  }

  const _handleEventView = () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.EVENTVIEW, TYPE : ""}});
  }


  const _handleUselaw= () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.LAWPOLICY, TYPE : ""}});
  }

  const _handlePrivacylaw= () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.LAWPRIVACY, TYPE : ""}});
  }

  const _handleGpsLaw= () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.LAWGPS, TYPE : ""}});
  }

  const _handleWorkerInfo = ()=>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.WORKERINFO, TYPE : ""}});
  }

  /** 프로필 사진 교체 */
  const _handleprofileimage = async (e) =>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;

    const dataurl = await new Promise((resolve)=>{
      const reader = new FileReader();
      reader.onload = ()=> resolve(reader.result);
      reader.readAsDataURL(file);
    });

    setImg(dataurl);
    user.userimg = dataurl;
    dispatch(user);

    const USERINFO = user;
    const USERS_ID = user.users_id;
    await Update_userinfobyusersid({USERINFO, USERS_ID});
    await localforage.setItem('userconfig', user);
    setRefresh((refresh)=> refresh +1);
  }

  /**
   * 로그아웃 (형 지시 2026-08-20 "로그아웃 기능 동작 하게 해줘")
   *
   * 눌러도 로그아웃이 안 되는 것처럼 보였다. 이유가 둘이었다.
   *
   *   ① 화면이 들고 있는 계정(UserContext)을 안 비웠다.
   *      저장소(localforage)와 파이어베이스 세션만 지우고 끝냈는데, 앱이 실제로 보고 쓰는 것은
   *      메모리에 올라와 있는 user 다. 그래서 새로고침하기 전까지는 여전히 로그인한 상태였다.
   *   ② 다 지우고 '/' 로 보냈는데, 스플래시는 온보딩을 본 사람을 홈으로 보낸다(utility/entry.js).
   *      결국 홈으로 되돌아와 아무것도 안 바뀐 화면이 됐다.
   *
   * 이제 계정을 완전히 비우고 로그인 화면으로 보낸다. 로그인 화면에는
   * "로그인 없이 먼저 둘러보기" 가 있어서 그냥 나가고 싶은 사람도 막히지 않는다.
   */
  const _handlelogout = () =>{
    setDialog({
      title: '로그아웃',
      message: '로그아웃 할까요?',
      confirmText: '로그아웃',
      onConfirm: async () =>{
        setDialog(null);
        await doSignOut();
        navigate('/Mobilelogin', { replace: true });
      },
    });
  }

  /** 로그아웃·탈퇴가 공통으로 하는 정리 — 하나라도 빠지면 로그인 상태가 남는다 */
  const doSignOut = async () =>{
    // 이 기기로 오던 알림을 끊는다 — 안 끊으면 로그아웃한 폰에 남의 알림이 계속 온다
    try { await unregisterWebPushToken({ USERS_ID: user.users_id }); } catch (e) { /* noop */ }
    // 저장된 계정만 비우면 파이어베이스 세션이 남아 다른 계정으로 못 바꾼다 (형 지시 2026-08-13)
    await signOutAll();
    await localforage.removeItem('userconfig').catch(()=>{});
    await clearGuest();
    /* 화면이 들고 있는 계정을 비운다. 위치·주소는 남겨둔다 —
       지우면 홈에서 거리 계산이 NaN 이 되어 일감이 하나도 안 보인다. */
    dispatch({
      ...user,
      deviceid: '',
      users_id: '',
      nickname: '',
      phone: '',
      userimg: '',
      token: '',
    });
  }

  /**
   * 탈퇴 — 실수로 누르지 못하게 "탈퇴" 를 직접 입력받는다 (형 지시 2026-08-12).
   * 계정 문서는 지우지 않고 탈퇴 표시만 남긴다. 상대에게 남은 대화·일감이 깨지지 않게.
   */
  const _handlewithdraw = () =>{
    setDialog({
      title: '탈퇴하기',
      message: '탈퇴하면 홍여사 활동내역을 다시 볼 수 없습니다.\n계속하려면 아래에 "탈퇴" 라고 적어주세요.',
      input: { placeholder: '탈퇴' },
      confirmText: '탈퇴',
      danger: true,
      onConfirm: async (word) =>{
        if(word !== '탈퇴'){
          setDialog({
            title: '다시 확인해주세요',
            message: '"탈퇴" 라고 정확히 적어야 진행됩니다.',
            alertonly: true,
            onConfirm: ()=> setDialog(null),
          });
          return;
        }
        setDialog(null);
        // 계정 문서는 탈퇴 표시만 남기고, 로그인 계정(Auth)은 서버에서 지운다.
        // 안 지우면 같은 이메일로 다시 가입할 수 없다 (형 지시 2026-08-13)
        await WithdrawUser({ USERS_ID: user.users_id });
        try { await withdrawAccount(); } catch (err) { console.error('withdraw auth', err); }
        await doSignOut();
        navigate('/Mobilelogin', { replace: true });
      },
    });
  }

  const _handleProfileConfig = () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.PROFILECONFIG, TYPE : ""}});  
  }

 
  return (

    <Container style={containerStyle}>
        <BoxItem>
          <Row style={{justifyContent:"space-between", width:"100%"}}>
            <Row style={{alignItems:"center", gap:12, flex:1, minWidth:0}}>
              {/* 눌러서 사진 교체 (형 지시 2026-08-12) */}
              <AvatarBtn onClick={()=>{ fileInput.current?.click(); }}>
                <ChatprofileImage source={img || user.userimg} size={52} />
                <CameraBadge><PiCameraBold size={13} color="#fff" /></CameraBadge>
              </AvatarBtn>
              {/* 대화명이 아예 안 보이던 자리 — 편집기를 다시 물렸다 (형 리뷰 2026-08-12) */}
              <NicknameEditor size={17} hint={false} onEditingChange={setNickediting} />
            </Row>

            <input
              type="file"
              accept="image/*"
              ref={fileInput}
              onChange={_handleprofileimage}
              style={{ display: "none" }}
            />
            {nickediting == false && <ProfileConfigBtn onClick={_handleProfileConfig}>프로필 보기</ProfileConfigBtn>}
      
          </Row>
          

          <RegistHong>
            {/* 청소 아줌마 일러스트는 뺐다 (형 리뷰 2026-08-15) */}
            <Row style={{justifyContent:"flex-start", alignItems:"center", width:"100%"}}>
              <div style={{fontSize:15, lineHeight:1.5, color:"var(--text)", fontWeight:500}}>
                홍여사로 등록하면<br/>모든 일감에 지원할 수 있어요
              </div>
            </Row>
            <RegistLayer onClick={_handleWorkerInfo}>
                <RegistLayerContent>홍여사 등록하러 가기</RegistLayerContent>
                <RiArrowRightSLine size={20} color={'var(--text)'}/>
            </RegistLayer>
          </RegistHong>
        
        
        </BoxItem>


        <BoxItem>
          <Label>홍여사 활동내역</Label>
          
            <SubLabel onClick={_handleMyWork}>
              <Row>
                <PiClipboardTextBold/>
                <SubLabelContent>등록한 일감 </SubLabelContent>
              </Row>     
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>
            <SubLabel onClick={_handleClosedWork}>
              <Row>
                <PiCheckCircleBold/>
                <SubLabelContent>마감한 일감 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>

            <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.FAVORITEWORK)}>
              <Row>
                <PiHeartBold/>
                <SubLabelContent>찜한 일감 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>


        </BoxItem>

        {/* 설정은 활동내역이 아니다 — 따로 묶는다 (형 리뷰 2026-08-13 "위치가 잘못 들어가 있어") */}
        <BoxItem>
          <Label>앱 설정</Label>

            <SubLabel onClick={_handleSearchRange}>
              <Row>
                <PiMapPinBold/>
                <SubLabelContent>나의 범위설정 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>

            <SubLabel onClick={_handleNotiSetting}>
              <Row>
                <PiBellBold/>
                <SubLabelContent>실시간 알림설정 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>

            {/* 알림음 — 도우미 앱과 같은 기능 (형 지시 2026-08-22) */}
            <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.SOUNDSETTING)}>
              <Row>
                <PiSpeakerHighBold/>
                <SubLabelContent>알림음 설정</SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>

            <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.THEMESETTING)}>
              <Row>
                <PiMoonBold/>
                <SubLabelContent>화면 설정</SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
            </SubLabel>

            {/* 글자 크기 — 화면 설정 바로 아래에 같은 모양으로 (형 지시 2026-08-19) */}
            <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.TEXTSIZESETTING)}>
              <Row>
                <PiTextAaBold/>
                <SubLabelContent>글자 크기</SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>
        </BoxItem>

        <BoxItem>
          <Label>나의 거래</Label>
          <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.DEALOPEN)}>
            <Row>
              <PiHandshakeBold/>
              <SubLabelContent>체결중인 거래 </SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
          </SubLabel>
          
          <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.DEALDONE)}>
            <Row>
              <PiSealCheckBold/>
              <SubLabelContent>체결완료된 거래</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
        </BoxItem>

        <BoxItem>
          <Label>결제 입금관리</Label>

          <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.PAY)}>
            <Row>
              <PiCreditCardBold/>
              <SubLabelContent>결제관리</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.DEPOSIT)}>
            <Row>
              <PiWalletBold/>
              <SubLabelContent>입금관리</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

        </BoxItem>


        <BoxItem>
           <Label>기타</Label>


           <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.SUPPORT)}>
            <Row>
              <PiHeadsetBold/>
              <SubLabelContent>고객센터</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.FAQ)}>
            <Row>
              <PiQuestionBold/>
              <SubLabelContent>자주묻는 질문</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>


          <SubLabel onClick={()=>_handleConfigMove(CONFIGMOVE.ABOUT)}>
            <Row>
              <PiInfoBold/>
              <SubLabelContent>홍여사 알아보기</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
   
        </BoxItem>

        <BoxItem>
          <Label>약관 및 정책</Label>

          <SubLabel onClick={_handleUselaw}>
            <Row>
              <PiFileTextBold/>
              <SubLabelContent>이용약관</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel onClick={_handlePrivacylaw}>
            <Row>
              <PiLockKeyBold/>
              <SubLabelContent>개인정보 처리지침</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>


          <SubLabel onClick={_handleGpsLaw}>
            <Row>
              <PiNavigationArrowBold/>
              <SubLabelContent>위치정보기반 수집동의 규정</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
     
        </BoxItem>

        {/* 계정 — 헤더에 있던 로그아웃을 여기로 내리고 탈퇴를 붙였다 (형 지시 2026-08-12) */}
        <BoxItem>
          <Label>계정</Label>

          <SubLabel onClick={_handlelogout}>
            <Row>
              <PiSignOutBold/>
              <SubLabelContent>로그아웃</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
          </SubLabel>

          <SubLabel onClick={_handlewithdraw}>
            <Row>
              <PiUserMinusBold/>
              <SubLabelContent style={{color:"#c02020"}}>탈퇴하기</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
          </SubLabel>
        </BoxItem>

        {
          dialog && (
            <MobileConfirmPopup
              {...dialog}
              onCancel={()=>{ setDialog(null); }}
            />
          )
        }

        <div style={{height:80}}></div>

    </Container>
  );

}

export default MobileConfigcontainer;


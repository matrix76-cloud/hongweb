import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Row } from "../../common/Row";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";

import { RiArrowRightSLine } from "react-icons/ri";
import { PiSignOutBold, PiUserMinusBold } from "react-icons/pi";
import localforage from 'localforage';
import MobileConfirmPopup from "../../modal/MobileConfirmPopup/MobileConfirmPopup";
import { WithdrawUser, Update_userinfobyusersid } from "../../service/UserService";
import { PiCameraBold } from "react-icons/pi";
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




const Container = styled.div`
  padding-top:55px;
  background-color : #f9f9f9;

`
const BoxItem = styled.div`

  background: #fff;
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
  background: #f9f9f9;
  padding: 10px;
  font-family: 'Pretendard-SemiBold';
  font-size: 12px;
`
/* 홍여사 등록 유도 배너 (형 리뷰 2026-08-12 — UI 정돈) */
const RegistHong = styled.div`
  box-sizing: border-box;
  border: 1px solid #ECECEC;
  background: #FFFBF8;
  margin: 16px 0 4px;
  padding: 16px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`
const RegistLayer = styled.div`
  height: 50px;
  background: #FF4E19;
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
  color: #fff;
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
  color: #131313;
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

  &:active { background: #FAFAFA; }
`

const SubLabelContent = styled.div`
  font-family: 'Pretendard-Regular';
  font-size: 16px;
  font-weight: 500;
  color: #131313;
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

  /** 로그아웃 — 저장된 계정을 비우고 처음 화면으로 */
  const _handlelogout = () =>{
    setDialog({
      title: '로그아웃',
      message: '로그아웃 할까요?',
      confirmText: '로그아웃',
      onConfirm: async () =>{
        setDialog(null);
        await localforage.setItem('userconfig', {});
        navigate('/');
      },
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
        await WithdrawUser({ USERS_ID: user.users_id });
        await localforage.setItem('userconfig', {});
        navigate('/');
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
            <Row style={{alignItems:"center", gap:12}}>
              {/* 눌러서 사진 교체 (형 지시 2026-08-12) */}
              <AvatarBtn onClick={()=>{ fileInput.current?.click(); }}>
                <ChatprofileImage source={img || user.userimg} size={52} />
                <CameraBadge><PiCameraBold size={13} color="#fff" /></CameraBadge>
              </AvatarBtn>
              <Name>{user.nickname}</Name>
            </Row>

            <input
              type="file"
              accept="image/*"
              ref={fileInput}
              onChange={_handleprofileimage}
              style={{ display: "none" }}
            />
            <ProfileConfigBtn onClick={_handleProfileConfig}>프로필 보기</ProfileConfigBtn>
      
          </Row>
          

          <RegistHong>
            <Row style={{justifyContent:"flex-start", alignItems:"center", gap:14, width:"100%"}}>
              <img src={imageDB.logo2} style={{width:44, height:44, objectFit:"contain", flexShrink:0}}/>
              <div style={{fontSize:15, lineHeight:1.5, color:"#131313", fontWeight:500}}>
                홍여사로 등록하면<br/>모든 일감에 지원할 수 있어요
              </div>
            </Row>
            <RegistLayer onClick={_handleWorkerInfo}>
                <RegistLayerContent>홍여사 등록하러 가기</RegistLayerContent>
                <RiArrowRightSLine size={20} color={'#fff'}/>
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

            <SubLabel onClick={()=>_handleNotReady("찜한 일감")}>
              <Row>
                <PiHeartBold/>
                <SubLabelContent>찜한 일감 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>


            <SubLabel onClick={()=>_handleNotReady("나의 범위설정")}>
              <Row>
                <PiMapPinBold/>
                <SubLabelContent>나의 범위설정 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>


            <SubLabel onClick={()=>_handleNotReady("실시간 알림설정")}>
              <Row>
                <PiBellBold/>
                <SubLabelContent>실시간 알림설정 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>
        </BoxItem>

        <BoxItem>
          <Label>나의 거래</Label>
          <SubLabel onClick={()=>_handleNotReady("체결중인 거래")}>
            <Row>
              <PiHandshakeBold/>
              <SubLabelContent>체결중인 거래 </SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
          </SubLabel>
          
          <SubLabel onClick={()=>_handleNotReady("체결완료된 거래")}>
            <Row>
              <PiSealCheckBold/>
              <SubLabelContent>체결완료된 거래</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
        </BoxItem>

        <BoxItem>
          <Label>결제 입금관리</Label>

          <SubLabel onClick={()=>_handleNotReady("결제관리")}>
            <Row>
              <PiCreditCardBold/>
              <SubLabelContent>결제관리</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel onClick={()=>_handleNotReady("입금관리")}>
            <Row>
              <PiWalletBold/>
              <SubLabelContent>입금관리</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

        </BoxItem>


        <BoxItem>
          <Label>홍여사 소식</Label>

          <SubLabel onClick={()=>_handleNotReady("홍여사 알림")}>
            <Row>
              <PiBellRingingBold/>
              <SubLabelContent>홍여사 알림</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel onClick={()=>_handleNotReady("공지 사항")}>
            <Row>
              <PiMegaphoneBold/>
              <SubLabelContent>공지 사항</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
        </BoxItem>

        <BoxItem>
           <Label>기타</Label>


           <SubLabel onClick={()=>_handleNotReady("고객센터")}>
            <Row>
              <PiHeadsetBold/>
              <SubLabelContent>고객센터</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel onClick={()=>_handleNotReady("자주묻는 질문")}>
            <Row>
              <PiQuestionBold/>
              <SubLabelContent>자주묻는 질문</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>


          <SubLabel onClick={()=>_handleNotReady("홍여사 알아보기")}>
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


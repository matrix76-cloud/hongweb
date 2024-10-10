import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Row } from "../../common/Row";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";

import { RiArrowRightSLine } from "react-icons/ri";
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
const RegistHong = styled.div`
  border: 1px solid rgb(237, 237, 237);
  height: 70%;
  margin: 10px 0px;
  border-radius: 10px;
`
const RegistLayer = styled.div`
  height: 45px;
  background: #ff71255c;
  margin: 10px;
  border-radius: 10px;
  display:flex;
  flex-direction : row;
  justify-content : center;
  align-items:center;
`
const RegistLayerContent = styled.div`
  color: #ff7125;
  font-weight: 900;
  font-family: 'Pretendard-Bold';
`
const Label = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 16px;
  padding: 20px 10px;
`
const SubLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding-left: 10px;
`

const SubLabelContent = styled.div`
  font-family: 'Pretendard-Light';
  font-size: 16px;
  padding: 20px 10px;
`


const MobileConfigcontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  console.log("TCL: MobileConfigcontainer -> user", user)
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

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

  const _handleProfileConfig = () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.PROFILECONFIG, TYPE : ""}});  
  }

 
  return (

    <Container style={containerStyle}>
        <BoxItem>
          <Row style={{justifyContent:"space-between", width:"100%"}}>
            <Row>
              <img src={user.userimg} style={{width:"32px", borderRadius:"30px"}}/>
              <Name>{user.nickname}</Name>
            </Row>   
            <ProfileConfigBtn onClick={_handleProfileConfig}>프로필 설정</ProfileConfigBtn>
      
          </Row>


          <SubLabel onClick={_handleEventView}>
            <Row>
              <SlEvent/>
              <SubLabelContent >출석 체크</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
          

          <RegistHong>
            <Row style={{justifyContent:"space-between", width:"90%", padding:"20px 10px 10px"}}>
              <img src={imageDB.logo2} style={{width:"48px"}}/>
              <div style={{fontFamily:"Pretendard-Light", fontSize:12, marginLeft:20}}>홍여사 일꾼 등록을 하면 모든 일감에 지원할수가 있습니다</div>
            </Row>
            <RegistLayer  onClick={_handleWorkerInfo}>
                <RegistLayerContent>홍여사 일꾼 등록하러 가기
                </RegistLayerContent>
                <RiArrowRightSLine size={20} color={'#ff7125'}/>
            </RegistLayer>
          </RegistHong>
        
        
        </BoxItem>


        <BoxItem>
          <Label>홍여사 활동내역</Label>
          
            <SubLabel>
              <Row>
                <PiBroom/>
                <SubLabelContent>등록한 일감 </SubLabelContent>
              </Row>     
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>
            <SubLabel>
              <Row>
                <BiClinic/>
                <SubLabelContent>등록한 공간대여</SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>
            <SubLabel>
              <Row>
                <VscCloseAll/>
                <SubLabelContent>마감한 일감 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>

            <SubLabel>
              <Row>
                <CiHeart/>
                <SubLabelContent>찜한 일감 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>
          

            <SubLabel>
              <Row>
                <CiMedicalClipboard/>
                <SubLabelContent>등록한 게시물 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>


            <SubLabel>
              <Row>
                <CiBellOn/>
                <SubLabelContent>나의 범위설정 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>


            <SubLabel>
              <Row>
                <CiBellOn/>
                <SubLabelContent>실시간 알림설정 </SubLabelContent>
              </Row>
              <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
            </SubLabel>
        </BoxItem>

        <BoxItem>
          <Label>나의 거래</Label>
          <SubLabel>
            <Row>
              <GrTransaction/>
              <SubLabelContent>체결중인 거레 </SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>
          </SubLabel>
          
          <SubLabel>
            <Row>
              <GrTransaction/>
              <SubLabelContent>체결완료된 거래</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
        </BoxItem>

        <BoxItem>
          <Label>결재 입금관리</Label>

          <SubLabel>
            <Row>
              <CiCreditCard1/>
              <SubLabelContent>결재관리</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel>
            <Row>
              <CiBank/>
              <SubLabelContent>입금관리</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

        </BoxItem>

        <BoxItem>
          <Label>홍여사 이벤트</Label>

          <SubLabel onClick={_handleEventView}>
            <Row>
              <SlEvent/>
              <SubLabelContent >이벤트 보기</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>



        </BoxItem>


        <BoxItem>
          <Label>홍여사 소식</Label>

          <SubLabel>
            <Row>
              <CiBellOn/>
              <SubLabelContent>홍여사 알림</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel>
            <Row>
              <CiMedicalClipboard/>
              <SubLabelContent>공지 사항</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
        </BoxItem>

        <BoxItem>
           <Label>기타</Label>


           <SubLabel>
            <Row>
              <BiClinic/>
              <SubLabelContent>고객센타</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel>
            <Row>
              <AiOutlineQuestionCircle/>
              <SubLabelContent>자주묻는 질문</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>


          <SubLabel>
            <Row>
              <VscWorkspaceUnknown/>
              <SubLabelContent>홍여사 알아보기</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>



          <SubLabel>
            <Row>
              <VscWorkspaceUnknown/>
              <SubLabelContent>공간대여 알아보기</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
   
        </BoxItem>

        <BoxItem>
          <Label>약관 및 정책</Label>

          <SubLabel onClick={_handleUselaw}>
            <Row>
              <MdOutlinePolicy/>
              <SubLabelContent>이용약관</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

          <SubLabel onClick={_handlePrivacylaw}>
            <Row>
              <MdOutlinePolicy/>
              <SubLabelContent>개인정보 처리지침</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>


          <SubLabel onClick={_handleGpsLaw}>
            <Row>
              <MdOutlinePolicy/>
              <SubLabelContent>위치정보기반 수집동의 규정</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>
     
        </BoxItem>
        <div style={{height:80}}></div>

    </Container>
  );

}

export default MobileConfigcontainer;


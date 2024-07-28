import React, { Fragment, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { Badge, setRef } from "@mui/material";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Image from "../../../common/Image";
import { WORKNAME } from "../../../utility/work";
import { WORK } from "../../../utility/db";
import { colors } from "../../../theme/theme";
import { BetweenRow, Row } from "../../../common/Row";
import Categorymenu from "../../../common/Categorymenu";
import { PCMAINMENU } from "../../../utility/screen";

import './PCMainheader.css';


const PCHeader = styled.div`
  text-align: center;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 2;
  width: 1400px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
  padding:20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .06);
`;


const OneHeaderMainMenu = styled.div`
  display: flex;
  padding-left: 20px;
  color : #ff4e19;
  font-size:30px;
  width:35%;
  align-items:center;
  justify-content: space-between;
`;
const OneHeaderOptionMenu = styled.div`
  display: flex;
  padding-left: 20px;
  flex-direction:row;
  font-size:14px;
  width:50%;
`
const OneHeaderLoginMenu = styled.div`
  width: 10%;
  display: flex;
  justify-content: space-around;
  margin-right: 30px;
  align-items: center;
`;

const EventDesc = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  margin-left:10px;
  font-size: 14px;
  line-height: 20px;
  color: #5a5a5a;
`

const MainMenuText = styled.div`
  font-size: 18px;
  color: ${({clickstatus}) => clickstatus == true ? ('#ff2a75') :('#595959') };
  fontweight: ${({clickstatus}) => clickstatus == true ? ('600') :('') };
`

const EventMainText ={
  fontSize: '14px',
  color: '#484848'
}


const CategoryLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 95%;
`;
const OneContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: #fff;
  position: fixed;
  z-index: 5;
  color: #595959;
  font-size:14px;
`;

const TwoContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  z-index: 5;
`;




const LineControl = styled.div`
  border: 1px solid #f0f0f0;
  width: 100%;
  position: absolute;
  margin-top: 45px;
`;

const Inputstyle ={
  border: '2px solid #ff4e19',
  background: '#fff',
  width: '100%',
  borderRadius:'5px'

}



const Searchstyle={
  position: "relative",
  left: '-40px'
}



const WorkItems=[
  WORKNAME.ALLWORK,
  WORKNAME.HOMECLEAN,
  WORKNAME.BUSINESSCLEAN,
  WORKNAME.MOVECLEAN,
  WORKNAME.FOODPREPARE,
  WORKNAME.GOOUTSCHOOL,
  WORKNAME.BABYCARE,
  WORKNAME.ERRAND,
  WORKNAME.PATIENTCARE,
  WORKNAME.CARRYLOAD,
  WORKNAME.GOHOSPITAL,
  WORKNAME.RECIPETRANSMIT,
  WORKNAME.GOSCHOOLEVENT,
  WORKNAME.SHOPPING,
  WORKNAME.GODOGHOSPITAL,
  WORKNAME.GODOGWALK,


]

const PCSubheader = ({callback, name}) => {
  const navigation = useNavigate();
  const {user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);
  const [registbutton, setReigstbutton] = useState(false);
  const [mainmenustatus, setMainmenustatus] = useState(name);

  /**
   * 메인 메뉴의 클릭상태를 표시 한다
   * 메인 메뉴에서 선택된 메뉴 페이지로 이동한다
   */

  const _handleMenustatus=(status)=>{
    console.log("TCL: _handleMenustatus -> status", status)
    setMainmenustatus(status);
    if(status == PCMAINMENU.HOMEMENU){
      navigation("/");
    }else if(status == PCMAINMENU.REGIONMENU){
      navigation("/PCmap");
    }else if(status == PCMAINMENU.COMMUNITYMENU){
      navigation("/PCcommunity");
    }else if(status == PCMAINMENU.HONGGUIDE){
      navigation("/PChongguide");
    }else if(status == PCMAINMENU.ROOMGUIDE){
      navigation("/PCroomguide");
    }
    setRefresh((refresh) => refresh +1);
  }


  useEffect(() => {
    setMainmenustatus(mainmenustatus);
  }, [refresh]);

  return (
    <PCHeader>
      <TwoContainer>
        <BetweenRow>
          <OneHeaderMainMenu onClick={()=>{}}>
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.HOMEMENU)}}>
              <img src={imageDB.sample2} width={40} height={45} style={{borderRadius:50}} />
              <div>{PCMAINMENU.HOMEMENU}</div>
            </Row>
      
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.REGIONMENU)}}><MainMenuText clickstatus={PCMAINMENU.REGIONMENU == mainmenustatus}>{PCMAINMENU.REGIONMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.COMMUNITYMENU)}}><MainMenuText clickstatus={PCMAINMENU.COMMUNITYMENU == mainmenustatus}>{PCMAINMENU.COMMUNITYMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.HONGGUIDE)}}><MainMenuText clickstatus={PCMAINMENU.HONGGUIDE == mainmenustatus}>{PCMAINMENU.HONGGUIDE}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.ROOMGUIDE)}}><MainMenuText clickstatus={PCMAINMENU.ROOMGUIDE == mainmenustatus}>{PCMAINMENU.ROOMGUIDE}</MainMenuText></Row> 
          </OneHeaderMainMenu>

          <OneHeaderOptionMenu>
            <Row width={'35%'}>
              <div className="maxheaderblink"> <img src={imageDB.sample3} width={70} height={60} style={{borderRadius:50}} /></div>
              <EventDesc>출석시마다 포인트 언제든지 이용</EventDesc>
            </Row>
            <Row width={'55%'} style={{marginLeft:'35px'}}>
              <input  style={Inputstyle} type="text" placeholder="AI 검색어를 입력해주세요"/>
              <div style={Searchstyle}>
              <img src={imageDB.sample5} width={30} height={30} style={{borderRadius:50}} />
              </div>
            </Row>
        

          </OneHeaderOptionMenu>
          <OneHeaderLoginMenu id="infoheader">
            <div onClick={()=>{}}>로그인</div>
            <div onClick={()=>{}}>회원가입</div>

          </OneHeaderLoginMenu>
        </BetweenRow>



        
     
      </TwoContainer>
      {registbutton == true && (
          <div className="RegisterShowButton" onClick={()=>{}}> 등록</div>
        )}
  </PCHeader>
  );
};

export default PCSubheader;

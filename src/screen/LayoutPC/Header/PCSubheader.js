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
import { LoadingType, PCMAINMENU } from "../../../utility/screen";

import './PCMainheader.css';
import { model } from "../../../api/config";
import PcAipopup from "../../../modal/PcAiPopup/PcAiPopup";
import Loading from "../../../components/Loading";
import { useDispatch } from "react-redux";
import { ALLROOM, ALLWORK } from "../../../store/menu/MenuSlice";
import { GoPlus } from "react-icons/go";


const PCHeader = styled.div`
  text-align: center;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 2;
  width: 1400px;
  height:80px;

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
padding-left: 24px;
color : #ff4e19;
font-size:30px;
width:60%;
align-items:center;
justify-content: flex-start;
`;
const OneHeaderOptionMenu = styled.div`
display: flex;
padding-right: 20px;
flex-direction:row;
font-size:14px;
justify-content:space-between;
width:35%;
`
const OneHeaderLoginMenu = styled.div`
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
  font-size: 20px;
  color: ${({clickstatus}) => clickstatus == true ? ('#ff2a75') :('#131313') };
  font-weight: 400;
`



const TwoContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  z-index: 5;
  border-bottom: 1px solid #f0f0f0;
  height: 80px;
  justify-content: center;
`;

const LoginBtn = styled.div`
  padding: 10px 20px;
  background: #ffd6ac;
  border-radius: 10px;
`;



const Inputstyle ={
  border: '1px solid #C3C3C3',
  background: '#fff',
  width: '100%',
  borderRadius:'5px',
  fontSize:'16px',
  padding :'12px'

}



const Searchstyle={
  position: "relative",
  left: '-40px'
}




export const Minibanner =({pagename}) =>{

  return(
    <>
      {pagename == PCMAINMENU.REGIONMENU && <>
        <div className="maxheaderblink"> <img src={imageDB.sample15} width={35} height={35} style={{borderRadius:35}} /></div>
        <EventDesc>차곡차곡 모은 포인트로 홍여사 서비스 사용하기</EventDesc>
      </> }
      {pagename == PCMAINMENU.ROOMMENU && <>
        <div className="maxheaderblink"> <img src={imageDB.sample16} width={35} height={35} style={{borderRadius:35}} /></div>
        <EventDesc>집에 남아 있는 공간을 이용해서 짐 보관해주고 돈 버세요</EventDesc>
      </>  }
      {pagename == PCMAINMENU.COMMUNITYMENU && <>
        <div className="maxheaderblink"> <img src={imageDB.sample16} width={35} height={35} style={{borderRadius:50}} /></div>
        <EventDesc>매달 한번씩 우수한 홍여사님을 선정  웹페이지에 게시</EventDesc>
      </> }
      {pagename == PCMAINMENU.RANKINGMENU && <>
        <div className="maxheaderblink"> <img src={imageDB.sample17} width={35} height={35} style={{borderRadius:35}} /></div>
        <EventDesc>하루에 한번 갑자기 나타나는 타임 룰렛 돌리고 경품 받아가세요</EventDesc>
      </>  }
      {pagename == PCMAINMENU.EVENTMENU && <>
        <div className="maxheaderblink"> <img src={imageDB.sample18} width={35} height={35} style={{borderRadius:35}} /></div>
        <EventDesc>출석체크하고 포인트 받으세요 포인트는 바로 이용가능</EventDesc>
      </>  }
    </>
  )
};


const PCSubheader = ({callback, name, registmapbtn}) => {
  const navigation = useNavigate();
  const reduxdispatch = useDispatch();

  const {user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);
  const [registbutton, setReigstbutton] = useState(false);
  const [mainmenustatus, setMainmenustatus] = useState(name);

  const [search, setSearch] = useState('');
  const [popupstatus, setPopupstatus] = useState(false);
  const [searchresult, setSearchresult] = useState('');
  const [currentloading, setCurrentloading] = useState(false);


  useEffect(() => {
    setMainmenustatus(mainmenustatus);
    setSearch(search);
    setPopupstatus(popupstatus);

  }, [refresh]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      _handleAI();
    }
  };


  const _handleRegister = () =>{
    navigation("/Pcworkregister");
  }

  /**
   * 메인 메뉴의 클릭상태를 표시 한다
   * 메인 메뉴에서 선택된 메뉴 페이지로 이동한다
   */

  const _handleMenustatus=(status)=>{
    console.log("TCL: _handleMenustatus -> status", status)
    setMainmenustatus(status);
    if(status == PCMAINMENU.HOMEMENU){
      reduxdispatch(ALLWORK());
      navigation("/PCmain");
    }else if(status == PCMAINMENU.ROOMMENU){
      reduxdispatch(ALLROOM());
      navigation("/PCroom");
    }else if(status == PCMAINMENU.REGIONMENU){
      navigation("/PCmap" ,{state :{WORK_ID :"", TYPE : ""}});
    }else if(status == PCMAINMENU.COMMUNITYMENU){
      navigation("/PCcommunity");
    }else if(status == PCMAINMENU.RANKINGMENU){
      navigation("/PChongguide");
    }else if(status == PCMAINMENU.EVENTMENU){
      navigation("/PCevent");
    }else if(status == PCMAINMENU.CHATMENU){
      navigation("/PCchat");
    }
    setRefresh((refresh) => refresh +1);
  }

  const _handleLogin = () =>{
    navigation("/PClogin"); 
  }

  const _handleProfile =() =>{
    navigation("/PCprofile"); 
  }
  
  useEffect(() => {
    setMainmenustatus(mainmenustatus);
  }, [refresh]);

  const popupcallback = async () => {
    setPopupstatus(!popupstatus);
    setSearchresult("");
    setSearch("");
    setRefresh((refresh) => refresh +1);
  };


  const AiSearch = async(input) =>{
    setSearch(input);
    setRefresh((refresh) => refresh +1);
  }



  const _handleAI = async() =>{
    setPopupstatus(true);
    setRefresh((refresh) => refresh +1);
  }


  const _handlecurrentloadingcallback = ()=> {
    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);
  }


  return (
    <PCHeader>

    {
      currentloading == true && <Loading type={LoadingType.AI} callback={_handlecurrentloadingcallback}/>
    }



      {popupstatus == true ? (
        <PcAipopup callback={popupcallback}
        search ={search}
        top={'30px'}  left={'18%'} height={'640px'} width={'1080px'} image={imageDB.sample11}></PcAipopup>
      ) : null}


      <TwoContainer>
        <BetweenRow>
          <OneHeaderMainMenu onClick={()=>{}}>
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.HOMEMENU)}}>
     
              <div clickstatus={true}>
                <img src={imageDB.pclogo} width={118} height={34} style={{borderRadius:50}} />
              </div>
            </Row>

            <Row width={'460px'} style={{marginLeft:'25px', paddingTop:'5px'}}>
              <input  style={Inputstyle} type="text" placeholder="홍여사 AI에 무엇이든 물어주세요 예) 짜장라면 맛있게 끓이기"
                  value={search}
                  onChange={(e) => {
                    AiSearch(e.target.value);
                  }}
                  onKeyDown={handleKeyDown} 
              />
              <div style={Searchstyle}>
              <img src={imageDB.searchgif} width={24} height={24} onClick={_handleAI} />
              </div>
            </Row>

            {/* <Row onClick={()=>{_handleMenustatus(PCMAINMENU.ROOMMENU)}}><MainMenuText clickstatus={PCMAINMENU.ROOMMENU == mainmenustatus}>{PCMAINMENU.ROOMMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.REGIONMENU)}}><MainMenuText clickstatus={PCMAINMENU.REGIONMENU == mainmenustatus}>{PCMAINMENU.REGIONMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.COMMUNITYMENU)}}><MainMenuText clickstatus={PCMAINMENU.COMMUNITYMENU == mainmenustatus}>{PCMAINMENU.COMMUNITYMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.RANKINGMENU)}}><MainMenuText clickstatus={PCMAINMENU.RANKINGMENU == mainmenustatus}>{PCMAINMENU.RANKINGMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.EVENTMENU)}}><MainMenuText clickstatus={PCMAINMENU.EVENTMENU == mainmenustatus}>{PCMAINMENU.EVENTMENU}</MainMenuText></Row>  */}

            {/* <Row onClick={()=>{_handleMenustatus(PCMAINMENU.ROOMGUIDE)}}><MainMenuText clickstatus={PCMAINMENU.ROOMGUIDE == mainmenustatus}>{PCMAINMENU.ROOMGUIDE}</MainMenuText></Row>  */}
          </OneHeaderMainMenu>

          <OneHeaderOptionMenu>
            {/* <Row onClick={()=>{_handleMenustatus(PCMAINMENU.HOMEMENU)}}><MainMenuText clickstatus={PCMAINMENU.HOMEMENU == mainmenustatus}>{PCMAINMENU.HOMEMENU}</MainMenuText></Row>  */}
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.ROOMMENU)}}><MainMenuText clickstatus={PCMAINMENU.ROOMMENU == mainmenustatus}>{PCMAINMENU.ROOMMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.REGIONMENU)}}><MainMenuText clickstatus={PCMAINMENU.REGIONMENU == mainmenustatus}>{PCMAINMENU.REGIONMENU}</MainMenuText></Row> 
            {/* <Row onClick={()=>{_handleMenustatus(PCMAINMENU.COMMUNITYMENU)}}><MainMenuText clickstatus={PCMAINMENU.COMMUNITYMENU == mainmenustatus}>{PCMAINMENU.COMMUNITYMENU}</MainMenuText></Row>  */}
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.CHATMENU)}}><MainMenuText clickstatus={PCMAINMENU.CHATMENU == mainmenustatus}>{PCMAINMENU.CHATMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.LIVEINFORMATIONMENU)}}><MainMenuText clickstatus={PCMAINMENU.LIVEINFORMATIONMENU == mainmenustatus}>{PCMAINMENU.LIVEINFORMATIONMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.EVENTMENU)}}><MainMenuText clickstatus={PCMAINMENU.EVENTMENU == mainmenustatus}>{PCMAINMENU.EVENTMENU}</MainMenuText></Row> 

        

          </OneHeaderOptionMenu>
          <OneHeaderLoginMenu id="infoheader">
            <img src={imageDB.logout} onClick={_handleLogin} style={{width:24, height:24, marginRight:10}}/>
            <img src={imageDB.user} onClick={_handleProfile}  style={{width:24, height:24}}/>
  
          </OneHeaderLoginMenu>
        </BetweenRow>
     
      </TwoContainer>
      {registbutton == true && (
          <div className="RegisterShowButton" onClick={()=>{}}><GoPlus/>등록</div>
        )}
      {registmapbtn == true  && (
          <div className="RegisterShowButton" onClick={_handleRegister}>
            <GoPlus/>등록</div>
        )}
  </PCHeader>
  );
};

export default PCSubheader;

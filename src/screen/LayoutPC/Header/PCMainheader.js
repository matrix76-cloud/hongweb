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
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import Categorymenu from "../../../common/Categorymenu";
import { CENTERTYPE, EventItems, EVENTTYPE, LAWTYPE, LoadingType, PCMAINMENU } from "../../../utility/screen";
import ReactTyped from "react-typed";

import { ROOMSIZE, ROOMSIZEDISPALY } from "../../../utility/room";
import { GoPlus } from "react-icons/go";
import { DataContext } from "../../../context/Data";
import { model } from "../../../api/config";
import PcAipopup from "../../../modal/PcAiPopup/PcAiPopup";
import Loading from "../../../components/Loading";

import { useDispatch, useSelector } from "react-redux";
import { ALLWORK, HOMECLEAN,BUSINESSCLEAN,
  MOVECLEAN,FOODPREPARE,ERRAND,GOOUTSCHOOL,BABYCARE,LESSON,PATIENTCARE,CARRYLOAD,
  GOHOSPITAL,RECIPETRANSMIT,GOSCHOOLEVENT,SHOPPING,GODOGHOSPITAL,GODOGWALK,ALLROOM, SMALLROOM, MEDIUMROOM, LARGEROOM} from "../../../store/menu/MenuSlice"




const PCHeader = styled.div`
  height: ${({height}) => height}px;
  text-align: center;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 2;
  width: 1400px;

`;

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding:10px 0px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .06);
`;


const OneHeaderMainMenu = styled.div`
  display: flex;
  padding-left: 24px;
  color : #ff4e19;
  font-size:30px;
  width:55%;
  align-items:center;
  justify-content: flex-start;
`;
const OneHeaderOptionMenu = styled.div`
  display: flex;
  flex-direction:row;
  font-size:14px;
  justify-content:space-between;
  width:32%;
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
  margin-left:20px;
  font-size: 14px;
  line-height: 20px;
  color: #5a5a5a;
`

const MainMenuText = styled.div`
  font-size: 20px;
  color: ${({clickstatus}) => clickstatus == true ? ('#ff2a75') :('#131313') };
  font-weight: ${({clickstatus}) => clickstatus == true ? ('600') :('400') };
`

const EventMainText ={
  fontSize: '14px',
  color: '#3896C3',
  fontWeight:600,
}

const EventSubText ={
  fontSize: '14px',
  color: '#9F7E74',
  fontWeight:400,
}

const EventBtn ={
  display:"flex",
  justifyContent:"space-between",
  width:'30%',

}


const CategoryLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height:49px;
`;
const CategoryItem = styled.div`
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  display: inline-block;
  color: #595959;

`




const OneContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 34px;
  background-color: #FFF5EF;
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
  margin-top: 34px;

  
`;




const LineControl = styled.div`

  width: 100%;
  position: absolute;
  margin-top: 45px;
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
  left: '-35px'
}
const Search2style={
  position: "relative",
  left: '0px',
  top: '5px'
}


const LoginBtn = styled.div`
  padding: 10px 30px;
  background: #ffd6ac;
  border-radius: 10px;
`;




const WorkItems=[
  WORKNAME.ALLWORK,
  WORKNAME.HOMECLEAN,
  WORKNAME.BUSINESSCLEAN,
  WORKNAME.MOVECLEAN,
  WORKNAME.FOODPREPARE,
  WORKNAME.GOOUTSCHOOL,
  WORKNAME.BABYCARE,
  WORKNAME.LESSON,
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

const RoomItems =[
  ROOMSIZE.ALLROOM,
  ROOMSIZE.SMALL,
  ROOMSIZE.MEDIUM,
  ROOMSIZE.LARGE,

]


const PCMainheader = ({name, registbtn,registmapbtn, height}) => {

  const reduxdispatch = useDispatch();

  const navigation = useNavigate();
  const {user, dispatch } = useContext(UserContext);
  const {data, datadispatch } = useContext(DataContext);
  const [refresh, setRefresh] = useState(1);
  const [registbutton, setReigstbutton] = useState(false);
  const [mainmenustatus, setMainmenustatus] = useState(name);
  const [categorystatus, setCategorystatus] = useState(WORKNAME.ALLWORK);
  const [search, setSearch] = useState('');
  const [popupstatus, setPopupstatus] = useState(false);



  useEffect(() => {
    setMainmenustatus(mainmenustatus);
    setCategorystatus(categorystatus);
    setSearch(search);
    setPopupstatus(popupstatus);

  }, [refresh]);

  const popupcallback = async () => {
    setPopupstatus(!popupstatus);

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

/**
 * 둥록이 헤더쪽에 있기 때문에 일감 등록과 공간 등록을 구분할수 있어여 한다
 * 파라미터에서 들어온 name 을 가지고 등록유형을 구분하자
 */
  const _handleRegister = () =>{
    if(name == PCMAINMENU.HOMEMENU){
      navigation("/Pcworkregister");
    }else if(name == PCMAINMENU.ROOMMENU){
      navigation("/PCroomregister");
    }
  }
  const _handleMapRegister = () =>{
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
  const _handleCenter = () =>{
    navigation("/PCcenter",{state :{CENTERTYPE :CENTERTYPE.NOTICE}});
  }

  const _handleAttendance = () =>{

    navigation("/PCattendanceevent");
  }
  const _handleRullet = () =>{

    navigation("/PCrulletevent");
  }

  const _handlePolicy =() =>{
    navigation("/PCPolicy" ,{state :{LAWTYPE :LAWTYPE.USELAW}});
  }

  const _handleroomprice =() =>{
    setCategorystatus("");
    setRefresh((refresh) => refresh +1);
    navigation("/PCroomprice");
  }

  /**
   *  카테고리 메뉴의 클릭상태를 표시 한다
   */
  const _handleCategorystatus = (status) =>{
    console.log("TCL: _handleCategorystatus -> status", status);

    if(status == WORKNAME.ALLWORK){
      reduxdispatch(ALLWORK());
    }else if(status == WORKNAME.HOMECLEAN){
      reduxdispatch(HOMECLEAN());
    }else if(status == WORKNAME.BUSINESSCLEAN){
      reduxdispatch(BUSINESSCLEAN());
    }else if(status == WORKNAME.MOVECLEAN){
      reduxdispatch(MOVECLEAN());
    }else if(status == WORKNAME.FOODPREPARE){
      reduxdispatch(FOODPREPARE());
    }else if(status == WORKNAME.ERRAND){
      reduxdispatch(ERRAND());
    }else if(status == WORKNAME.GOOUTSCHOOL){
      reduxdispatch(GOOUTSCHOOL());
    }else if(status == WORKNAME.BABYCARE){
      reduxdispatch(BABYCARE());
    }else if(status == WORKNAME.LESSON){
      reduxdispatch(LESSON());
    }else if(status == WORKNAME.PATIENTCARE){
      reduxdispatch(PATIENTCARE());
    }else if(status == WORKNAME.CARRYLOAD){
      reduxdispatch(CARRYLOAD());
    }else if(status == WORKNAME.GOHOSPITAL){
      reduxdispatch(GOHOSPITAL());
    }else if(status == WORKNAME.RECIPETRANSMIT){
      reduxdispatch(RECIPETRANSMIT());
    }else if(status == WORKNAME.GOSCHOOLEVENT){
      reduxdispatch(GOSCHOOLEVENT());
    }else if(status == WORKNAME.SHOPPING){
      reduxdispatch(SHOPPING());
    }else if(status == WORKNAME.GODOGHOSPITAL){
      reduxdispatch(GODOGHOSPITAL());
    }else if(status == WORKNAME.GODOGWALK){
      reduxdispatch(GODOGWALK());
    }else if(status == ROOMSIZE.ALLROOM){
      reduxdispatch(ALLROOM());
    }else if(status == ROOMSIZE.SMALL){
      reduxdispatch(SMALLROOM());
    }else if(status == ROOMSIZE.MEDIUM){
      reduxdispatch(MEDIUMROOM());
    }else if(status == ROOMSIZE.LARGE){
      reduxdispatch(LARGEROOM());
    } 

    setCategorystatus(status);
    setRefresh((refresh) => refresh +1);

  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      _handleAI();
    }
  };



/**
 * 마우스를 움직일때 사라지고 없어지고 한다
 * ! id 값 : oneheader, twohenader
 */
  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > 10) {

        let element = document.getElementById("oneheader");

        if (element != null) {
          document.getElementById("oneheader").style.display = "none";
        }

        element = document.getElementById("twoheader");

        if (element != null) {
          document.getElementById("twosubheader").style.margin = "10px 0px";
          document.getElementById("twoheader").style.marginTop = "0px";
          document.getElementById("twoheader").style.width = "100%";
          document.getElementById("twoheader").style.borderBottom =
            "1px solid #ededed";
        }

      } else {
        let element = document.getElementById("oneheader");
        if (element != null) {
          document.getElementById("oneheader").style.display = "flex";
        }

        element = document.getElementById("twoheader");
        if (element != null) {
          document.getElementById("twosubheader").style.margin = "0px 0px 10px 0px";
          document.getElementById("twoheader").style.marginTop = "55px";
          document.getElementById("twoheader").style.height = "115px";
          document.getElementById("twoheader").style.border = "none";
          document.getElementById("twoheader").style.width = "100%";
        }

       }

       if (window.scrollY > 10) {
        setReigstbutton(true);
      } else {
        setReigstbutton(false);
      }

    };

    window.addEventListener("scroll", handleShowButton);

    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };
  }, []);




  return (
    <>


    {popupstatus == true ? (
        <PcAipopup callback={popupcallback}
        search ={search}
        top={'30px'}  left={'18%'} height={'640px'} width={'1080px'} image={imageDB.sample11}></PcAipopup>
      ) : null}

    <PCHeader height={height}>
      <OneContainer id="eventheader">
        <BetweenRow width={'100%'} padding={'0px 24px'}>
          <FlexstartRow style={{width:'10%'}}>
            <div style={EventMainText}>홍여사 앱 설치하기</div>
            <div style={{display:"flex", paddingLeft:10}}><img src={imageDB.download} width={14} height={14}/></div>     
          </FlexstartRow>
          <FlexstartRow  style={{width:'60%',color:'#93442D', fontSize:14, fontWeight:400}}>
            <div style={{color:'#93442D', fontSize:14, fontWeight:600, marginRight:10}}>공지사항</div>
            <ReactTyped
                    strings={["홍여사 출석체크 하고 매일매일 1000point 받아가세요"]}
                    typeSpeed={100}
                    loop
            />
          </FlexstartRow>

          <AroundRow style={{width:'40%'}}>
              <div style={EventSubText}>홍여사 알아보기</div>
              <div style={EventSubText}>공간대여 알아보기</div>
              <div style={EventSubText}  onClick={_handleCenter}>고객센타</div>
              <div style={EventSubText}  onClick={_handleAttendance}>출석체크이벤트</div>
              <div style={EventSubText}  onClick={_handleRullet}>룰렛이벤트</div>
              <div style={EventSubText}  onClick={_handlePolicy}>이용 약관</div>
          </AroundRow>
        </BetweenRow>    
        <LineControl></LineControl>
      </OneContainer>

      <TwoContainer id="twoheader">
        <BetweenRow style={{height:72}} id="twosubheader">
          <OneHeaderMainMenu onClick={()=>{}}>
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.HOMEMENU)}}>
         
                <img src={imageDB.pclogo} width={118} height={34} />
            

            </Row>
            <Row width={'460px'} style={{marginLeft:'25px', paddingTop:'paddingTop:5'}}>
        
              <input  style={Inputstyle} type="text" placeholder="홍여사 AI에 무엇이든 물어주세요 예)짜장라면 맛있게 끓이기"
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
   
          </OneHeaderMainMenu>
          <OneHeaderOptionMenu>
       
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.HOMEMENU)}}><MainMenuText clickstatus={PCMAINMENU.HOMEMENU == mainmenustatus}>{PCMAINMENU.HOMEMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.ROOMMENU)}}><MainMenuText clickstatus={PCMAINMENU.ROOMMENU == mainmenustatus}>{PCMAINMENU.ROOMMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.REGIONMENU)}}><MainMenuText clickstatus={PCMAINMENU.REGIONMENU == mainmenustatus}>{PCMAINMENU.REGIONMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.COMMUNITYMENU)}}><MainMenuText clickstatus={PCMAINMENU.COMMUNITYMENU == mainmenustatus}>{PCMAINMENU.COMMUNITYMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.CHATMENU)}}><MainMenuText clickstatus={PCMAINMENU.CHATMENU == mainmenustatus}>{PCMAINMENU.CHATMENU}</MainMenuText></Row> 
            <Row onClick={()=>{_handleMenustatus(PCMAINMENU.EVENTMENU)}}><MainMenuText clickstatus={PCMAINMENU.EVENTMENU == mainmenustatus}>{PCMAINMENU.EVENTMENU}</MainMenuText></Row> 

          </OneHeaderOptionMenu>
          <OneHeaderLoginMenu id="infoheader">
            <img src={imageDB.logout} onClick={_handleLogin} style={{width:24, height:24, marginRight:10}}/>
            <img src={imageDB.user} onClick={_handleProfile}  style={{width:24, height:24}}/>
  
          </OneHeaderLoginMenu>
        </BetweenRow>


        {
          (name == PCMAINMENU.HOMEMENU  || name == PCMAINMENU.ROOMMENU ) && <CategoryContainer>
          <CategoryLine id="categoryheader">

            {
              name == PCMAINMENU.HOMEMENU &&
              <BetweenRow style={{width:'100%', margin:"0px auto", paddingLeft:4}}>
              {
                WorkItems.map((data, index)=>(
                    <Categorymenu callback={_handleCategorystatus} menu={data}
                    clickstatus={data == categorystatus}>{data}</Categorymenu>
                ))
              }
              </BetweenRow>
            }
            {
              name == PCMAINMENU.ROOMMENU &&
              <BetweenRow style={{width:'100%', margin:"0px auto"}}>
                <FlexstartRow style={{width:'70%'}}>
                {
                  RoomItems.map((data, index)=>(
                      <Categorymenu callback={_handleCategorystatus} menu={data}
                      clickstatus={data == categorystatus}>{data}</Categorymenu>
                  ))
                }
                </FlexstartRow>
                <div onClick={_handleroomprice} style={{width:"10%",textDecoration:"underline", textUnderlineOffset:5}}>사이즈 알아보기</div>
              </BetweenRow>
              
            }
       

          </CategoryLine>
          </CategoryContainer>
        }

        
     
      </TwoContainer>

      {/* 스크롤바에 따라 버튼 생성 만들기 */}
      {/* {registbutton == true && (registbtn == true ) && (
          <div className="RegisterShowButton" onClick={_handleRegister}>
            <GoPlus/> 등록</div>
        )} */}

      {registbtn == true  && (
          <div className="RegisterShowButton" onClick={_handleRegister}>
            <GoPlus/> 등록</div>
        )}
      {registmapbtn == true  && (
          <div className="RegisterShowButton" onClick={_handleMapRegister}>
            <GoPlus/> 등록</div>
        )}

    </PCHeader>
    </>
  );
};

export default PCMainheader;

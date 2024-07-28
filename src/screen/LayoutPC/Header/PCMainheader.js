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
  height: 200px;
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
  margin-left:20px;
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
const EventBtn ={
  display:"flex",
  justifyContent:"space-between",
  width:'30%',

}


const CategoryLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 95%;
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
  margin-top: 55px;
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

const PCMainheader = ({callback, name}) => {


  const navigation = useNavigate();
  const {user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);
  const [registbutton, setReigstbutton] = useState(false);
  const [mainmenustatus, setMainmenustatus] = useState(name);
  const [categorystatus, setCategorystatus] = useState(WORKNAME.ALLWORK);




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

  /**
   *  카테고리 메뉴의 클릭상태를 표시 한다
   */
  const _handleCategorystatus = (status) =>{
    console.log("TCL: _handleCategorystatus -> status", status)
    setCategorystatus(status);
    setRefresh((refresh) => refresh +1);
    
  }


  useEffect(() => {
    setMainmenustatus(mainmenustatus);
    setCategorystatus(categorystatus);
  }, [refresh]);

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
    <PCHeader>
      <OneContainer id="eventheader">
        {/* <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", width:"100%", padding:"0px 20px"}}> */}
        <BetweenRow width={'100%'} padding={'0px 20px'}>
          <Row>
            <div style={EventMainText}>홍여사 앱 설치하기</div>
            <div><img src={imageDB.sample1} width={20} height={20}/></div>     
          </Row>
          <BetweenRow width={'30%'}>
              <div style={EventMainText}>이벤트보기</div>
              <div style={EventMainText}>자주하는 질문</div>
              <div style={EventMainText}>1:1카톡 문의</div>
              <div style={EventMainText}>공지사항</div>
              <div style={EventMainText}>이용 약관</div>
          </BetweenRow>
        </BetweenRow>    
        <LineControl></LineControl>
      </OneContainer>

      <TwoContainer id="twoheader">
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
              <EventDesc>출석시마다 포인트 언제든지 이용 모은 포인트는 바로 사용 가능</EventDesc>
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


   
        <Container>
            <CategoryLine id="categoryheader">
            {
              WorkItems.map((data, index)=>(
                  <Categorymenu callback={_handleCategorystatus} menu={data}
                  clickstatus={data == categorystatus}>{data}</Categorymenu>
              ))
            }
            </CategoryLine>
        </Container>
        
     
      </TwoContainer>
      {registbutton == true && (
          <div className="RegisterShowButton" onClick={()=>{}}> 등록</div>
        )}
  </PCHeader>
  );
};

export default PCMainheader;

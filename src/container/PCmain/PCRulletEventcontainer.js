import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PCWorkItem from "../../components/PCWorkItem";
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { PCCOMMNUNITYMENU } from "../../utility/screen";
import Communitymenu from "../../common/Communitymenu";
import CommunityItem from "../../components/CommunityItem";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import QRCode from 'qrcode.react';

const Container = styled.div`
 

`
const style = {
  display: "flex"
};

const EventProcessTag = styled.div`
  background: #000;
  width: 100px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  color: #fff;
  height: 40px;
  align-items: center;

`

const EventTitle = styled.div`
  font-size: 20px;
  line-height: 60px;

  border-bottom: 1px solid #ddd;
  width : 85%;
  font-weight:500;

`




const PCRulletEventcontainer =({containerStyle}) =>  {


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [state, setState] = useState(-1);
  const [checkstatus, setCheckstatus] = useState(false);

  var rolLength = 6; // 해당 룰렛 콘텐츠 갯수
  var setNum; // 랜덤숫자 담을 변수
  var hiddenInput = document.createElement("input");
  hiddenInput.className = "hidden-input";


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setCheckstatus(checkstatus);
    setState(state);
  },[refresh])



  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */
  useLayoutEffect(()=>{
    async function FetchData(){

    } 

    FetchData();
  }, [])


  const rRandom = () => {
    var min = Math.ceil(0);
    var max = Math.floor(rolLength - 1);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const rRotate = () => {
    var panel = document.querySelector(".rouletter-wacu");
    var btn = document.querySelector(".rouletter-btn");
    var deg = [];
    // 룰렛 각도 설정(rolLength = 6)
    for (var i = 1, len = rolLength; i <= len; i++) {
      deg.push((360 / len) * i);
    }
    
    // 랜덤 생성된 숫자를 히든 인풋에 넣기
    var num = 0;
    document.body.append(hiddenInput);
    setNum = hiddenInput.value = rRandom();
    
    // 애니설정
    var ani = setInterval(() => {
      num++;
      panel.style.transform = "rotate(" + 360 * num + "deg)";
      btn.disabled = true; //button,input
      btn.style.pointerEvents = "none"; //a 태그
      
      // 총 50에 다달했을때, 즉 마지막 바퀴를 돌고나서
      if (num === 50) {
        clearInterval(ani);
        panel.style.transform = `rotate(${deg[setNum]}deg)`;
      }
    }, 50);
  };
  
  // 정해진 alert띄우기, custom modal등
  // 3 이면 꽝
  // 1 이면 꽝 
  // 2 이면 5000 포인트
  // 4 이면 스타벅스
  // 5 이면 신세계
  // 6 이면 꽝
  const RLayerPopup = async(num) => {
  
    console.log("TCL: RLayerPopup -> num", num)
    
    switch (num) {
      case 1:
        setState(1);
        break;
      case 3:
        setState(2);
        break;
      case 5:
        setState(3);
        break;
      default:
        setState(4);
    }

    setCheckstatus(true);

    setRefresh((refresh) => refresh +1);

    var btn = document.querySelector(".rouletter-btn");
    btn.disabled = false; //button,input
    const supdate = await useSleep(500);
    // window.scrollTo(0, document.body.scrollHeight);

  };
  
  // reset
  const rReset = (ele) => {
    setTimeout(() => {
      //ele.disabled = false;
      // ele.style.pointerEvents = "auto";
      RLayerPopup(setNum);
      hiddenInput.remove();
    }, 5500);
  };

  const _handlestart = async() =>{
    rRotate();
    rReset();

    const update = await useSleep(5000);

  }

  



  return (
    <Container style={containerStyle}>
      <Column margin={'0px auto;'} width={'70%'} style={{background:"#fff"}} >
        <EventTitle>
          <div style={{marginTop:30}}>
            <EventProcessTag>진행중</EventProcessTag>
          </div>
          <BetweenRow>
            <EventTitle style={{textAlign: "left"}}>{'타임어택 룰렛'}</EventTitle>
            <EventTitle style={{textAlign: "right"}}>{'오전 10:00 ~ 12:00'}</EventTitle>
          </BetweenRow>


          {checkstatus == true  && (state == 2 || state == 4 || state== 5) ? (
              <img src={imageDB.rulletsuccess}  style={{ zIndex:2, width:'100%', height:600}}/>
            ) : null}

          <div class="rouletter">

          <div class="rouletter-bg">
              <div class="rouletter-wacu"></div>
          </div>
            <div class="rouletter-arrow"><img src = {imageDB.rulletpin} style={{width:40}}/></div>
            <div class="rouletter-btn" onClick={_handlestart}><img src = {imageDB.rulletstart} style={{width:100}}/></div>

        </div>

        </EventTitle>

      </Column>

    </Container>
  );

}

export default PCRulletEventcontainer;


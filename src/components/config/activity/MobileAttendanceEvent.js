import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../../context/User";
import moment from "moment";
import { imageDB } from "../../../utility/imageData";

import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import { Column, FlexstartColumn } from "../../../common/Column";

import Button from "../../../common/Button";
import { DataContext } from "../../../context/Data";

import { readuserbydeviceid, Readuserbyusersid, Update_attendancebyusersid } from "../../../service/UserService";
import { getDateEx, getDateFullTime } from "../../../utility/date";
import { useDispatch } from "react-redux";
import { ALLREFRESH } from "../../../store/menu/MenuSlice";
import { sleep } from "../../../utility/common";
import LottieAnimation from "../../../common/LottieAnimation";
import ButtonEx from "../../../common/ButtonEx";
import MobileHeaderLayer from "../../MobileHeaderLayer";

import { getFontSize } from "../../../utility/fontsize";

const Container = styled.div`
  background : #FE6625;

`
const style = {
  display: "flex"
};



const EventTitle = styled.div`
  font-size: ${() => getFontSize(16)}px;
  line-height: 40px;
  width : 90%;


`

const CheckStatus = styled.div`
  text-align: center;
  width: 90%;
  margin : 10px auto;

`

const AttendanceCheckLabel = styled.div`
  font-size: ${() => getFontSize(25)}px;
  color: #3c4cb2;
  font-family : Pretendard-SemiBold;
  line-height: 50px;
  letter-spacing: -1.5px;
`
const AttendanceCheckDay = styled.div`
    font-size: ${() => getFontSize(40)}px;

    font-family :Pretendard-SemiBold;
    line-height: 70px;

    color :#000;
`

const AttendanceCheckDesc = styled.div`
  font-size: ${() => getFontSize(18)}px;
  color: #797979;
  line-height: 34px;
  margin-bottom: 20px;
  padding: 0px 10px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  text-align: left;
`

const AttendanceEvent= [
{day :1, check : false, checkday:""},
{day :2, check : false, checkday:""},
{day :3, check : false, checkday:""},
{day :4, check : false, checkday:""},
{day :5, check : false, checkday:""},
{day :6, check : false, checkday:""},
{day :7, check : false, checkday:""},
{day :8, check : false, checkday:""},
{day :9, check : false, checkday:""},
{day :10, check : false, checkday:""},
{day :11, check : false, checkday:""},
{day :12, check : false, checkday:""},

]

const CheckDate = styled.div`
  position: absolute;
  color: #880a9d;
  font-size: ${() => getFontSize(10)}px;
  top: 75px;
  
`
const NotCheckDate = styled.div`
  position: absolute;
  color: #96989C;
  font-size: ${() => getFontSize(20)}px;
`
const NotCheckButton = styled.div`
  position: absolute;
  color: #FFF;
  background : #9051F8;
  width:55px;
  height:55px;
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:60px;
  font-size: ${() => getFontSize(12)}px;

  border: 2px solid #8B5CF6;

  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  transition: all 0.3s ease-in-out;

  animation: blink-effect 1s step-end infinite; 
    @keyframes blink-effect {
      50% {
        opacity: 0;
      }
    }
`

const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

const AttendanceBox = styled.div`
    flex-wrap: wrap;
    margin: 20px 0px 0px;
    background: rgb(255, 255, 255);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
`
const HeaderLayer = styled.div`
    width: 100%;
    background: #9051F8;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height:50px;

`

const Attdendanceday = 3;

const MobileAttendanceEvent =({containerStyle}) =>  {
  const reduxdispatch = useDispatch();

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [checkitems, setCheckitems] = useState([]);
  const [animatecomplete, setAnimatecomplete] = useState(false);
  const [check, setCheck] = useState(0);
  const [enable, setEnable] = useState(true);
  const [currentloading, setCurrentloading] = useState(true);
  const [checks, setChecks] = useState(0);

  const [firstUncheckedIndex, setFirstUncheckedIndex] = useState(0);

  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault(); // 다른 영역에서는 차단
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  
  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);




  async function FetchData(){


  
    const USERS_ID = user.USERS_ID;
    const userdata = await Readuserbyusersid({ USERS_ID });
    const today = moment(); // 현재 날짜


    let CurrentEnable = false;
    let count = 0;
    userdata.CHECKDATE.map((data, index) =>{
      AttendanceEvent[index].check = true;
      AttendanceEvent[index].checkday = data;
      count++;
      

      if(data == getDateEx(today)){
        CurrentEnable = true;
      }
    })

    setChecks(count);




  if(CurrentEnable){
    setEnable(false); 


  }else{
    setEnable(true);
  }
    
    setCheckitems(AttendanceEvent);
    
    console.log("Attendance Events", AttendanceEvent);
    
    const firstUncheckedIndexTmp = AttendanceEvent.findIndex((item) => item.check === false);

    const now = new Date();

    const todaychecked = AttendanceEvent.findIndex((item) => item.checkday === getDateEx(now));

    console.log("todychecked", todaychecked);

    
    if (todaychecked <  0) {
      setFirstUncheckedIndex(firstUncheckedIndexTmp);
    }
    


  setCurrentloading(false);
  setRefresh((refresh) => refresh +1);

}


  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */

  useEffect(()=>{
   FetchData();
  }, [])


  const _hanldlecheck = async() =>{

    setEnable(false);
    setRefresh((refresh) => refresh +1);

    const DEVICEID = user.DEVICEID;
    const userdata = await readuserbydeviceid({DEVICEID});


    const today = moment(); // 현재 날짜

    const DATE = getDateEx(today);
    const USERS_ID = user.USERS_ID;

    Update_attendancebyusersid({DATE, USERS_ID}).then(async ()=>{
      
      await sleep(1000);
      reduxdispatch(ALLREFRESH());
      FetchData();
    })

 
  }

  const _handleprev = () => {
    navigate(-1);
  }


  return (
    <Container style={containerStyle}>
      {currentloading == true ? (<LottieAnimation  animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'} />) : (<Column margin={'0px auto;'} width={'100%'} style={{ background: "#FFF" }} >
          


          <Row>
            <img src={imageDB.CHEAK_FOC_A} style={{ width: "80px", marginTop: 44 }} />
            <Row>
              <div style={{
                fontSize: "14px", background: "#A674F9", color: "#fff", borderRadius: "15px", padding: "5px 20px",
                fontFamily: "Pretendard-Regular", display: "flex", height: "20px", alignItems: "center"
              }}><div>{'~행사 종료시까지'}</div>
              </div>
            </Row>   
          </Row>

  
          <FlexstartRow style={{justifyContent:"center"}}>
            <CheckStatus>
     
              <Row>
                <div style={{ fontSize: "28px", fontFamily: "Pretendard-Bold", color: "#1A1E28" }}>{'출석체크 이벤트'}</div>
              </Row>

         

              <FlexstartRow style={{ marginTop: 20 }}>
                <div style={{
                  fontSize: "14px", color: "#96989C", borderRadius: "15px", textAlign:"left",padding:"0px 10px",
                  fontFamily: "Pretendard-Regular", display: "flex", alignItems: "flex-start", justifyContent:"flex-start"
                }}><div>{'12일 누적 출석이 완료되면 5000point를 드립니다.'}</div>
                </div>
              </FlexstartRow>  

            
              <AttendanceBox>
                <HeaderLayer>
                  <div style={{padding : '20px 20px', color:"#fff"}}>현재 출석일 :
                    <span style={{ fontFamily: "Pretendard-Bold", fontSize: () => getFontSize(20), color: "#FFF", paddingLeft: 10 }}>{checks}일차</span></div>
                </HeaderLayer>
                <Row style={{ flexWrap: "wrap", padding: "10px 15px" }}>
                  {

                    checkitems.map((data, index) => (
                      <Row style={{ width: '25%', height: 100 }}>

                        {
                          data.check == true ? (
                            <Row style={{position:"relative"}}>
                              <CheckDate>{data.checkday}</CheckDate>
                              <img src={imageDB.CHEAK_FOC_A} style={{ width: 70, height: 70 }} />
                            </Row>
                 
                          ) : (
                            
                              <>
                                {
                                  index == firstUncheckedIndex ? (<Row onClick={_hanldlecheck}>
                                    <NotCheckButton>{'여기를누르세요'}</NotCheckButton>
                                
                                  </Row>) : (<Row>
                                    <NotCheckDate>{data.day}</NotCheckDate>
                                    <img src={imageDB.CHEAK_NOR} style={{ width: 70, height: 70 }} />
                                  </Row>)
                                }
                              
                              </>
           

                          )
                        }

                      </Row>
                    ))
                  }

                </Row>
    
              </AttendanceBox>
  
    
              
           
            </CheckStatus>
  
          </FlexstartRow>
  
        </Column>)
      }


    </Container>
  );

}

export default MobileAttendanceEvent;


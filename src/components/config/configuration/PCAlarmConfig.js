import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column } from "../../../common/Column";
import { BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import { UserContext } from "../../../context/User";
import { imageDB } from "../../../utility/imageData";
import { EVENT_TYPE, FILTERITEMMONEY } from "../../../utility/screen";
import { REQUESTINFO, WORKNAME } from "../../../utility/work";

import { PiLockKeyLight } from "react-icons/pi"
import { BADGE } from "../../../utility/badge";
import { setRef } from "@mui/material";

import { IoIosRefresh } from "react-icons/io";
import { CreateName } from "../../../utility/data";
import { CountryAddress, MainRegion } from "../../../utility/region";
import MobileSuccessPopup from "../../../modal/MobileSuccessPopup/MobileSuccessPopup";
import { getuserInfobyusers_id, Update_userinfobyusersid } from "../../../service/UserService";
import { SlEnvelopeOpen } from "react-icons/sl";
import { sleep } from "../../../utility/common";
import { CreateEventConfig, ReadEventConfig, UpdateEventConfig } from "../../../service/EventConfigService";
import LottieAnimation from "../../../common/LottieAnimation";
import { LoadingCommunityStyle } from "../../../screen/css/common";
import PCConfigHeader from "../../PCConfigHeader";
import { getFontSize } from "../../../utility/fontsize";

const Container = styled.div`
  background:#fff;
`
const style = {
  display: "flex"
};

const Label = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-left: 30px;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(22)}px;

`

const EventBox = styled.div`

  margin-top:30px;
  width: 95%;
  margin-bottom: 30px;
  cursor: pointer;
  transition: .2s all;
  margin:0 auto;
  
`
const txtWrap = {
  backgroundColor:'#fafafa',
  padding: '18px 20px 24px',
  lineHeight:2
}

const tit ={
  fontSize: '18px',
  fontWeight: 700,
}

const day = {
  color: '#797979',
  fontSize: '16px'
}

const FilterBox = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  background: ${({clickstatus}) => clickstatus == true ? ('#FF7125') :('#fff') };
  border:  ${({clickstatus}) => clickstatus == true ? (null) :('1px solid #C3C3C3') };
  margin-right: 3px;
  border-radius: 4px;
  padding: 0px 15px;
  height:30px;
  flex: 0 0 auto; /* 아이템의 기본 크기 유지 */

`
const FilterBoxText = styled.div`
color: ${({clickstatus}) => clickstatus == true ? ('#FFF') :('#131313') };
font-size: ${() => getFontSize(14)}px;
margin-left:5px;
font-weight:600;

`
const Box = styled.div`
  width: 90%;
  margin: 20px auto;
  background: #fff;
  height: ${({height}) => height}px;


`
const BoxImg = styled.div`
  border-radius: 50px;
  background: ${({enable}) => enable == true ? ('#fdeda8'):('#ededed')};
  padding: 20px;
  display :flex;
`

const SubText = styled.div`
  padding-left: 18px;
  margin-top: 10px;
  font-family: 'Pretendard';
  line-height:1.8;
`
const Inputstyle ={
  border: '1px solid #C3C3C3',
  background: '#fff',
  width: '90%',
  borderRadius:'5px',
  fontSize:'16px',
  padding :'12px'

}

const ReqButton = styled.div`
  height: 44px;
  width: 90%;
  margin : 0 auto;
  border-radius: 4px;
  background: ${({enable}) => enable == true ? ('#FF7125') :('#dbdada')};
  color:  ${({enable}) => enable == true ? ('#fff') :('#999')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family:"Pretendard-SemiBold";
  font-size: ${() => getFontSize(18)}px;

`
const RefreshItem = styled.div`
  position: absolute;
  left: 85%;
  z-index: 5;
  margin-top: 10px;
  font-size: ${() => getFontSize(20)}px;


`

const mapstyle = {

  overflow: "hidden",
  width:'100%',
  height:'65vh'
};

const ConfigLayer = styled.div`
  margin: 0 auto;
  position: absolute;
  bottom: 0px;
  height: 170px;
  background: #fff;
  z-index: 10;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  margin-left: 15px;
`
const FlexWrap = styled.div`
  display:flex;
  flex-wrap : wrap;
  padding-left:10px;

`

const ConfigLabel = styled.div`
  font-family : Pretendard-SemiBold;
  font-size: ${() => getFontSize(16)}px;
  padding: 20px 20px 10px;

`
const AddressItem = styled.div`
  padding: 8px 10px;
  width: 20%;
  font-family :"Pretendard-SemiBold";
  border: 1px solid #eded;
  background: ${({enable}) => enable == true ? ('#ff7e19') :('#fff')};
  color :${({enable}) => enable == true ? ('#fff') :('#131313')};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  margin: 8px 5px;
  font-size: ${() => getFontSize(12)}px;


`
const ProgressButtonLayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin: 0 auto;

`
const ProgressButton = styled.div`
background: #fff;
border: 1px solid #eded;
color: #131313;
width: 50px;
border-radius: 5px;
padding: 6px 12px;
z-index: 15;
left: calc(100vh - 80px);
height: 20px;
display: flex;
justify-content: center;
align-items: center;
font-size: ${() => getFontSize(12)}px;

`



const WorkItems=[
  {name : WORKNAME.HOMECLEAN, img:imageDB.house, img2:imageDB.housegray},
  {name :WORKNAME.BUSINESSCLEAN, img:imageDB.business, img2:imageDB.businessgray},
  {name :WORKNAME.MOVECLEAN, img:imageDB.move, img2:imageDB.movegray},
  {name :WORKNAME.FOODPREPARE, img:imageDB.cook, img2:imageDB.cookgray},
  {name :WORKNAME.ERRAND, img:imageDB.help, img2:imageDB.helpgray},
  {name :WORKNAME.GOOUTSCHOOL, img:imageDB.gooutschool, img2:imageDB.gooutschoolgray},
  {name :WORKNAME.BABYCARE, img:imageDB.babycare, img2:imageDB.babycaregray},
  {name :WORKNAME.LESSON, img:imageDB.lesson, img2:imageDB.lessongray},
  {name :WORKNAME.PATIENTCARE, img:imageDB.patientcare, img2:imageDB.patientcaregray},
  {name :WORKNAME.CARRYLOAD, img:imageDB.carry, img2:imageDB.carrygray},
  {name :WORKNAME.GOHOSPITAL, img:imageDB.hospital, img2:imageDB.hospitalgray},
  {name :WORKNAME.RECIPETRANSMIT, img:imageDB.recipe, img2:imageDB.recipegray},
  {name :WORKNAME.GOSCHOOLEVENT, img:imageDB.schoolevent, img2:imageDB.schooleventgray},
  {name :WORKNAME.SHOPPING, img:imageDB.shopping, img2:imageDB.shoppinggray},
  {name :WORKNAME.GODOGHOSPITAL, img:imageDB.doghospital, img2:imageDB.doghospitalgray},
  {name :WORKNAME.GODOGWALK, img:imageDB.dog, img2:imageDB.doggray},
  {name :WORKNAME.ROOM, img:imageDB.dog, img2:imageDB.doggray},
]

const PriceItems=[
  {name : FILTERITEMMONEY.ONE, img:imageDB.house, img2:imageDB.housegray},
  {name :FILTERITEMMONEY.TWO, img:imageDB.business, img2:imageDB.businessgray},
  {name :FILTERITEMMONEY.THREE, img:imageDB.move, img2:imageDB.movegray},
  {name :FILTERITEMMONEY.FOUR, img:imageDB.cook, img2:imageDB.cookgray},
  {name :FILTERITEMMONEY.FIVE, img:imageDB.help, img2:imageDB.helpgray},
  {name :FILTERITEMMONEY.SIX, img:imageDB.gooutschool, img2:imageDB.gooutschoolgray},
]

const EventItems=[
  {name :EVENT_TYPE.NOTICE, img:imageDB.house, img2:imageDB.housegray},
  {name :EVENT_TYPE.NEWS, img:imageDB.business, img2:imageDB.businessgray},
  {name :EVENT_TYPE.EVENT, img:imageDB.move, img2:imageDB.movegray},

]

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const PCAlarmConfig =({containerStyle}) =>  {

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
  const [eventworkitems, setEventworkitems] = useState([]);
  const [eventpriceitems, setEventpriceitems] = useState([]);
  const [eventhongitems, setEventhongitems] = useState([]);
  const [loading, setLoading] = useState(false);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setEventworkitems(eventworkitems);
    setEventpriceitems(eventpriceitems);
    setEventhongitems(eventhongitems);
    setLoading(loading);
  }, [refresh])

  useEffect(()=>{
    async function FetchData(){
      const USERS_ID = user.USERS_ID;
      const eventitem = await ReadEventConfig({USERS_ID});


      if(eventitem != -1){
        setEventworkitems(eventitem.EVENTWORKITEMS);
        setEventpriceitems(eventitem.EVENTPRICEITEMS);
        setEventhongitems(eventitem.EVENTHONGITEMS);


      }else{
      
        await CreateEventConfig({USERS_ID, eventworkitems, eventpriceitems, eventhongitems })
      }
    }
    FetchData();
  }, [])


  const _handleworkevent = async(name)=>{

   setLoading(true);
   const FindIndex =  eventworkitems.findIndex(x=>x == name);

   if(FindIndex != -1){
    eventworkitems.splice(FindIndex, 1);
   }else{
    eventworkitems.push(name);
   }

    const USERS_ID = user.USERS_ID;

   await UpdateEventConfig({USERS_ID, eventworkitems, eventhongitems, eventpriceitems}); 


   setEventworkitems(eventworkitems);
   setLoading(false);
   setRefresh((refresh) => refresh +1);
   
  }

  const workitemsexist = (name) =>{

    
    if(eventworkitems.length == 0){

      return -1;
    }

    const FindIndex =  eventworkitems.findIndex(x=>x == name);
    return FindIndex;
  }






  const _handlepriceevent = async(name)=>{
    setLoading(true);
    const FindIndex =  eventpriceitems.findIndex(x=>x == name);

    if(FindIndex != -1){
      eventpriceitems.splice(FindIndex, 1);
    }else{
      eventpriceitems.push(name);
    }
 
    const USERS_ID = user.USERS_ID;
 
    await UpdateEventConfig({USERS_ID, eventworkitems, eventhongitems, eventpriceitems}); 

    setEventpriceitems(eventpriceitems);
    setLoading(false);
    setRefresh((refresh) => refresh +1);
  }

  const priceitemsexist =(name) =>{

    if(eventpriceitems.length == 0){
      return -1;
    }

    const FindIndex =  eventpriceitems.findIndex(x=>x == name);
    return FindIndex;
  }

  const _handlehongevent = async(name)=>{
    setLoading(true);
    const FindIndex =  eventhongitems.findIndex(x=>x == name);

    if(FindIndex != -1){
      eventhongitems.splice(FindIndex, 1);
    }else{
      eventhongitems.push(name);
    }
 
    const USERS_ID = user.USERS_ID;
 
    await UpdateEventConfig({USERS_ID, eventworkitems, eventhongitems, eventpriceitems}); 

    setEventhongitems(eventhongitems);
    setLoading(false);
    setRefresh((refresh) => refresh +1);
  }

  const hongitemsexist = (name) =>{

    if(eventhongitems.length == 0){
      return -1;
    }

    const FindIndex =  eventhongitems.findIndex(x=>x == name);
    return FindIndex;
  }
 
  return (

    <Container style={containerStyle}>

        {loading == true  && <LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loading}
              width={"50px"} height={'50px'}/>
        }

        <Box height={360} style={{margin:"0px auto"}} >   
           
        <ConfigLabel>등록 알람 설정</ConfigLabel>
        <FlexWrap>
          {
            WorkItems.map((data, index)=>(
              <AddressItem enable={workitemsexist(data.name) != -1} onClick={()=>{_handleworkevent(data.name)}}>{data.name}</AddressItem>
            ))
          }
        </FlexWrap>
      
        </Box>


        <Box height={160} >   
           
        <ConfigLabel>가격 알람 설정</ConfigLabel>
        <FlexWrap>
          {
            PriceItems.map((data, index)=>(
              <AddressItem  enable={priceitemsexist(data.name) != -1}  onClick={()=>{_handlepriceevent(data.name)}} >{data.name}</AddressItem>
            ))
          }
        </FlexWrap>
      
        </Box>

        <Box height={130}>   
           
           <ConfigLabel>이벤트 알람 설정</ConfigLabel>
           <FlexWrap>
             {
               EventItems.map((data, index)=>(
                 <AddressItem enable={hongitemsexist(data.name) != -1} onClick={()=>{_handlehongevent(data.name)}}>{data.name}</AddressItem>
               ))
             }
           </FlexWrap>
         
        </Box>



    </Container>
  );

}

export default PCAlarmConfig;


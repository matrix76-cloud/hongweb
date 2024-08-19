import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import { Row } from "../../common/Row";
import { CreateWork } from "../../service/WorkService";
import { USER_TMP_ID } from "../../utility/db";
import { WORKNAME } from "../../utility/work";
import Button from "../../common/Button";
import randomLocation from 'random-location'
import { ROOMSTATUS, WORKSTATUS } from "../../utility/status";
import { CreateCommunitySummaryBackup, ReadCommunity } from "../../service/CommunityService";
import { extractTextFromHTML } from "../../utility/common";
import { ROOMENABLE, ROOMSIZE, ROOMTYPE } from "../../utility/room";
import { CreateRoom } from "../../service/RoomService";


const Container = styled.div`
    margin-top:30px;
    height:1000px;
`
const style = {
  display: "flex"
};


const workinfoitems = [
  {WORKSTATUS:WORKSTATUS.OPEN,WORKTYPE:WORKNAME.HOMECLEAN,REQUESTCONTENT:"엄마처럼 손이 깔끔한 분 모셔요", WORKKEYWORD:["정기적인청소", "아파트","30평대","청소시간3시간 ", "오후시간대","남성요청"],REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"50000", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.OPEN,WORKTYPE:WORKNAME.MOVECLEAN,REQUESTCONTENT:"집을 너무 청소가 안되서 노련한 아주머니의 손길이 필요합니다",WORKKEYWORD:["하루만 청소","빌라","10평미만", "청소끝날때까지", "오후시간대", "여성요청"],REGION:"남양주시 지금동",DATE:"2024-06-28", PRICE:"0", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.FOODPREPARE,REQUESTCONTENT:"이사후에 짐 정리하고 청소 같이 해주실분을 구합니다",WORKKEYWORD:["이사청소" , "가구" , "베란다 청소"],REGION:"남양주시 지금동",DATE:"2024-07-04", PRICE:"20000", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.HOMECLEAN,REQUESTCONTENT:"맞벌이 부부라서 아이를 잠깐 봐주실수 있는 이모님 구해요",WORKKEYWORD:["아이 1명", "오후시간대"],REGION:"남양주시 다산동",DATE:"2024-07-02", PRICE:"150000", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.BUSINESSCLEAN,REQUESTCONTENT:"거실 소파 청소랑 욕실 청소를 깔끔하게 해주실분을 찾아요",WORKKEYWORD:["하루만 청소", "빌라", "20평대", "청소시간2시간", "오후시간대", "여성요청"],REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"70000", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.BUSINESSCLEAN,REQUESTCONTENT:"맛있는 봄나물 반찬과 찌개 요리 부탁 드려요",  WORKKEYWORD:["반찬3개", "찌개"],REGION:"남양주시 다산동",DATE:"2024-07-11", datedisplay:"D-11", PRICE:"40000", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.GOOUTSCHOOL,REQUESTCONTENT:"아이 학원 시간에 바래다주고 데리고 올 이모님 구합니다", WORKKEYWORD:["동네 학원","2군데", "오후4시~오후6시"],REGION:"남양주시 다산동",DATE:"2024-07-09", PRICE:"30000", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.BABYCARE,REQUESTCONTENT:"엄마처럼 손이 깔끔한 분 모셔요", WORKKEYWORD:["정기적인청소", "아파트","30평대","청소시간3시간 ", "오후시간대","남성요청"],REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"50000", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.ERRAND,REQUESTCONTENT:"집을 너무 청소가 안되서 노련한 아주머니의 손길이 필요합니다",WORKKEYWORD:["하루만 청소","빌라","10평미만", "청소끝날때까지", "오후시간대", "여성요청"],REGION:"남양주시 지금동",DATE:"2024-06-28", PRICE:"0", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.HOMECLEAN,REQUESTCONTENT:"이사후에 짐 정리하고 청소 같이 해주실분을 구합니다",WORKKEYWORD:["이사청소" , "가구" , "베란다 청소"],REGION:"남양주시 지금동",DATE:"2024-07-04", PRICE:"20000", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.CARRYLOAD,REQUESTCONTENT:"맞벌이 부부라서 아이를 잠깐 봐주실수 있는 이모님 구해요",WORKKEYWORD:["아이 1명", "오후시간대"],REGION:"남양주시 다산동",DATE:"2024-07-02", PRICE:"150000", LATITUDE:"", LONGITUDE:""},
  {WORKSTATUS:WORKSTATUS.CLOSE,WORKTYPE:WORKNAME.SHOPPING,REQUESTCONTENT:"거실 소파 청소랑 욕실 청소를 깔끔하게 해주실분을 찾아요",WORKKEYWORD:["하루만 청소", "빌라", "20평대", "청소시간2시간", "오후시간대", "여성요청"],REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"70000", LATITUDE:"", LONGITUDE:""},

]

const roominfoitems = [
  {ROOMSTATUS:ROOMSTATUS.OPEN,ROOMTYPE:ROOMTYPE.APT, ROOMSIZE:[ROOMSIZE.MINI, ROOMSIZE.LARGE],ROOMENABLE:ROOMENABLE.ALWAYS, ROOMIMAGE:imageDB.roomsample1,REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"40000", LATITUDE:"", LONGITUDE:""},
  {ROOMSTATUS:ROOMSTATUS.OPEN,ROOMTYPE:ROOMTYPE.APT, ROOMSIZE:[ROOMSIZE.LARGE],ROOMENABLE:ROOMENABLE.MONTH, ROOMIMAGE:imageDB.roomsample2,REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"70000", LATITUDE:"", LONGITUDE:""},
  {ROOMSTATUS:ROOMSTATUS.OPEN,ROOMTYPE:ROOMTYPE.BILLAR, ROOMSIZE:[ROOMSIZE.LIGHT, ROOMSIZE.LARGE],ROOMENABLE:ROOMENABLE.ALWAYS, ROOMIMAGE:imageDB.roomsample3,REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"90000", LATITUDE:"", LONGITUDE:""},
  {ROOMSTATUS:ROOMSTATUS.OPEN,ROOMTYPE:ROOMTYPE.APT, ROOMSIZE:[ROOMSIZE.LIGHT, ROOMSIZE.LARGE],ROOMENABLE:ROOMENABLE.MONTH, ROOMIMAGE:imageDB.roomsample4,REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"50000", LATITUDE:"", LONGITUDE:""},
  {ROOMSTATUS:ROOMSTATUS.OPEN,ROOMTYPE:ROOMTYPE.BILLAR, ROOMSIZE:[ROOMSIZE.MINI, ROOMSIZE.LARGE],ROOMENABLE:ROOMENABLE.MONTH, ROOMIMAGE:imageDB.roomsample5,REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"40000", LATITUDE:"", LONGITUDE:""},
  {ROOMSTATUS:ROOMSTATUS.OPEN,ROOMTYPE:ROOMTYPE.HOUSE, ROOMSIZE:[ROOMSIZE.LIGHTPLUS, ROOMSIZE.LARGE],ROOMENABLE:ROOMENABLE.WEEKS, ROOMIMAGE:imageDB.roomsample6,REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"30000", LATITUDE:"", LONGITUDE:""},
  {ROOMSTATUS:ROOMSTATUS.OPEN,ROOMTYPE:ROOMTYPE.APT, ROOMSIZE:[ROOMSIZE.LIGHTPLUS, ROOMSIZE.LARGE],ROOMENABLE:ROOMENABLE.WEEKS, ROOMIMAGE:imageDB.roomsample7,REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"70000", LATITUDE:"", LONGITUDE:""},
  {ROOMSTATUS:ROOMSTATUS.OPEN,ROOMTYPE:ROOMTYPE.HOUSE, ROOMSIZE:[ROOMSIZE.LIGHTPLUS, ROOMSIZE.LARGE],ROOMENABLE:ROOMENABLE.ALWAYS, ROOMIMAGE:imageDB.roomsample8,REGION:"남양주시 다산동",DATE:"2024-07-01", PRICE:"30000", LATITUDE:"", LONGITUDE:""},
]

/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const PCHongguidecontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
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


  const _handledataimport = async()=>{

    workinfoitems.map(async(data, index)=>{

      const P = {
        latitude: 37.600707323623,
        longitude: 127.168332976283
      }

      const R = 2000 // meters

      const USER_ID = USER_TMP_ID;


      const randomPoint = randomLocation.randomCirclePoint(P, R)
      
      data["LATITUDE"] = randomPoint.latitude;
      data["LONGITUDE"] = randomPoint.longitude;
  

      const WORK_INFO = data;

      const work = await CreateWork({USER_ID,WORK_INFO});

    })
  }

  const _handleroomdataimport = async()=>{

    roominfoitems.map(async(data, index)=>{

      const P = {
        latitude: 37.600707323623,
        longitude: 127.168332976283
      }

      const R = 2000 // meters

      const USER_ID = USER_TMP_ID;


      const randomPoint = randomLocation.randomCirclePoint(P, R)
      
      data["LATITUDE"] = randomPoint.latitude;
      data["LONGITUDE"] = randomPoint.longitude;
      console.log("TCL: _handleroomdataimport -> data[", data)
  

      const ROOM_INFO = data;

      const work = await CreateRoom({USER_ID,ROOM_INFO});

    })
  }


  return (
    <Container style={containerStyle}>
      <Row>
        <div style={{display:"flex", width:'100%', height:1000, backgroundColor:'#fff'}}>

        <Button onPress={_handledataimport} height={'40px'} width={'300px'} radius={'5px'} bgcolor={'#ededed'} color={'#222'} text={'홈 데이타 import'}/>


        <Button onPress={_handleroomdataimport} height={'40px'} width={'300px'} radius={'5px'} bgcolor={'#ededed'} color={'#222'} text={'창고 데이타 import'}/>


        </div>
      </Row>
    </Container>
  );

}

export default PCHongguidecontainer;


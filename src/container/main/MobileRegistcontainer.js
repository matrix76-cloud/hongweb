import React, { Fragment, useContext, useEffect, useLayoutEffect, useState } from "react";
import {Navigate, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";

import { DataContext } from "../../context/Data";

import { Column, FlexstartColumn } from "../../common/Column";
import Button from "../../common/Button";
import { Row } from "../../common/Row";
import Fade from "react-reveal/Fade";
import { HOMECLEAN_REQUESTINFO, Requestbabycaremessages, Requestbusinesscleanmessages, Requestcarryloadmessages, Requestcleanmessages, Requestdoghospitalmessages, Requestdogwalkmessages, Requesterrandmessages, Requestfoodpreparemessages, Requestgohospitalmessages, Requestgooutschoolmessages, REQUESTINFO, Requestlessonmessages, Requestmovecleanmessages, Requestpatientcaremessages, Requestrecipetranmitmessages, Requestschooleventmessages, Requestshoppingmessages, WORKNAME, WORKPOLICY } from "../../utility/work";
import { useSleep } from "../../utility/common";
import { Seekimage } from "../../utility/imageData";
import Text from "../../common/Text";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { ko, se } from 'date-fns/locale';
import { DAYOPTION, OPTIONTYPE, PCDAYMENU } from "../../utility/screen";
import SelectItem from "../../components/SelectItem";
import { MdDataUsage, MdTurnedInNot } from "react-icons/md";
import "./table.css";
import { Requestlargemessages, Requestmediummessages, Requestsmallmessages, ROOMSIZE } from "../../utility/room";

import { CreateWork } from "../../service/WorkService";
import { CreateRoom } from "../../service/RoomService";
import ImageUploadComponent from "../../components/ImageUpload";



const Container = styled.div`

    margin: 0px auto;
    background: #f9f9f9;
   
    justify-content: flex-start;
    display : flex;
    align-items:flex-start;
    flex-direction:column;
    height: 3500px;
`
const ResponseContainer = styled.div`
  display: flex;
  flex-direction: row;
  width:100%;
  justify-content: flex-end;
`;

const TitleLayer = styled.div`
  height:150px;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: sticky;
  background: #fffefe;
  width: 100%;
  z-index: 5;
  top: 30px;
  border-top: 1px solid;
  border-right: 1px solid;
`
const Title = styled.div`
  font-size: 25px;
  line-height: 60px;
  font-weight :700;
  margin-left:10px;

`

const Itemlayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top:10px;
  width:${({width}) => width};
`

const ItemLeftLayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 5px;
  margin-bottom:5px;
`;

const ItemLeftLayercontent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;


const ItemLeftBox = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin: 5px 10px 0px;
  color: black;
  display: flex;
  flex-direction: column;
  width: ${({width}) => width};
  font-size: 16px;
  text-align: left;
  min-width:220px;

`;


const SelectLayer = styled.div`
  border: 1px solid #ededed;
  width: 95px;
  margin: 10px 3px;
  background: ${({check}) => check == true ? ('#3a3737'):('#fff')};
  color: ${({check}) => check == true ? ('#fff'):('#000')};
  border-radius: 10px;
  font-size:14px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding: 0px 3px;
`;

const ItemRightLayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 5px;
  margin-bottom: 5px;
`;
const ItemRightBox = styled.div`
  background: #FF7125;
  border-radius: 10px;
  padding: 10px 16px;
  margin: 10px 10px 0px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: 16px;
  text-align: left;
`;

export const StyledCalendarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`



// 캘린더를 불러옴
export const StyledCalendar = styled(Calendar)`

width: 100%;
max-width: 300px;
background: white;
border: 1px solid #a0a096;
line-height: 1.125em;
font-size: 18px; /* 글자 크기 */
text-decoration: none; /* 밑줄 제거 */

.react-calendar__navigation button {
  color: #4d4d4d;
  min-width: 44px;
  background: none;
  font-size: 20px; /* 네비게이션 버튼 글자 크기 */
  margin-top: 8px;
}



.react-calendar__month-view__weekdays__weekday {
  font-size: 18px; /* 요일 이름 글자 크기 */
  color: #6b6b6b;
  font-weight:500;
  text-decoration: none; /* 밑줄 제거 */
}

.react-calendar__tile {
  padding: 10px;
  background: none;
  font-size: 16px; /* 날짜 타일 글자 크기 */
  color: #4d4d4d;
}

.react-calendar__tile--now {
  font-size: 20px;
  font-weight:800;
  color : #0000ff;
 }
 .react-calendar__tile:disabled {
  color: #d6cfcf !important;
 }

.react-calendar__tile--active {
  background: #76baff;
  color: white;
  border-radius : 100%;
}

.react-calendar__tile--hover {
  background: #76baff;
}
`;


const ResultContent = {
  width: '350px',
  height: '100px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  marginTop:'15px',
 
}
const ResultContent2 = {
  width: '180px',
  height: '100px',
  fontSize: '16px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
 
}



const { kakao } = window;

const mapstyle = {
  width:'350px',
  height:'400px'
};


const MobileRegistcontainer =({containerStyle, type, totalset}) =>  {
console.log("TCL: MobileRegistcontainer -> type", type)


    

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [roomimg, setRoomimg] = useState('');
  const [comment, setComment] = useState('');

  console.log("Regist type", type);

  let msgs = [];
  if(type == WORKNAME.HOMECLEAN){
    msgs = Requestcleanmessages;
  }else if(type ==WORKNAME.BUSINESSCLEAN){
    msgs = Requestbusinesscleanmessages;
  }else if(type ==WORKNAME.MOVECLEAN){
    msgs = Requestmovecleanmessages;
  }else if(type ==WORKNAME.FOODPREPARE){
    msgs = Requestfoodpreparemessages;
  }else if(type ==WORKNAME.ERRAND){
    msgs = Requesterrandmessages;
  }else if(type ==WORKNAME.GOOUTSCHOOL){
    msgs = Requestgooutschoolmessages;
  }else if(type ==WORKNAME.BABYCARE){
    msgs = Requestbabycaremessages;
  }else if(type == WORKNAME.LESSON){ 
    msgs = Requestlessonmessages;
  }else if(type == WORKNAME.PATIENTCARE){ 
    msgs = Requestpatientcaremessages;
  }else if(type == WORKNAME.GOHOSPITAL){ 
    msgs = Requestgohospitalmessages;
  }else if(type == WORKNAME.RECIPETRANSMIT){ 
    msgs = Requestrecipetranmitmessages;
  }else if(type == WORKNAME.GOSCHOOLEVENT){ 
    msgs = Requestschooleventmessages;
  }else if(type == WORKNAME.SHOPPING){ 
    msgs = Requestshoppingmessages;
  }else if(type == WORKNAME.GODOGHOSPITAL){ 
    msgs = Requestdoghospitalmessages;
  }else if(type == WORKNAME.GODOGWALK){ 
    msgs = Requestdogwalkmessages;
  }else if(type == ROOMSIZE.SMALL){ 
    msgs = Requestsmallmessages;
  }else if(type == ROOMSIZE.MEDIUM){ 
    msgs = Requestmediummessages;
  }else if(type == ROOMSIZE.LARGE){ 
    msgs = Requestlargemessages;
  }



  const [messages, setMessages] = useState(msgs);

  const [stepdata, setStepdata] = useState(0);
  const [stepstr, setStepstr] = useState('');
  const [selectdate, setSelectdate] = useState('');

  const [allweeks, setAllweeks] = useState(false);
  const [dayitems, setDayitems] = useState([]);


  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');


    /*
  초기값을 제거
  */
  const _handleReset = () =>{
    let msgs = [];
    async function Fetchdata(){
      if(type == WORKNAME.HOMECLEAN){ 
        msgs = Requestcleanmessages;
      }else  if(type == WORKNAME.BUSINESSCLEAN){ 
        msgs = Requestbusinesscleanmessages;
      }else if(type == WORKNAME.MOVECLEAN){ 
        msgs = Requestmovecleanmessages;
      }else if(type == WORKNAME.FOODPREPARE){ 
        msgs = Requestfoodpreparemessages;
      }else if(type == WORKNAME.ERRAND){ 
        msgs = Requesterrandmessages;
      }else if(type == WORKNAME.GOOUTSCHOOL){ 
        msgs = Requestgooutschoolmessages;
      }else if(type == WORKNAME.BABYCARE){ 
        msgs = Requestbabycaremessages;
      }else if(type == WORKNAME.LESSON){ 
        msgs = Requestlessonmessages;
      }else if(type == WORKNAME.PATIENTCARE){ 
        msgs = Requestpatientcaremessages;
      }else if(type == WORKNAME.GOHOSPITAL){ 
        msgs = Requestgohospitalmessages;
      }else if(type == WORKNAME.RECIPETRANSMIT){ 
        msgs = Requestrecipetranmitmessages;
      }else if(type == WORKNAME.GOSCHOOLEVENT){ 
        msgs = Requestschooleventmessages;
      }else if(type == WORKNAME.CARRYLOAD){ 
          msgs = Requestcarryloadmessages;
      }else if(type == WORKNAME.SHOPPING){ 
        msgs = Requestshoppingmessages;
      }else if(type == WORKNAME.GODOGHOSPITAL){ 
        msgs = Requestdoghospitalmessages;
      }else if(type == WORKNAME.GODOGWALK){ 
        msgs = Requestdogwalkmessages;
      }else if(type == ROOMSIZE.SMALL){ 
        msgs = Requestsmallmessages;
      }else if(type == ROOMSIZE.MEDIUM){ 
        msgs = Requestmediummessages;
      }else if(type == ROOMSIZE.LARGE){ 
        msgs = Requestlargemessages;
      }

      msgs.map((data, index)=>{
        if(data.type == 'request' 
        || data.type =='requestroom' 
        || data.type =='requestdate' 
        || data.type =='requestregion' 
        || data.type =='requestcomplete'){
          data.show = false;
          data.selected = false;

          if(data.selectitems != undefined){
            data.selectitems.map((select=>{
              select.selected = false;
            }))
          }
     
        }else if(data.type =='response'){
          data.result ="";
          data.show =false;
        }
      })
      setMessages(msgs); 

      let str = totalset + "단계만 설정 하시면 등록이 완료됩니다";
      setStepstr(str);
   
      await useSleep(1500);
      msgs[1].show = true;
      setRefresh((refresh) => refresh +1);

      window.scrollTo(0, 0);
    }
    Fetchdata();

  }


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setMessages(messages);
    setStepdata(stepdata);
    setAllweeks(allweeks);
    setDayitems(dayitems);
    setStepstr(stepstr);
    setSelectdate(selectdate);
    setMarkers(markers);
    setMap(map);
    setAddress(address);
    setLatitude(latitude);
    setLongitude(longitude);
    setRoomimg(roomimg);
  },[refresh])



  /**
   * 공간 대여일 경우는 첫번째 인덱스와 두번째 인덱스는 안보여주고 바로 기간 설정 할수 있도록한다
   */
  useEffect(()=>{

    _handleReset();

    async function FetchData(){
     
      let str = totalset + "단계만 설정 하시면 등록이 완료됩니다";
      setStepstr(str);

      await useSleep(1500);

      if(type == ROOMSIZE.SMALL || type == ROOMSIZE.MEDIUM || type == ROOMSIZE.LARGE){
        messages[1].show = false
        messages[2].show = false;
        messages[2].result='1회만'
        messages[3].show = true;
      }else{
        messages[1].show = true;
      }


      setRefresh((refresh) => refresh +1);

    } 
    FetchData();
  }, [])





 /**
  * 선택지에서 선택 한 아이템에 selected 를 true로 해준다
  */
  const _handlecheck = (index, key) =>{
    messages[index].selectitems.map((data)=>{
      data.selected = false;
    })
    const FindIndex = messages[index].selectitems.findIndex(x=>x.key == key);
    messages[index].selectitems[FindIndex].selected= true;
    setRefresh((refresh) => refresh +1);
  }

  /**
   * 재설정하기 위해 필요한 함수
   */
  const _handleAdjust =(index) =>{
    messages[index-1].selected = false;
    setRefresh((refresh) => refresh +1);
  }   



  /**
  * 선택하게 되면
  * ! ① 해당 인덱스를 선택하게 되었다고 표시 해주고
  * ! ② 다음 첫번째 인덱스에 결과값을 넣어주고 보여줌을 표시 하자
  * ! ③ 다음 두번째 인덱스를 보여주도록 한다
  * ! 선택이 전부 되었으면 부드럽게 이동할수 있도록 한다
  * ! messages[index +2].type == 'requestregion' 일때 지도를 그려준다
  */

  const _handleNext = (index) =>{

    const FindIndex = messages[index].selectitems.findIndex(x=>x.selected == true);
    if(FindIndex == -1){
      return;
    }

    let data = seekstepcheck(index);


    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

    messages[index].selected = true;
    messages[index+1].show = true;
    messages[index+1].result = messages[index].selectitems[FindIndex].response; //!TODO
    messages[index+2].show =true;

  

    if(messages[index +2].type == 'requestregion'){
      
      new Promise(resolve => setTimeout(resolve, 2000)).then(()=>{

        console.log("TCL: _handleNext -> ",messages[index +2], user );

        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = { 
              center: new kakao.maps.LatLng(user.latitude, user.longitude), // 지도의 중심좌표
              level: 4, // 지도의 확대 레벨
              zoomable: false, // 확대/축소 비활성화
        };
    
        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 지도를 클릭한 위치에 표출할 마커입니다
        var marker = new kakao.maps.Marker({ 
          // 지도 중심좌표에 마커를 생성합니다 
          position: map.getCenter()
        }); 
        // 지도에 마커를 표시합니다
        marker.setMap(map);

        const geocoder = new kakao.maps.services.Geocoder();
        // 좌표로 주소를 검색
        geocoder.coord2Address(user.longitude, user.latitude, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const address = result[0].address.address_name;
            setLatitude(user.latitude);
            setLongitude(user.longitude)
            setAddress(address);
          } else {
            console.error('주소를 찾을 수 없습니다.');
          }
        });
      

  
        kakao.maps.event.addListener(map, 'click', (mouseEvent) => {

          const latlng = mouseEvent.latLng; // 클릭한 위치의 위도와 경도 정보

          // Geocoder 객체 생성
          const geocoder = new kakao.maps.services.Geocoder();


          // 좌표로 주소를 검색
          geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address.address_name;
              setLatitude(latlng.getLat());
              setLongitude(latlng.getLng())
              setAddress(address);
            } else {
              console.error('주소를 찾을 수 없습니다.');
            }
          });

          marker.setPosition(latlng);
          setRefresh((refresh) => refresh +1);
    
        });
      });
    }

    window.scrollTo({
      top: window.scrollY + 200, // 스크롤할 Y 위치
      behavior: 'smooth', // 부드럽게 스크롤
    });

    setRefresh((refresh) => refresh +1);
  }

  const _handleCommentNext = (index)=>{
    let data = seekstepcheck(index);


    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

    messages[index].selected = true;
    messages[index+1].show = true;
    messages[index+1].result = comment;
    messages[index+2].show =true;
    setRefresh((refresh) => refresh +1);
  }

  /**
   * 공간 사진 등록 햇을때
   * 지도를 미리 그려줘야 한다
   * ! 공간 대여 일 경우는 사진 데이타 결과값을 이미 넣어주고 선택 된것으로 해준다
   * * ! messages[index +2].type == 'requestregion' 일때 지도를 그려준다
   */
  const _handleRoomNext = (index) =>{


    let data = seekstepcheck(index);


    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

    messages[index].selected = true;
    messages[index+1].show = false;
    messages[index+1].result = roomimg; //!TODO
    messages[index+2].show =true;


    if(messages[index +2].type == 'requestregion'){
      
      new Promise(resolve => setTimeout(resolve, 2000)).then(()=>{

        console.log("TCL: _handleNext -> ",messages[index +2], user );

        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = { 
              center: new kakao.maps.LatLng(user.latitude, user.longitude), // 지도의 중심좌표
              level: 4, // 지도의 확대 레벨
              zoomable: false, // 확대/축소 비활성화
        };
    
        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 지도를 클릭한 위치에 표출할 마커입니다
        var marker = new kakao.maps.Marker({ 
          // 지도 중심좌표에 마커를 생성합니다 
          position: map.getCenter() 
        }); 
        // 지도에 마커를 표시합니다
        marker.setMap(map);

        const geocoder = new kakao.maps.services.Geocoder();
        // 좌표로 주소를 검색
        geocoder.coord2Address(user.longitude, user.latitude, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const address = result[0].address.address_name;
            setLatitude(user.latitude);
            setLongitude(user.longitude)
            setAddress(address);
          } else {
            console.error('주소를 찾을 수 없습니다.');
          }
        });

  
        kakao.maps.event.addListener(map, 'click', (mouseEvent) => {

          const latlng = mouseEvent.latLng; // 클릭한 위치의 위도와 경도 정보

          // Geocoder 객체 생성
          const geocoder = new kakao.maps.services.Geocoder();


          // 좌표로 주소를 검색
          geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address.address_name;
              setLatitude(latlng.getLat());
              setLongitude(latlng.getLng())
              setAddress(address);
            } else {
              console.error('주소를 찾을 수 없습니다.');
            }
          });

          marker.setPosition(latlng);
          setRefresh((refresh) => refresh +1);
    
        });
      });
    }


    window.scrollTo({
      top: window.scrollY + 200, // 스크롤할 Y 위치
      behavior: 'smooth', // 부드럽게 스크롤
    });

    setRefresh((refresh) => refresh +1);
  }

  /**
   * 날짜 선택
   */
  const _handleDateNext = (index) =>{


    let data = seekstepcheck(index);

    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

  
    messages[index].selected = true;
    messages[index+1].show = true;

    // 기간값을 넣어주자
    // ①②③④
    // ① 일정 시점을 선택 했다고 하면 date 가 있는거다
    if(selectdate != ''){
      messages[index+1].result = selectdate;
    }else{
        // ② 매일을 선택 했다고 하면 
        if(allweeks  == false){
          messages[index+1].result = '매일';
        }else{
          // ③ 매일을 선택 했다고 하면 
          let str = "매주";
          dayitems.map((day, index)=>{
            str += day;
            str += '요일';
            str += ' ';
          })

          messages[index+1].result = str;
        }
    }

    messages[index+2].show =true;

    setRefresh((refresh) => refresh +1);
  }


  /**
   * 지역 선택
   */
  const _handleRegionNext = (index) =>{

    let data = seekstepcheck(index);

    let str = totalset +"단계중 "+data+"단계를 설정하였습니다";
    setStepdata(data);
    setStepstr(str);

  
    messages[index].selected = true;
    messages[index+1].show = true;
    messages[index+1].result = address;
    messages[index+1].latitude = latitude;
    messages[index+1].longitude = longitude;
    console.log("TCL: _handleRegionNext -> address", address,messages)
    messages[index+2].show = true;

    setRefresh((refresh) => refresh +1);
  }


  const _handleReqComplete = async() =>{

    let workinfo = [];
    messages.map((data)=>{
      if(data.type == 'response')
      {
        workinfo.push(data);
      }

    });

    if(type =="Small" || type =="Medium" || type == "Large"){

      const USER_ID="01062149756";
      const ROOM_INFO = workinfo;
      const ROOMTYPE = type;

      const work = await CreateRoom({USER_ID, ROOMTYPE, ROOM_INFO});
      alert("성공적으로 등록 되었습니다");
  
      navigate("/PCroom");


    }else{

      const USER_ID="01062149756";
      const WORK_INFO = workinfo;
      const WORKTYPE = type;
  
  
      const work = await CreateWork({USER_ID,WORKTYPE, WORK_INFO});
      alert("성공적으로 등록 되었습니다");
  
      navigate("/PCmain");
    }




  }
  /**
   * DatePicker에서 쓰는 함스
   */
  const handleDateChange = (newDate) => {

    console.log("new date", newDate);
    setSelectdate(newDate.toLocaleDateString());
    setRefresh((refresh) => refresh +1);
  };

  /**
   * 콤보박스에서 선택한 결과값이 오는데 기간 설정
   */
  const selectcallback =(data)=>{

    if(data == PCDAYMENU.ALLWEEKS)
    {
      setAllweeks(true);
    }else{
      setAllweeks(false);
    }
    setRefresh((refresh) => refresh + 1);
  }
  /**
   * 기간 계산시 사용 중복여부를 체크하고 중복이 안되어 잇으면 배열에 넣는다
   * 예제 ) 매주 월요일 화요일 수요일
   */
  const _handleWeekDate = (Date) =>{
    const FindIndex = dayitems.findIndex(x=>x == Date);
    if(FindIndex != -1){
      dayitems.splice(FindIndex, 1);
    }else{
      dayitems.push(Date);
    }
    setDayitems(dayitems);
    setRefresh((refresh) => refresh + 1);
  }

  /**
   * 기간 계산시 사용
   */
  function FindDay(Date){
    const FindIndex = dayitems.findIndex(x=>x == Date);
    console.log("TCL: _handleWeekDate -> dayitems", dayitems, Date)

    if(FindIndex != -1){
      return true;
    }else{
      return false;
    }
  }

  /**
   * 단계여부를 체크하는 함수
   * response에서 responseshow는 고객 지도와 공간사진을 보여주지 않도록 하기 위해 미리 설정 해두는 장치
   */

  function seekstepcheck(index){
    let stepdata = 0;

    if(index <= 2){
      stepdata = 1;
    }else if(index == 3){
      stepdata = 2;
    }else if(index == 5){
      stepdata = 3;
    }else if(index == 7){
      stepdata = 4;
    }else if(index == 9){
      stepdata = 5;
    }else if(index == 11){
      stepdata = 6;
    }else if(index == 13){
      stepdata = 7;
    }else if(index == 15){
      stepdata = 8;
    }else if(index == 17){
      stepdata = 9;
    }else if(index == 19){
      stepdata = 10;
    }else if(index == 21){
      stepdata = 11;
    }
    return stepdata;
  }

  /**
   * 
   */
  const imageuploadcallback =(img)=>{
    
    console.log("TCL: imageuploadcallback -> ", img);

    setRoomimg(img);
    setRefresh((refresh) => refresh +1);
  }

  return (
    <>
      <Container style={containerStyle}>
          <TitleLayer>
            <Row>
              <img src={Seekimage(type)} style={{width:64}}/>
              <Title>{type}</Title>
            </Row>

 
            <Row style={{alignItems:"unset"}}>
              <progress class="progress" id="progress" value={stepdata *10} min="0" max="100" style={{width:300}}></progress>
              <div style={{paddingLeft:10}}>
                <div style={{display:"flex"}}>
                  <Text containerStyle={{fontFamily:"Pretendard-Bold"}} value={ parseInt(stepdata / totalset *100) + '%'} size={18} color={'#FF4E19'} ></Text>
                </div>
              </div>   
        
            </Row>
            <div style={{display:"flex"}}>
              <div><Text value={stepstr} size={18} color={'#FF4E19'} ></Text></div>
              </div>
          </TitleLayer>
    
          {
            messages.map((data, index) => (
            <Fragment>
            {("initialize" == data.type && data.show == true) && (
                <Itemlayer width={'100%'} style={{marginTop:40}}>      
                  <ItemLeftBox width={'100%'}>
                    <span>{data.info}</span>
                  </ItemLeftBox>       
                </Itemlayer>
            )}
            {/* 고객요구사항 선택 */}
            {("request" == data.type && data.show == true) && (
                <Fade bottom className="fade-in-bottom" delay={800}>
                  <Itemlayer width={'80%'}>
                    <ItemLeftBox width={'70%'}>
                      <span>{data.info}</span>
                      {
                      data.selected == false ?
                      (
                        <>
                          <Row top={5} style={{flexWrap:'wrap', margin: '10px 0px'}}>
                          { data.selectitems.map((subdata)=>(
                            <SelectLayer className="button" check={subdata.selected} onClick={()=>{_handlecheck(index, subdata.key)}}>
                              <div>{subdata.request}</div>
                            </SelectLayer>
                          ))}
                          </Row>
                          <Button containerStyle={{border: 'none', fontSize:16}} onPress={()=>{_handleNext(index)}} height={'45px'} width={'95%'} radius={'5px'} bgcolor={'#f0f0f0'} color={'#222'} text={'다음'}/>
                        </>
                      ):(<span>{data.request}</span>)
                      }
                    </ItemLeftBox>  
                  </Itemlayer>
                </Fade>
            )}

            {/* 날짜 선택 */} 
            {("requestdate" == data.type && data.show == true) && (
              <Fade bottom delay={800}>
                <Itemlayer width={'100%'}>
                    <ItemLeftBox width={'80%'}>
                      <span>{data.info}</span>
                      {
                        data.selected == false ?(<div style={{marginTop:15}}>

                        {
                          messages[2].result =='1회만' ? (  
                          <Fragment>
                            <StyledCalendarWrapper>
                                <StyledCalendar
                                  value={selectdate}
                                  onChange={handleDateChange}
                                  formatDay={(locale, date) => moment(date).format("D")} // 일 제거 숫자만 보이게
                                  formatYear={(locale, date) => moment(date).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
                                  formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
                                  calendarType="gregory" // 일요일 부터 시작
                                  showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
                                  next2Label={null} // +1년 & +10년 이동 버튼 숨기기
                                  prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
                                  minDetail="year" // 10년단위 년도 숨기기
                                  minDate={new Date()} // 오늘 날짜 이전은 선택 불가
                                  locale={ko} // 한국어 로케일 설정
                                  dateFormat="yyyy년 MM월 dd일" // 한국어 형식으로 날짜 표시
                                />
                            </StyledCalendarWrapper>
                            <Button containerStyle={{border: 'none', fontSize:16, marginTop:10}} onPress={()=>{_handleDateNext(index)}} height={'45px'} width={'95%'} radius={'5px'} bgcolor={'#f0f0f0'} color={'#222'} text={'다음'}/>
                          </Fragment>     
                          ):(<Fragment>

                            <SelectItem
                              option={OPTIONTYPE.DAYOPTION}
                              callback={selectcallback}
                            />
                            {
                              allweeks == true && <Row style={{flexWrap:"no-wrap"}}>
                                <Button enable ={FindDay('일')} containerStyle={{ fontSize:16, marginTop:10,marginRight:5}} onPress={()=>{_handleWeekDate('일')}} height={'35px'} width={'30px'} radius={'5px'} bgcolor={'#fff'} color={'#222'} text={'일'}/>
                                <Button enable ={FindDay('월')}  containerStyle={{fontSize:16, marginTop:10,marginRight:5}} onPress={()=>{_handleWeekDate('월')}} height={'35px'} width={'30px'} radius={'5px'} bgcolor={'#fff'} color={'#222'} text={'월'}/>
                                <Button enable ={FindDay('화')} containerStyle={{ fontSize:16, marginTop:10,marginRight:5}} onPress={()=>{_handleWeekDate('화')}} height={'35px'} width={'30px'} radius={'5px'} bgcolor={'#fff'} color={'#222'} text={'화'}/>
                                <Button enable ={FindDay('수')}  containerStyle={{fontSize:16, marginTop:10,marginRight:5}} onPress={()=>{_handleWeekDate('수')}} height={'35px'} width={'30px'} radius={'5px'} bgcolor={'#fff'} color={'#222'} text={'수'}/>
                                <Button enable ={FindDay('목')}  containerStyle={{fontSize:16, marginTop:10,marginRight:5}} onPress={()=>{_handleWeekDate('목')}} height={'35px'} width={'30px'} radius={'5px'} bgcolor={'#fff'} color={'#222'} text={'목'}/>
                                <Button enable ={FindDay('금')}  containerStyle={{fontSize:16, marginTop:10,marginRight:5}} onPress={()=>{_handleWeekDate('금')}} height={'35px'} width={'30px'} radius={'5px'} bgcolor={'#fff'} color={'#222'} text={'금'}/>
                                <Button enable ={FindDay('토')}  containerStyle={{fontSize:16, marginTop:10,marginRight:5}} onPress={()=>{_handleWeekDate('토')}} height={'35px'} width={'30px'} radius={'5px'} bgcolor={'#fff'} color={'#222'} text={'토'}/>


                              </Row>
                            }

                            <Button containerStyle={{border: 'none', fontSize:16, marginTop:10}} onPress={()=>{_handleDateNext(index)}} height={'45px'} width={'95%'} radius={'5px'} bgcolor={'#f0f0f0'} color={'#222'} text={'다음'}/>
                          

                            </Fragment>)
                        }
                        
                       </div>):(<span>{data.content}</span>)
                      }
                    </ItemLeftBox>       
                  </Itemlayer>

              </Fade>      
            )}

            {/* 지역 선택 */} 
            {("requestregion" == data.type && data.show == true) && (
            <Fade bottom delay={800}>
                    <Itemlayer width={'100%'}>
                    <ItemLeftBox style={{width:"350px", height:"500px"}}>
                      <span>{data.info}</span>
                      <div style={{marginTop:35, height:300, position:"absolute",  top: '30px'}}>
                        <div id="map"  style={mapstyle}></div>
                        <Row>
                          <Button containerStyle={{border: 'none', fontSize:16, marginTop:10}} onPress={()=>{_handleRegionNext(index)}} height={'45px'} width={'95%'} radius={'5px'} bgcolor={'#f0f0f0'} color={'#222'} text={'다음'}/>
                        </Row>
                      </div>
                    </ItemLeftBox>  
                  </Itemlayer>  
            </Fade>
            )}

            {/* 홍여사에게 요청할 내용 */} 
            {("requestcomment" == data.type && data.show == true) && (
            <Fade bottom delay={800}>
                    <Itemlayer width={'100%'}>
                    <ItemLeftBox style={{width:"350px", height:"200px"}}>
                      <span>{data.info}</span>
                      <div style={{marginTop:35, height:200, position:"absolute",  top: '30px'}}>
                        <textarea maxlength={25} style={ResultContent} value={comment}  onChange={(e) => {
                          setComment(e.target.value);
                        }}
                        />
                        <Row>
                          <Button containerStyle={{border: 'none', fontSize:16, marginTop:10}} onPress={()=>{_handleCommentNext(index)}} height={'45px'} width={'95%'} radius={'5px'} bgcolor={'#f0f0f0'} color={'#222'} text={'다음'}/>
                        </Row>
                      </div>
                    </ItemLeftBox>  
                  </Itemlayer>  
            </Fade>
            )}

             {/* 공간 선택 */} 
            {("requestroom" == data.type && data.show == true) && (
            <Fade bottom delay={800}>
                    <Itemlayer width={'100%'}>
                    <ItemLeftBox style={{width:"350px", height:"500px"}}>
                  
                      <span>{data.info}</span>
                      <Column>
                        <ImageUploadComponent callback={imageuploadcallback}/>
                        <Button containerStyle={{border: 'none', fontSize:16, marginTop:10, width:"100%"}} onPress={()=>{_handleRoomNext(index)}} height={'45px'} width={'95%'} radius={'5px'} bgcolor={'#f0f0f0'} color={'#222'} text={'다음'}/>
                      </Column>
                    </ItemLeftBox>  
                  </Itemlayer>  
            </Fade>
            )}

            {/* 요구사항 문서 확인 */} 
            {("requestcomplete" == data.type && data.show == true) && (
                <Fade bottom delay={200}>
                  <Itemlayer width={'410px'}>
                  <ItemLeftBox width={'100%'}>
                    <span style={{fontSize:16}}>{data.info}</span>
                    <table style={{marginTop:20,borderLeft:"1px solid"}}>
             
                      <tbody>
                        {
                          messages.map((data)=>(
                            <>
                            {
                            data.type =='response' &&
                            <tr>
                            <td>{data.requesttype}</td>
                            <td>
                            {
                              data.requesttype == REQUESTINFO.ROOM ? (
                                <img src= {data.result} style={{width:"200px", height:"200px"}}/>
                              ) :(<div>
                                {
                                  data.requesttype == REQUESTINFO.COMMENT ? (
                                    <textarea style={ResultContent2} value={data.result}/>):(
                                    <div> {data.result}</div>
                                  )
                                }
                               </div>)
                            }  
                            </td>
                            </tr>
                            }
                            </>                  
                          ))
                        }
                      </tbody>
                    </table>
                    <div style={{display:"flex", flexDirection:"row", margin:'10px auto', width:'90%',justifyContent: "space-around" }}>
                      <Button text={"다시작성하기"} onPress={_handleReset}
                      containerStyle={{backgroundColor: "#8b8988", color :"#fff", border :"1px solid #ededed",borderRadius: "10px",
                      fontSize: 16,height:45,margin: "10px 0px",width: "130px",}}/>
                      <Button text={"요청하기"} onPress={()=>{_handleReqComplete(index)}}
                      containerStyle={{backgroundColor: "#FF4E19",color :"#fff",border :"1px solid #ededed",borderRadius: "10px",
                      fontSize: 16,height:45,margin: "10px 0px",width: "130px",}}/>   
                    </div>
                  </ItemLeftBox>  
                  </Itemlayer>
                </Fade>
            )}

            {/* 고객요구에 대한 확인*/}
            {("response" == data.type && data.show == true && data.responseshow == true ) &&(
                <ResponseContainer>
                  <Fade bottom delay={100}>
                    <ItemRightLayer>         
                        <ItemRightBox><span>{data.result}</span></ItemRightBox>
                        <Button containerStyle={{fontSize:16, marginTop:10, marginRight:10, border:"none", padding:"10px 16px"}} onPress={()=>{_handleAdjust(index)}}  width={'50px'} radius={'5px'} bgcolor={'#f0f0f0'} color={'#222'} text={'수정'}/>
                   </ItemRightLayer>
                  </Fade>
                </ResponseContainer>
            )}
            </Fragment>
          ))}
      </Container>


    </>


  );

}

export default MobileRegistcontainer;


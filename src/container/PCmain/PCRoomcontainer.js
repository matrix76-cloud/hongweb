import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";
import PCWorkItem from "../../components/PCWorkItem";
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { EventItems, EVENTTYPE, FILTERITMETYPE, LoadingType, PCCOMMNUNITYMENU, PCMAINMENU } from "../../utility/screen";
import Communitymenu from "../../common/Communitymenu";
import CommunityItem from "../../components/CommunityItem";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import QRCode from 'qrcode.react';
import Loading from "../../components/Loading";
import { ReadWork } from "../../service/WorkService";
import PCRoomItem from "../../components/PCRoomItem";
import { ReadRoom } from "../../service/RoomService";
import StoreInfo from "../../components/StoreInfo";
import Position from "../../components/Position";
import { ROOMSIZE } from "../../utility/room";
import { useSelector } from "react-redux";

const Container = styled.div`
  padding:20px 24px 0px 24px;
  min-height: 1500px;

`
const style = {
  display: "flex"
};

const EventTitle = styled.div`
  font-size: 25px;
  line-height: 80px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  width : 85%;
  font-weight:500;

`
const EventBox = styled.div`

  margin-top:30px;
  width: calc(50% - 20px);
  margin-bottom: 30px;
  cursor: pointer;
  transition: .2s all;
  margin-left:15px;
  
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


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const PCRoomcontainer =({containerStyle}) =>  {

  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [roomitems, setRoomitems] = useState([]);
  const [currentloading, setCurrentloading] = useState(false);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{

  },[refresh])



  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */
  useLayoutEffect(()=>{

    async function FetchLocation(){

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          // Geocoder를 사용하여 좌표를 주소로 변환
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address;

              
              console.log("TCL: FetchLocation -> ", address);
            
              user.address_name = address.address_name;
              user.region_1depth_name = address.region_1depth_name;
              user.region_2depth_name = address.region_2depth_name;
              user.region_3depth_name = address.region_3depth_name;
              user.main_address_no = address.main_address_no;

              geocoder.addressSearch(address.address_name, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                    user.latitude = result[0].y;
                    user.longitude = result[0].x;
                    dispatch(user);

                }
              });

              dispatch(user);
              console.log("TCL: FetchLocation -> ", user );


         
            }else{
              alert("허용 해야 합니다")
            }
          });
   
        },
        (err) => {
          console.error(err);
        }
      );
    };

    async function FetchData(){

      const roomitems = data.roomitems;


      setRoomitems(roomitems);

      const serverroomitems = await ReadRoom();
      setRoomitems(serverroomitems);

      FetchLocation();

    } 

    FetchData();

  }, [])

    /**
   * useSelector menu 가 변경됨을 감지 함에 따라 호출되는  Hook 함수
   * 데이타를 서버로 부터 불러와서 FilterwokrItems 함수로 걸러진값을 workitems 에 설정 해준다
   */

    useEffect(()=>{
      async function FetchData(){
        const serverroomitems = await ReadRoom();
        let items = FilterRoomitems(value, serverroomitems);
        setRoomitems(items);
      }
      FetchData();
      setRefresh((refresh) => refresh +1);
    },[value])
  
  
    /**
     *  필터 값에 의해서 다시 데이타를 정리 해주는 함수
     *  ROOMSIZE.ALLROOM 인경우는 모든 값을 보여준다
     */
    function FilterRoomitems(filter, roomitems){
    console.log("TCL: FilterRoomitems -> roomitems", roomitems)

      if(roomitems.length == 0){
        return [];
      }
      let items = [];
      roomitems.map((data) =>{
  
        if(filter == ROOMSIZE.ALLROOM)
        {
          items.push(data);
        }else{
          if(data.ROOMTYPE == filter){
            items.push(data);
          }
        }
      })
      return items;
    }

    

  const _handleSelectWork = (ROOM_ID) =>{
    navigate("/PCmap" ,{state :{ID :ROOM_ID, TYPE : FILTERITMETYPE.ROOM}});
  }


  const positioncallback = () =>{
    setCurrentloading(true);
    setRefresh((refresh) => refresh +1);
  } 
  
  const _handlecurrentloadingcallback = ()=> {
    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);
  }
  return (
    <>
    {
      currentloading == true && <Loading type={LoadingType.CURRENTPOS} callback={_handlecurrentloadingcallback}/>
    }
    {
      <Container style={containerStyle}>

 
      <div style={{display:"flex", flexDirection:"column"}}>
    
        <Position type={PCMAINMENU.ROOMMENU} callback={positioncallback}/>
  
        {
            roomitems.length == 0 && <Column style={{height:300}}>
              <img src={Seekimage(value)} style={{width:60}}/>
              <div style={{fontSize:18}}>해당 싸이즈에 공간대여가 존재 하지 않습니다</div>
            </Column>
          }
          
        <FlexstartRow style={{flexWrap:"wrap"}}>
        {
            roomitems.map((item, index)=>(
              <>
              {
                index < 20 &&           
                <PCRoomItem key={index}  index={index} width={'23%'} roomdata={item} onPress={()=>{_handleSelectWork(item.ROOM_ID)}}/>
              }
           
              </>
  
            ))
          }
        </FlexstartRow>
      </div>
  
      <StoreInfo />
  
      </Container>
    }
    </>
  );

}

export default PCRoomcontainer;


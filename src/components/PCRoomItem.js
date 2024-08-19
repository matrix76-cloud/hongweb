import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { CommaFormatted } from "../utility/money";
import { CiHeart } from "react-icons/ci";
import { Column, FlexstartColumn } from "../common/Column";
import PriceTable from "./PriceTable";
import { distanceFunc } from "../utility/region";
import { REQUESTINFO } from "../utility/work";
import { imageDB } from "../utility/imageData";
import { ROOMSIZE } from "../utility/room";

const Container = styled.div`
  background: ${({selected}) => selected == true ?('#ededed'):('#fff')};
  width: ${({width}) => width};
  margin-right: 20px;
  margin-bottom: 10px;
  border: ${({selected}) => selected == true ?('2px solid #817b79'):('1px solid #f0f0f0')};
  border-radius: 10px;

  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;

`

const RoomSmallType = styled.div`
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  top: 10px;
  left:-120px;
  background :#F5FFFE;
  color :#00B8A9;
  width:50px;
  height:26px;
  padding :4px 8px 4px 8px;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
`


const RoomMediumType = styled.div`
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  top: 10px;
  left:-120px;
  background :#F5FBFF;
  color :#21A2FF;
  width:50px;
  height:26px;
  padding :4px 8px 4px 8px;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
`

const RoomLargeType = styled.div`
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  top: 10px;
  left:-120px;
  background :#FFF5F5;
  color :#FF2121;
  width:50px;
  height:26px;
  padding :4px 8px 4px 8px;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
`

const KeywordBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  background: #FFF5E5;
  border-radius: 5px;
  margin-right: 7px;
  padding: 0px 10px;
  font-size:12px;
  color : #1a1a1a;
`
const InfoLayout = styled.div`
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: self-start;
  justify-content: space-around;

`
const style = {
  display: "flex"
};

const PCRoomItem =({containerStyle, width, roomdata, onPress, index, selected}) =>  {

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

  const _handleworkselect = ()=>{
    console.log("TCL: _handleworkselect -> y", index);
    
    onPress(index);

  }

  function getImage(){
    const FindIndex = roomdata.ROOM_INFO.findIndex(x=>x.requesttype == '짐보관할 장소');
    let Image  = roomdata.ROOM_INFO[FindIndex].result;
    return Image;
  }
  function Region(){
    const FindIndex = roomdata.ROOM_INFO.findIndex(x=>x.requesttype == '지역');
    let region  = roomdata.ROOM_INFO[FindIndex].result;
    let regions = [];
    regions = region.split(' ');

    return regions[1]+' ' + regions[2]+' '+ regions[3];
  }
  function Distance() {
    const lat1 = user.latitude;
    const lon1 = user.longitude;
    const FindIndex = roomdata.ROOM_INFO.findIndex(x=>x.requesttype == '지역');
    const lat2 = roomdata.ROOM_INFO[FindIndex].latitude;;
    const lon2 = roomdata.ROOM_INFO[FindIndex].longitude;;
    const dist = distanceFunc(lat1, lon1, lat2, lon2);
    return parseFloat(Math.round(dist /1000 * 1000) / 1000);
  }


  function Price(){
    const FindIndex = roomdata.ROOM_INFO.findIndex(x=>x.requesttype == '금액');
    return roomdata.ROOM_INFO[FindIndex].result;
  }
  function UseRoom(){
    const FindIndex = roomdata.ROOM_INFO.findIndex(x=>x.requesttype == '대상');
    return roomdata.ROOM_INFO[FindIndex].result;
  }
 
  function Info(){
    const FindIndex = roomdata.ROOM_INFO.findIndex(x=>x.requesttype == REQUESTINFO.ROOMCHECK);
    return roomdata.ROOM_INFO[FindIndex].result;
  }

  return (
  
 
     <Container style={containerStyle} width={width} onClick={_handleworkselect} selected={selected}>
      {
        roomdata.ROOMTYPE == ROOMSIZE.SMALL && <RoomSmallType><span>{roomdata.ROOMTYPE}</span></RoomSmallType>
      }
      {
        roomdata.ROOMTYPE == ROOMSIZE.MEDIUM && <RoomMediumType><span>{roomdata.ROOMTYPE}</span></RoomMediumType>
      }
      {
        roomdata.ROOMTYPE == ROOMSIZE.LARGE && <RoomLargeType><span>{roomdata.ROOMTYPE}</span></RoomLargeType>
      }

      <div style={{width:"100%"}}>
      <img src={getImage()} width={'100%'} height={224} style={{borderTopLeftRadius:10, borderTopRightRadius:10,marginTop:-35}}/>
      </div>
     <FlexstartColumn style={{width:"100%", position:'relative', marginTop:10}}>
      <InfoLayout>
      <FlexstartColumn style={{width:"100%", padding: "0px 15px"}}>
         <div style={{fontSize:14, color:"#A3A3A3", lineHeight:'18.2px', display:"flex", justifyContent:"center", alignItems:"center"}}>
          <img src ={imageDB.map} style={{width:14}}/><span style={{marginLeft:5}}>{Region()}</span></div>
       </FlexstartColumn>

       <FlexstartColumn style={{width:"100%", padding: "0px 15px"}}>
         <div style={{fontSize:14, color:"#A3A3A3", lineHeight:'18.2px', display:"flex", justifyContent:"center", alignItems:"center"}}>
         <img src ={imageDB.distance} style={{width:14}}/>
         <span style={{marginLeft:5}}>{Distance()}km</span></div>
       </FlexstartColumn>

       <FlexstartColumn style={{width:"100%", padding: "0px 15px"}}>
         <div style={{color:"#A3A3A3", fontSize:14, lineHeight:'18.2px'}}>짐을 수시로 찾을수 있는지 여부 : <span style={{color:"#131313", fontWeight:700}}>{Info()}</span></div>
       </FlexstartColumn>
      </InfoLayout>


       {/* <PriceTable/> */}

       <FlexstartRow style={{height:"52px",width:"100%", flexWrap:"wrap", padding: "0px 15px"}}>
         <KeywordBox> {Price()}으로 이용가능</KeywordBox>
         <KeywordBox> {UseRoom()}에서 보관</KeywordBox>
       </FlexstartRow>

     </FlexstartColumn>


     </Container>
    

  );

}

export default PCRoomItem;


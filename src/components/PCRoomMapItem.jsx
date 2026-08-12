import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { CommaFormatted } from "../utility/money";
import { distanceFunc } from "../utility/region";
import { CiHeart } from "react-icons/ci";
import { imageDB, Seekimage } from "../utility/imageData";
import { BetweenColumn, Column, FlexstartColumn } from "../common/Column";
import { FiEye } from "react-icons/fi";
import { getDateOrTime } from "../utility/date";

import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime, WriteTimeCurrentTimeDiff } from "../utility/date";
import { WORKNAME } from "../utility/work_";
import Button from "../common/Button";

const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
  background: ${({selected}) => selected == true ?('#f2efef'):('#fff')};
  height:  ${({selected}) => selected == true ?('200px'):('200px')};
  width: ${({width}) => width};
  margin-bottom: 20px;
  border: ${({selected}) => selected == true ?('2px solid #817b79'):('2px solid #F5F5F5')};
  border-radius: 20px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding :20px;
  scroll-margin-top: 20px;

  

`

const KeywordBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  background: ${({selected}) => selected == true ?('#FFF'):('#FFF5E5')};
  border-radius: 5px;
  margin-right: 5px;
  padding: 4px 8px;
  margin-top: 10px;
  font-size:12px;
`

const TagItem = styled.div`

`
const Tag = styled.div`
  background: #FFE5E5;
  
  color: #FF2121;
  padding: 4px 8px;
  border-radius: 5px;
  width:81px;
  height:26px;
  display:flex;
  font-size:14px;
  justify-content:center;
  align-items:center;
`
const DisableTag = styled.div`
  background: #F3F3F3;
  color: #A3A3A3;
  padding: 4px 8px;
  border-radius: 5px;
  width:81px;
  height:26px;
  display:flex;
  font-size:14px;
  justify-content:center;
  align-items:center;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items:center;
  background: ${({selected}) => selected == true ?('#f2efef'):('#fff')};
  height:60%;
  width:100%;

`

const style = {
  display: "flex"
};

const WorkType = styled.div`

`
const WorkTypeText = styled.div`
  font-size: 18px;
  font-family:Pretendard-SemiBold;
`

const PCRoomMapItem = React.forwardRef(({containerStyle, width, roomdata, onPress, index, selected}, ref) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const reference = useRef(null);

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

  /**
   * 
   * 두개의 지점을 가지고 소수점 두째자리 거리를 환산해준다
   */
  function Distance() {
    const lat1 = user.latitude;
    const lon1 = user.longitude;
    const lat2 = roomdata.WORK_INFO.LATITUDE;
    const lon2 =  roomdata.WORK_INFO.LONGITUDE;
    const dist = distanceFunc(lat1, lon1, lat2, lon2);
    return parseFloat(Math.round(dist /1000 * 1000) / 1000);
  }

  const _handleDetail = ()=>{

  }
  function Price(){
    const FindIndex = roomdata.ROOM_INFO.findIndex(x=>x.requesttype == '금액');
    return roomdata.ROOM_INFO[FindIndex].result;
  }

  function Region(){
    const FindIndex = roomdata.ROOM_INFO.findIndex(x=>x.requesttype == '지역');
    let region  = roomdata.ROOM_INFO[FindIndex].result;
    let regions = [];
    regions = region.split(' ');

    if(regions.length  == 3){
      return regions[0]+' ' + regions[1]+' '+ regions[2];
    }else{
      return regions[0]+' ' + regions[1]+' '+ regions[2] +' '+ regions[3];  
    }
  }


 
  return (

    <Container style={containerStyle} width={width} selected={selected} ref={ref}   >


      <Column style={{height:"40%",width:"100%"}}>
        <Row style={{height:"86px",width:"100%"}}>
          <FlexstartColumn style={{height:"100%",width:"66%"}}>
            {
              roomdata.ROOM_STATUS == 0 ? (<TagItem>
                  <Tag>진행중 거래</Tag></TagItem>):(<TagItem><DisableTag>마감된 거래</DisableTag></TagItem>)
            }
           <FlexstartColumn style={{marginTop:14,height:46}}>
              <WorkType><WorkTypeText>{roomdata.ROOMTYPE}</WorkTypeText></WorkType>
              <div><WorkTypeText>{Price()} 
    
              </WorkTypeText></div>
            </FlexstartColumn>
          </FlexstartColumn>

          <BetweenRow style={{height:"100%", width:"34%"}}>
            <div style={{background:"#F9F9F9", height:80, width:80, borderRadius:80, display:"flex", justifyContent:"center", alignItems:"center"}}>
            <img src={Seekimage(roomdata.ROOMTYPE)} style={{width:64}}/>
            </div>
          </BetweenRow>
        </Row>



 
      </Column>

      <div style={{ width:"100%", marginTop:20}}></div>


      <InfoContainer selected={selected}>
        <BetweenRow style={{height:"18px",width:"100%",margin:"12px 0px"}}>
          <Row><img src={imageDB.eyesolid} style={{width:16, height:16}}/>
          <span style={{fontSize:18,paddingLeft:5}}></span>20</Row>
          <Row><span style={{color :"#A3A3A3", paddingRight:10,fontSize:18}}>현재 보관 건수</span><span style={{fontFamily:"Pretendard-Bold"}}>5건</span></Row> 
        </BetweenRow>
        <Button text={"상세보기"} onPress={_handleworkselect}
          containerStyle={{backgroundColor: "#fff", color :"rgb(36 36 36)",borderRadius: "10px",border:"none", textDecoration:"underline",
          fontSize: 16,height:26,width: "100px", gap:4,marginLeft:150}}/>
      </InfoContainer>
    </Container>
  );

});

export default PCRoomMapItem;


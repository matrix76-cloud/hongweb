import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import StoreInfo from "../../components/StoreInfo";
import { DataContext } from "../../context/Data";


import { ReadWork } from "../../service/WorkService";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { FILTERITMETYPE, LoadingType, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { WORKNAME } from "../../utility/work";
import { useSelector } from "react-redux";
import { Column, FlexstartColumn } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Label from "../../common/Label";
import { GoNoEntry } from "react-icons/go";

import "./MobileMaincontainer.css";
import "./MobileCommunitycontainer.css";
import MobileStoreInfo from "../../components/MobileStoreInfo";
import { ROOMSIZE } from "../../utility/room";
import { ReadRoom } from "../../service/RoomService";
import PCRoomItem from "../../components/PCRoomItem";
import MobileRoomItem from "../../components/MobileRoomItem";
import LottieAnimation from "../../common/LottieAnimation";
import { extractTextFromHTML, useSleep } from "../../utility/common";

import TimeAgo from 'react-timeago';

import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime } from "../../utility/date";
import { ReadCommunityByid } from "../../service/CommunityService";

const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
  padding:50px 0px;
  height: 100%;
`


const style = {
  display: "flex"
};

const FlexMenu = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-x: auto;
  width: 100%;
  scrollbar-width: none;
  margin-top:10px;


`

const BoxItem = styled.div`
  padding: 20px 0px 30px;
  border-bottom: 1px solid #E3E3E3;
  margin-bottom: 30px;
  color: #333;
  line-height: 1.8;
  width:90%;
  font-family: "Pretendard-Light";
  margin : 0 auto;


`
const BoxLabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size:16px;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  width:100%;


`

const BoxContent = styled.div`
  font-family: "Pretendard-Light";
  font-size:14px;

`
const BoxWrite = styled.div`
  display : flex;
  flex-direction : row;
  justify-content: flex-start;
  align-items: center;
  width : 100%;
  font-size :14px;
`

const BoxImage = styled.div`
  margin-top:5px;
`


const Taglabel = styled.div`
  font-family: "Pretendard";
  font-size:12px;
  margin-right:10px;
  min-width:50px;
  display : flex;
  align-items: center;
  justify-content: center;
  background-color:#FFF5F5;
  color :#FF2121;
  border-radius: 5px;

`

const ContentLayer = styled.div`

  padding: 0px 0px;
  background-color: #fff;
  width:${({width}) => width}px;

`



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;



/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const MobileCommunityBoardcontainer =({containerStyle, item}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [displayitem, setDisplayitem] = useState({});
  const [width, setWidth] = useState(0)
 
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    setWidth(elementRef.current.offsetWidth -30);
    setRefresh((refresh) => refresh +1);
  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setDisplayitem(displayitem);
    setWidth(width);
  },[refresh])

  /**

   */
  useEffect(()=>{
    async function FetchData(){
      const COMMUNITY_ID = item.COMMUNITY_ID;
      const itemTmp = await ReadCommunityByid({COMMUNITY_ID})
      setDisplayitem(itemTmp);
    }
    FetchData();

  }, [])



  return (
    <div ref={elementRef}>
          <Container style={containerStyle}>
        
        <BoxItem >
          <FlexstartColumn>

            <Taglabel>
                {displayitem.COMMUNITYCATEGORY}
            </Taglabel>
              
            <BoxLabel>
              <div>
              {displayitem.LABEL}
              </div>
          
                  
            </BoxLabel>
            <BoxWrite>
                <FlexstartRow style={{width:'40%', margin:"5px 0px", justifyContent:"space-between"}}>
                  <Row><img src={imageDB.logo}  style={{width:20}}/></Row>
                  <div>관리자</div>
                  <div>
                  <TimeAgo date={getFullTime(displayitem.CREATEDT)}formatter={formatter}style={{fontWeight:400, fontSize:14, color :"#A3A3A3"}} />
                  </div>
                </FlexstartRow>
                <FlexEndRow style={{width:'20%', fontSize:14}}>
                  <img src={imageDB.heartoff} style={{width:16}}/>
                  <div style={{marginLeft:5}}>0</div>
                </FlexEndRow>
            </BoxWrite>
            <BoxContent>        
              <ContentLayer width={width} id="contentlayer"
                  dangerouslySetInnerHTML={{ __html: displayitem.CONTENT }}
                ></ContentLayer>
            </BoxContent>
       
            <BoxImage>
              <img src={displayitem.REPRESENTIMG} style={{width:"100%", borderRadius:"10px"}}/>
            </BoxImage>
          </FlexstartColumn>

        </BoxItem>

          </Container>
    </div>
  );

}

export default MobileCommunityBoardcontainer;


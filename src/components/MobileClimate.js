import { Table } from "@mui/material";
import { setLogLevel } from "firebase/firestore";
import React, { memo, useContext, useEffect, useLayoutEffect, useState, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../common/Button";
import ButtonEx from "../common/ButtonEx";
import { Column } from "../common/Column";
import LottieAnimation from "../common/LottieAnimation";
import { BetweenRow, Row } from "../common/Row";
import { DataContext } from "../context/Data";
import { UserContext } from "../context/User";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { ReadTourRegion } from "../service/LifeService";
import { sleep, useSleep } from "../utility/common";
import { imageDB } from "../utility/imageData";
import "./mobile.css";
import "./table.css";
import "./MobileYoutubeRegion.css";
import { IoMdClose } from "react-icons/io";
import { COLORS } from "../utility/colors";
import { TbGps } from "react-icons/tb";
import { RiListView } from "react-icons/ri";
import { LIFEMENU } from "../utility/life";
import CurrentWeather from "./CurrentWeather";

import * as XLSX from "xlsx";
import { CreateRegionCode } from "../service/RegionCodeService";
import { getFontSize } from '../utility/fontsize';
const Container = styled.div`
    width:100%;
    height:100vh;
`
const style = {
  display: "flex"
};

const DetailLevel = 4;
const DetailMeter = 300;
const BasicLevel = 9;



const mapstyle = {
  position: "absolute",
  overflow: "hidden",
  top: '10%',
  width: '100%',
};


const PopupWorkEx = styled.div`

  position: absolute;
  top:150px;
  width: 100%;
  background: #fff;
  z-index: 5;
  overflow-y: auto;
  height:600px;
`

const TableLayout = styled.div`
  overflow-y: scroll;
  scroll-behavior: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
  margin-bottom: 100px;
`
const LoadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position: "absolute"
}

const MapExbtn = styled.div`
  position: relative;
  top: 10px;
  left: 88%;
  z-index: 3;
  background: #f9f9f9;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderPopupline = styled.div`

  width:30%;
  background:#E3E3E3;
  height:5px;
`
const Storename = styled.div`
  font-size: ${() => getFontSize(20)}px;
  font-family: 'Pretendard-SemiBold';
  width: 95%;
  margin: 0 auto;
  height:35px;
`
const Storeaddr = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family: 'Pretendard-Regular';
  width: 95%;
  margin: 0 auto;
  height: 35px;
  display: flex;
  align-items: center;
`

const Storetel = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family: 'Pretendard-Regular';
  width: 95%;
  margin: 0 auto;
  height:35px;
`
const Youtubelogo = styled.div`
    position: absolute;
    top: 210px;
    width: 80px;
    left: 35%;


`

const YoutubePopupWorkEx = styled.div`

  position: absolute;
  top:100px;
  width: 100%;
  background: #fff;
  z-index: 5;
  overflow-y: auto;
`
const ListButton = styled.div`
  background-color: #fff;
  width: 120px;
  height: 40px;
  display: flex;
  margin-left:5px;
  justify-content: center;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 20px;
  border: 1px solid #ededed;
  font-family: 'Pretendard-SemiBold';
`
const ButtonLayer = styled.div`
  position: fixed;
  bottom: 80px;
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content:center;
`

const EmptyLine = styled.div`
  height: 20px;
  background: #f8f8f8;
  width: 100%;
  margin: 30px 0px;

`

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;





const MobileClimate = memo(({ containerStyle }) => {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);


  useEffect(() => {

  }, [refresh])
  async function FetchData() {


  }
  useLayoutEffect(() => {

    FetchData();
  }, [])


  return (

    <Container style={containerStyle}>
      <Suspense fallback={<div>Loading...</div>}>
      <CurrentWeather  addr={user.address_name} summaryexist ={true} type={'climate'}/>
      </Suspense>
    </Container>
  );

});

export default MobileClimate;


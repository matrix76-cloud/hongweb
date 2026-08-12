
import { setRef, Table } from "@mui/material";
import React, {memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { shuffleArray, useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column, FlexstartColumn } from "../common/Column";
import { DataContext } from "../context/Data";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import { ReadTourFestival } from "../service/LifeService";
import ResultLabel from "../common/ResultLabel";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import "../screen/css/common.css"
import { FaArrowDownLong } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";
import "./mobile.css";
import { ReadTOURCOURSE, ReadTOURCOURSECODE } from "../service/TourCourseService";
import { IoFlagSharp } from "react-icons/io5";
import { PCMAINMENU } from "../utility/screen";
import { TOURISTMENU } from "../utility/life";
import { FaMap } from "react-icons/fa";
import { getFontSize } from "../utility/fontsize";




const Container = styled.div`
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;


  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh);
  touch-action: pan-y;
  background:#F0F2F5;

`



const Box = styled.div`
  width: 90%;
  margin: 10px auto;
  border-radius: 10px;
  background:#FFF;
  cursor: pointer;
  &:active {
  transform: scale(0.95); /* 눌렀을 때 크기 조정 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }
`

const CourseName = styled.div`
  margin-bottom: 10px;
  font-size: ${() => getFontSize(16)}px;
  color: #1A1E28;
  font-family : Pretendard-SemiBold;

`
const ViewBtn = styled.div`

    margin: 20px auto 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    color: #fff;
    background : #000000ab;
    height: 38px;
    font-size: ${() => getFontSize(14)}px;
    font-family: Pretendard-SemiBold;
    width: 100%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* 기본 그림자 */

`


const FilterEx = styled.div`
    position: absolute;
    width: 35%;
    height: 50px;
    z-index: 10;
    bottom: 30px;
    right :20px;


`
const ImageViewer = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
`
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;

`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #96989C; /* 회색 텍스트 */
  font-size: ${() => getFontSize(14)}px;
  font-family: 'Pretendard-Light';

  &::before {
    content: "●";
    color: #ff6600; /* 주황색 점 */
    margin-right: 10px;
    font-size: ${() => getFontSize(12)}px;
  }
  &::after {
  content: "";
  position: absolute;
  left: 5px; /* 점 위치에 맞게 조정 */
  top: 15px;
  width: 1px;
  height: calc(100% - 35px); /* 점 아래로 선을 표시 */
  background-color: #ff6600;
}

  /* 마지막 아이템 아래로 선이 그려지지 않도록 처리 */
  &:last-child::after {
    display: none;
  }
`;

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const MobileLifeTourCourse =memo(({containerStyle}) =>  {

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
  const [refresh, setRefresh] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [courseitems, setCourseitems] = useState([]);
  const [codeitems, setCodeitems] = useState([]);



  function SeekCourseName(number){

    const FindIndex = codeitems.findIndex(x=>x["코스ID"] == number);
    return codeitems[number]["코스명"];

  }

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);



   
  useEffect(()=>{


  async function FetchData(){

    const codeitemsTmp = await ReadTOURCOURSECODE({});
 

    setCodeitems(codeitemsTmp[0].TOURCOURSECODEITEM);

    const itemsTmp = await ReadTOURCOURSE({});

    const groupedItemsTmp = itemsTmp[0].TOURCOURSEITEM.reduce((result, item) => {
   	
      // item.category 값이 이미 존재하는지 확인
      const key = item["코스 아이디"];
      if (!result[key]) {
        result[key] = []; // category 값이 없으면 배열 초기화
      }
      
      result[key].push(item); // 해당 category에 item 추가
      return result;
    }, {});
    


    const keysWithSizes = Object.keys(groupedItemsTmp).map((key) => ({
      key,
      
      size: groupedItemsTmp[key].length,
      items: groupedItemsTmp[key].sort((a, b) => a["코스순서"] - b["코스순서"])
    }));

    let CompleteItems = [];

    keysWithSizes.map((data)=>{
      CompleteItems.push(data.items);
    })

    setCourseitems((CompleteItems));
    setRefresh((refresh) => refresh +1);
    setLoading(false);
  }


    FetchData();
  }, [])



  const _handleCourseanalyze = (name,data ) => {

    navigate("/Mobiletourcourseanalyze" ,{state :{name :name, COURSEITEM : data}});

  }

  const _handleMap =()=>{
    navigate("/Mobileleisurecontent" ,{state :{name :TOURISTMENU.TOURCOURSEMAP}});
  }

  const _handleprev = () => {
    navigate("/Mobilelife");
  }


  return (

    <div style={{ background: '#F0F2F5' }}>   

    {loading == true ? (<LottieAnimation  animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'} />) :(
          <>
            

           <FlexstartRow style={{flexWrap:"wrap", marginTop:10}}>
          {
            courseitems.map((data, index)=>(
            <Box key={data[0]["코스 아이디"]} onClick={()=>{_handleCourseanalyze(SeekCourseName(data[0]["코스 아이디"] -1), data)}} >

              <div>

                 
                  <div style={{padding:20}}>
                    <CourseName>{SeekCourseName(data[0]["코스 아이디"] - 1)}</CourseName>
                    <List>
                      {
                        data.map((item, index) => (
                          <ListItem key={index}>
                            {item["관광지명"]}
                          </ListItem>
                        ))
                      }
                    </List>  
                  </div>
              
              </div>
       
            </Box>
            ))
          }
            </FlexstartRow>
            

          <FilterEx>
              <ViewBtn onClick={_handleMap}>
                <FaMap size={20} color ={"#fff"}/>
                <div style={{ paddingLeft: 5 }}>지도로 보기</div>
              </ViewBtn> 
          </FilterEx>
          </>
         )}

   
      

  
    </div>
  );

});

export default MobileLifeTourCourse;



import { setRef, Table } from "@mui/material";
import React, {memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { shuffleArray, shuffleArray1, shuffleArray2, shuffleArray3, useSleep } from "../utility/common";
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
import { AiOutlineRight } from "react-icons/ai";
import { TourCourse, TourCourseCodeItem } from "../store/jotai";
import { useAtom } from "jotai";
import { getFontSize } from '../utility/fontsize';



const Container = styled.div`

  margin : 0px auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
  width : 100%;

`



const Box = styled.div`
  width: 90%;
  margin: 3px auto;
  border-radius: 10px;
  padding :10px 0px;
  background:#FFF;
  cursor: pointer;
  &:active {
  transform: scale(0.95); /* 눌렀을 때 크기 조정 */

  }
`

const CourseName = styled.div`
  font-size: ${() => getFontSize(14)}px;
  color: #1A1E28;
  font-family : Pretendard-SemiBold;
`

const CourseNameDetail = styled.div`
  font-size: ${() => getFontSize(12)}px;
  color: #96989C;
  font-family : Pretendard;
`


const ImageViewer = styled.img`
    width: 25px;
    height: 25px;
    object-fit: cover;
    border-radius: 10px;
    padding-left:5px;
`



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const MobileLifeDisplayTourCourse =memo(({containerStyle}) =>  {

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
  const [tourcourseitem, setTourcourseitem] = useAtom(TourCourse);
  const [tourcourscodeitem, setTourcoursecodeitem] = useAtom(TourCourseCodeItem);



  function SeekCourseName(number){
  
    const FindIndex = codeitems.findIndex(x => x["코스ID"] == number);
    
    return codeitems[FindIndex]["코스명"].slice(0,25);

  }


  function SeekCourse(number) {

    const FindIndex = codeitems.findIndex(x => x["코스ID"] == number);

    console.log("SeekCourse", FindIndex);
    if (FindIndex < 0) {
      return (<></>);
    }

    return (
      <>
        {codeitems[FindIndex]["코스명"].slice(0, 9)}
        {codeitems[FindIndex]["코스명"] > 9 ? "..." : null}
      </> 

    )

  }






  function SeekCourseNumber(number) {
    return courseitems[number].length;
  }

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setLoading(loading);
    setCourseitems(courseitems);
    setCodeitems(codeitems);


  }, [refresh])

  async function FetchData() {

    if (tourcourscodeitem.length == 0) {
      const codeitemsTmp = await ReadTOURCOURSECODE({});

      setCodeitems(codeitemsTmp[0].TOURCOURSECODEITEM);
    } else {
      setCodeitems(tourcourscodeitem);
    }

    let itemsAryTmp = shuffleArray1(tourcourseitem);

    setCourseitems((itemsAryTmp));
    setLoading(false);
    setRefresh((refresh) => refresh + 1);

  }

   
  useEffect(()=>{




    FetchData();
  }, [])



  const _handleCourseanalyze = (name,data ) => {
   // console.log("MATRIX LOG : MobileLifeTourCourse : data:", data)
    navigate("/Mobiletourcourseanalyze" ,{state :{name :name, COURSEITEM : data}});
   // navigate("/Mobiletourcoursetrace" ,{state :{eventname :eventname, COURSEITEM : data}});
  }

  const _handleMap =()=>{
    navigate("/Mobilecommunitycontent" ,{state :{name :TOURISTMENU.TOURCOURSEMAP}});
  }

  const _handleprev = () => {
    navigate("/Mobilelife");
  }


  return (

    <Container style={containerStyle}>   

      {loading == false && <FlexstartRow style={{ flexWrap: "wrap", width:"100%" }}>
        {
          courseitems.map((data, index) => (
            <Box key={data[0]["코스 아이디"]} onClick={() => { _handleCourseanalyze(SeekCourseName(data[0]["코스 아이디"] - 1), data) }} >
              <Row style={{ width: "100%" }}>
                <FlexstartRow style={{ width: "10%"}}>
                  <ImageViewer src={imageDB.board} />
                </FlexstartRow>
        
                <FlexstartColumn style={{ width: "90%", lineHeight: 1.7, paddingLeft:15 }}>
                  <CourseName>
                    {SeekCourse(data[0]["코스 아이디"] - 1)}
                  </CourseName>
                  <CourseNameDetail>경유지{' '}{SeekCourseNumber(index)}곳</CourseNameDetail>
                </FlexstartColumn>
       

              </Row>

            </Box>
          ))
        }
      </FlexstartRow>}
    </Container>
  );

});

export default MobileLifeDisplayTourCourse;




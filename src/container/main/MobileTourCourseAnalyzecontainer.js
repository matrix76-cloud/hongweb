
import { setRef, Table } from "@mui/material";
import React, {memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";
import LottieAnimation from "../../common/LottieAnimation";

import { DataContext } from "../../context/Data";

import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../../screen/css/common";
import "../../screen/css/common.css"

import { model } from "../../api/config";
import { removeSymbols } from "../../utility/common";
import { FlexstartColumn } from "../../common/Column";
import zIndex from "@mui/material/styles/zIndex";
import MobileTourTracePopup from "../../modal/MobileTourTracePopup";
import KakaoShare from "../../components/KakaoShare";
import { MdGpsFixed } from "react-icons/md";
import { getFontSize } from "../../utility/fontsize";


const HEADER_HEIGHT = 44;
const BOTTOM_HEIGHT = 70;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px; // ✅ 상태바 + 헤더 피함
  height: calc(100dvh - ${HEADER_HEIGHT + BOTTOM_HEIGHT}px);
  overflow-y: auto;
  
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;

`;
const style = {
  display: "flex"
};



const Box = styled.div`
    width: 90%;
    margin: 10px auto;
    border-radius: 10px;
    background: #fff;
    cursor: pointer;
    line-height: 2;
}
`
const InnerLabel = styled.div`

  margin-left: 3px;
  background: #FFF0E9;
  color: #FE6625;
  font-size: ${() => getFontSize(12)}px;
  padding: 3px 5px;
  border-radius: 5px;
  margin-top: 5px;


`
const ContentLabel = styled.div`
  margin-left: 3px;
  background: #F5F6F9;
  color: #66686F;
  font-size: ${() => getFontSize(12)}px;
  padding: 3px 5px;
  border-radius: 5px;
  margin-top: 5px;

`
const CourseName = styled.div`
    font-family: 'Pretendard-Bold';
    margin-bottom: 10px;
    font-size: ${() => getFontSize(18)}px;
    color :#19a7ff;

`
const AnalysisBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    color: rgb(246 242 242);
    height: 55px;
    font-size: ${() => getFontSize(16)}px;
    font-family: Pretendard-SemiBold;
    width: 90%;
    margin: 0 auto;
    background: #ff7e19;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

`


const FilterEx = styled.div`
    position: fixed;
    width: 100%;
    height: 70px;
    z-index: 10;
    bottom: 0px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    background : #fff;
    border-top:1px solid #ededed;


`

const Label = styled.div`
  background: #484B53;
  color: #fff;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  align-items: center;
  height:52px;
  border-top-left-radius : 10px;
  border-top-right-radius : 10px;

  width :100%;
`
const Label1 = styled.div`
  font-family : pretendard-semiBold;
  font-size :16px;
  padding-left:10px;
  color : #fff;
`
const Label2 = styled.div`
  font-family : pretendard-semiBold;
  font-size :12px;
  padding-right:10px;
  color : #999;
`
const ImageViewer = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`
/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const MobileTourCourseAnalyzecontainer =memo(({containerStyle, name, item}) =>  {



  
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
  const [searchloading, setSearchloading] = useState(false);
  const [touritem, setTouritem] = useState(item);


  const [tourcoursepopup, setTourcoursepopup] = useState(false);
  const [tourcourseitem, setTourcourseitem] = useState({});

 

  // useEffect(() => {
  //     window.scrollTo(0, 0);
  //     return () => {};
  // }, []);

  useEffect(()=>{
    setLoading(loading);
    setTouritem(touritem);
    setTourcoursepopup(tourcoursepopup);

  }, [refresh])


   
  useEffect(()=>{
    async function FetchData(){

      const promises = touritem.map(async(data)=>{
        data["open"] = false;
        const result = await model.generateContent(data["관광지명"]);
        const response = result.response;
        const text = response.text();
        data["상세설명"] = removeSymbols(text);
  
      })
   

      await Promise.all(promises); 
      setTouritem(touritem);
      setLoading(false);
  
      setRefresh((refresh) => refresh +1);
  
    }

    FetchData();
    

  }, [])




  const _handleTrace =()=>{
    //   navigate("/Mobiletourcoursetrace" ,{state :{eventname :name, COURSEITEM : item}});
    
    setTourcoursepopup(true);
    setRefresh((refresh) => refresh + 1);
  }
  const _handleView = async(data)=>{
    console.log("View");
    data["open"] = true;
    setTouritem(touritem);
    setRefresh((refresh) => refresh +1);
  }
  const _handleClose = (data)=>{
    console.log("Close");
    data["open"] = false;
    setTouritem(touritem);
    setRefresh((refresh) => refresh +1);
  }

  const mobiletourcoursepopupclose = () => {
    setTourcoursepopup(false);
    setRefresh((refresh) => refresh + 1);
  }

  return (

    <Container style={containerStyle}>    
      
    {tourcoursepopup == true && <MobileTourTracePopup callback={mobiletourcoursepopupclose} COURSEITEM={item} eventname={name}  />}


    {loading == true ? (<LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'} />) :(
          <FlexstartColumn style={{paddingTop:50, width:"100%"}}>
          {
            touritem.map((data, index)=>(
              <Box>
                <Label>
                  <Label1>{index + 1}{'번 경유지'} </Label1>
                  <Label2>{'소요시간'}{data["이동시간"]}시간</Label2>
                </Label>

                <div>
                  {/* <ImageViewer src={imageDB.IMGAREA1} /> */}
              </div>
           
              <BetweenRow style={{padding:"0px 15px"}}>
                <Row>
                <InnerLabel>{data["실내구분"]}</InnerLabel>
                <ContentLabel>{data["테마명"]}</ContentLabel>
                </Row>
              </BetweenRow>
                
              <FlexstartRow style={{ fontFamily: "Pretendard-SemiBold", fontSize: () => getFontSize(14), color: "#1A1E28", padding: "15px 15px 0px 15px" }}>{data["관광지명"]}</FlexstartRow>


              <FlexstartRow>  
                <div style={{ whiteSpace: 'pre-line', marginTop: 10, wordBreak: 'break-word', fontSize: () => getFontSize(14), padding: "0px 20px 20px 20px" }}>
                  {data["상세설명"]}
                </div>
              </FlexstartRow>
              </Box>
            ))
          }
    
     
          </FlexstartColumn>
         )}

      <FilterEx>
        <AnalysisBtn onClick={_handleTrace}>

          
          <MdGpsFixed size={20} color={'#fff'} />
          <div style={{ paddingLeft: 5 }}>경로분석</div>

        </AnalysisBtn>


      </FilterEx>
      

  
    </Container>
  );

});

export default MobileTourCourseAnalyzecontainer;


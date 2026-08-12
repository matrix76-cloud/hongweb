
import { setRef, Table } from "@mui/material";
import React, {memo, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";
import LottieAnimation from "../../common/LottieAnimation";

import { DataContext } from "../../context/Data";

import { LoadingCommunityStyle, LoadingListStyle, LoadingSearchAnimationStyle } from "../../screen/css/common";
import "../../screen/css/common.css"

import { model } from "../../api/config";
import { removeSymbols } from "../../utility/common";
import { FlexstartColumn } from "../../common/Column";
import zIndex from "@mui/material/styles/zIndex";
import { getFontSize } from "../../utility/fontsize";


const Container = styled.div`

  margin : 80px auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
  overflow : auto;
  background-color :#fff;
  width: 70%;
  

`
const style = {
  display: "flex"
};






const Inputstyle ={

  background: '#FFF',
  borderRadius:'5px',
  fontSize: '16px',
  padding: '0px 16px 0px 16px',
  height : '40px',
  border : "4px solid #FF7125",


}


const  SearchLayer = styled.div`
  width: 90%;
  margin : 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #fff;
  position: sticky;
  top: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  

`

const BoxItem = styled.div`
  padding: 0px 0px 30px;
  border-bottom: 1px solid #131313;
  margin-bottom: 30px;
  color: #333;
  line-height: 1.8;
  width:100%;
  font-family: "Pretendard-Light";
  m


`

const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}
const MapbtnStyle={
  background: "#ff",
  padding: "0px 20px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '50px',
  color: '#333',
  border :" 1px solid #c3c3c3",
  height: '38px',
  fontSize:'16px',
  fontFamily:'Pretendard-SemiBold',
  width:'30%',
  margin :'20px auto 0px',
}

const Taglabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size: ${() => getFontSize(14)}px;
  margin-right:10px;
  color :#131313;
  min-width:50px;
  display : flex;
  align-items: center;
  justify-content: flex-start;
`

const TagData = styled.div`
  font-family: "Pretendard-Light";
  font-size: ${() => getFontSize(14)}px;

  color :#131313;
`
const Item = styled.div`
  margin: 5px 0px;
  display:flex;
  flex-direction: row;
  justify-content:flex-start;
  align-items:center;
`
// const CourseItem = [
//   {COURSEID:"177", COURSENME:"통영가족여행", REGION:"(통영)세병관(통제영지)", LATITUDE: "128.423238", LONGITUDE :"34.847749",ORDER:"3",ELAPSE:"2",CONTENT:"종교/역사/전통", INNER:"실내"},
//   {COURSEID:"177", COURSENME:"통영가족여행", REGION:"(통영)충렬사", LATITUDE: "128.417847", LONGITUDE :"34.846626",ORDER:"4",ELAPSE:"3",CONTENT:"종교/역사/전통", INNER:"실내"},
//   {COURSEID:"177", COURSENME:"통영가족여행", REGION:"(통영)해저터널", LATITUDE: "128.409908", LONGITUDE :"34.834504",ORDER:"5",ELAPSE:"4",CONTENT:"체험/학습/산업", INNER:"실내"},
//   {COURSEID:"177", COURSENME:"통영가족여행", REGION:"(통영)착량묘", LATITUDE: "128.410558", LONGITUDE :"34.835804",ORDER:"6",ELAPSE:"5",CONTENT:"종교/역사/전통", INNER:"실외"},
//   {COURSEID:"177", COURSENME:"통영가족여행", REGION:"(통영)도남관광지", LATITUDE: "128.432766", LONGITUDE :"34.828362",ORDER:"7",ELAPSE:"6",CONTENT:"자연/힐링", INNER:"실외"},
//   {COURSEID:"177", COURSENME:"통영가족여행", REGION:"(통영)전혁림미술관", LATITUDE: "128.415157", LONGITUDE :"34.826556",ORDER:"8",ELAPSE:"6",CONTENT:"문화/예술", INNER:"실외"},
//   {COURSEID:"177", COURSENME:"통영가족여행", REGION:"(통영)중앙활어시장", LATITUDE: "128.424279", LONGITUDE :"34.845701",ORDER:"9",ELAPSE:"7",CONTENT:"쇼핑/놀이", INNER:"실외"},
//   {COURSEID:"177", COURSENME:"통영가족여행", REGION:"(통영)남망산국제조각공원", LATITUDE: "128.429715", LONGITUDE :"34.841168",ORDER:"10",ELAPSE:"7",CONTENT:"문화/예술", INNER:"실외"},

// ]
const CourseItemLayer = styled.div`
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: ${() => getFontSize(16)}px;
  line-height: 2;
  margin: 50px 0px;

`
const Box = styled.div`
    border: 1px solid #999;
    width: 75%;
    margin: 10px auto;
    padding: 20px;
    border-radius: 10px;
    background: #fff;
    cursor: pointer;
    line-height: 2;
}
`
const InnerLabel = styled.div`

  background: #fff;
  color: #131313;
  border : 1px solid #ededed;
  font-size: ${() => getFontSize(12)}px;
  padding: 3px 10px;
  border-radius: 5px;
  margin-top: 5px;
`
const ContentLabel = styled.div`
  margin-left:3px;
  background: #fff;
  color: #131313;
  border : 1px solid #ededed;
  font-size: ${() => getFontSize(12)}px;
  padding: 3px 10px;
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
    color: rgb(245 240 240);
    height: 48px;
    font-size: ${() => getFontSize(16)}px;
    font-family: Pretendard-SemiBold;
    width: 70%;
    margin-right: 10px;
    background: #ff7e19;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);


`

const PreviouisBtn = styled.div`

    margin: 20px auto 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(51, 51, 51);
    border: 1px solid rgb(195, 195, 195);
    height: 38px;
    font-size: ${() => getFontSize(16)}px;
    font-family: Pretendard-SemiBold;
    width: 100%;
    background:#f9f9f9;


`

const ViewBtn = styled.div`
    background:#ebe9e9;
    color: #131313;

    font-size: ${() => getFontSize(12)}px;
    padding: 3px 10px;
    border-radius: 5px;
    margin-top: 5px;


`
const OrderLabel = styled.div`

  color: #131313;
  display: flex;
  justify-content: center;
  border-radius: 20px;
  font-size: ${() => getFontSize(14)}px;
  width: 80px;


`
const Move = styled.span`
    font-size: ${() => getFontSize(14)}px;
    color: #999;
    margin-left: 10px;
    padding: 5px 5px;
    display: flex;
    flex-direction : row;
    justify-content : center;
    align-items : center;

`
const CheckPoint = styled.div`
    width: 30px;
    border-radius: 30px;
    height: 30px;
    background: rgb(218 217 217);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`
const FilterEx = styled.div`
 
    width: 100%;
    height: 100px;
    z-index: 10;
    bottom: 40px;


`
const CommentContent = {
  width: '100%',
  height: '100vh',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline: "none",
  resize: "none",
  border: "none",
  padding: '20px 0px'
}

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const PCTourCourseAnalyzecontainer =memo(({containerStyle, name, item}) =>  {



  
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
 

  // useEffect(() => {
  //     window.scrollTo(0, 0);
  //     return () => {};
  // }, []);

  useEffect(()=>{
    setLoading(loading);
    setTouritem(touritem);

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
    navigate("/PCtourcoursetrace" ,{state :{eventname :name, COURSEITEM : item}});
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
  const _handlePrevious = () =>{
    navigate(-1);
  }

  return (

    <Container style={containerStyle}>    

    {loading == true ? (<LottieAnimation containerStyle={LoadingListStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'} />) :(
          <FlexstartColumn style={{paddingTop:50, width:"100%"}}>

          <FlexstartRow style={{width:'15%', marginLeft:"10%"}}>
            <PreviouisBtn onClick={_handlePrevious}>이전 화면 돌아가기</PreviouisBtn> 
          </FlexstartRow>
      

          {
            touritem.map((data, index)=>(
              <Box>
              <FlexstartRow>{index+1}{'번 경유지'} {' 소요시간'}{data["이동시간"]}시간</FlexstartRow>
              <FlexstartRow>{data["관광지명"]}</FlexstartRow>

              <BetweenRow>
                <Row>
                <InnerLabel>{data["실내구분"]}</InnerLabel>
                <ContentLabel>{data["테마명"]}</ContentLabel>
                </Row>
                {
                  data["open"] != false ? (
                    <ViewBtn onClick={()=>{_handleClose(data)}}>정보보기</ViewBtn>) 
                  :( <ViewBtn onClick={()=>{_handleView(data)}}>정보보기</ViewBtn>)
                }
              </BetweenRow>

              <FlexstartRow>
              {
                  data["open"] != false &&  <div style={{ whiteSpace: 'pre-line', marginTop:30,wordBreak: 'break-word' }}>
                  {data["상세설명"]}
                </div>
              }
              </FlexstartRow>
              </Box>
            ))
          }
    
          <FilterEx>
            <AnalysisBtn onClick={_handleTrace}>경로분석</AnalysisBtn> 
          </FilterEx>
          </FlexstartColumn>
         )}

   
      

  
    </Container>
  );

});

export default PCTourCourseAnalyzecontainer;


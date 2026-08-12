
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { GoDotFill } from "react-icons/go";
import { TbCircleNumber1Filled } from "react-icons/tb";
import { TbCircleNumber2Filled } from "react-icons/tb";
import { TbCircleNumber3Filled } from "react-icons/tb";
import { UserContext } from "../../../context/User";
import { sleep } from "../../../utility/common";
import { CONFIGMOVE } from "../../../utility/screen";
import { Column } from "../../../common/Column";
import { imageDB } from "../../../utility/imageData";
import { FlexstartRow } from "../../../common/Row";
import LottieAnimation from "../../../common/LottieAnimation";
import ButtonEx from "../../../common/ButtonEx";
import LazyGuideImage from "../../../common/LasyGuideImage";



const Container = styled.div`
  width:95%;
  margin:10px auto;
  color : #131313;

`
const BottomSafeSpace = styled.div`
      height: calc(env(safe-area-inset-bottom, 0px) + 40px); // ✅ 최소 여백 + safe-area
`;

const Mobilecommunityknow =({containerStyle}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


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
 
  }, [refresh])

  useEffect(()=>{

  }, [])
 

 
  return (
    <Container className="WorkLayer">
   <LazyGuideImage width={'100'} src={imageDB.community1} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.community2} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.community3} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.community4} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.community5} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.community6} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.community7} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.community8} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.community9} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display: "flex", justifyContent: "center"
      }} />
      
      <BottomSafeSpace/>
    </Container>
  );

}

export default Mobilecommunityknow;


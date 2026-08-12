
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

  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh-50px);
  touch-action: pan-y;


`

const Mobilehongknow =({containerStyle}) =>  {

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

        <LazyGuideImage width={'100'} src={imageDB.guide1} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'}  src={imageDB.guide2} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/> 
        <LazyGuideImage width={'100'}  src={imageDB.guide3} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0' , display:"flex", justifyContent:"center"}}/>
        <LazyGuideImage width={'100'}  src={imageDB.guide4} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0' , display:"flex", justifyContent:"center"}}/>
        <LazyGuideImage width={'100'} src={imageDB.guide5} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0' , display:"flex", justifyContent:"center"}}/>
        <LazyGuideImage width={'100'} src={imageDB.guide6} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide7} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide8} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide9} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide10} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide11} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide12} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide13} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide14} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide15} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide16} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide17} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide18} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide19} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide20} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide21} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide22} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide23} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
        <LazyGuideImage width={'100'} src={imageDB.guide24} containerStyle={{width:"90%",objectFit:"cover",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>


    </Container>
  );

}

export default Mobilehongknow;


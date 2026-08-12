
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

import { getFontSize } from "../../../utility/fontsize";

const Container = styled.div`
  width:95%;
  margin:10px auto;
  color : #131313;

`

const MobiletransactionKnow =({containerStyle}) =>  {

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


    {/* <div style={{width:'90%', margin:"0 auto", height:100, background:"#fff", marginBottom:20,
      display:"flex", alignItems:"center", justifyContent:"center"}}>
        <span style={{fontSize: () => getFontSize(18)}}>구해줘 홍여사 거래절차 알아보기</span>
    </div> */}
    <LazyGuideImage width={'100'} src={imageDB.transaction1} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.transaction2} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.transaction3} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.transaction4} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.transaction5} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.transaction6} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.transaction7} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.transaction8} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.transaction9} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    <LazyGuideImage width={'100'} src={imageDB.transaction10} containerStyle={{width:"90%",objectFit:"cover",
    minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
    </Container>
  );

}

export default MobiletransactionKnow;


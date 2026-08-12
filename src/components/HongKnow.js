import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../context/User";


import { CiHeart } from "react-icons/ci";
import { USELAW } from "../utility/law";
import { BetweenRow, Row } from "../common/Row";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp  } from "react-icons/io";
import { ref } from "firebase/storage";
import LazyImage from "../common/LasyImage";
import { imageDB } from "../utility/imageData";
import LazyGuideImage from "../common/LasyGuideImage";
import { getFontSize } from '../utility/fontsize';
const Container = styled.div`
    width: 60%;
    margin: 50px auto;
    font-size: ${() => getFontSize(18)}px;
    flex-wrap: wrap;
    display: flex;
    flex-direction:row;
    justify-content: space-around;

`




const style = {
  display: "flex"
};

const HongKnow =({containerStyle}) =>  {

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
    async function FetchData(){
    } 
    FetchData();
  }, [])
  useEffect(()=>{

  },[refresh])



 
  return (

    <Container className="WorkLayer">

        <LazyGuideImage width={'31'} src={imageDB.guide1} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'}  src={imageDB.guide2} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/> 
      <LazyGuideImage width={'31'}  src={imageDB.guide3} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0' , display:"flex", justifyContent:"center"}}/>
      <LazyGuideImage width={'31'}  src={imageDB.guide4} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0' , display:"flex", justifyContent:"center"}}/>
      <LazyGuideImage width={'31'} src={imageDB.guide5} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0' , display:"flex", justifyContent:"center"}}/>
      <LazyGuideImage width={'31'} src={imageDB.guide6} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide7} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide8} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide9} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide10} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide11} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide12} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide13} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide14} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide15} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide16} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide17} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide18} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide19} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide20} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide21} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide22} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide23} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>
      <LazyGuideImage width={'31'} src={imageDB.guide24} containerStyle={{width:"100%",
        minHeight: '200px', backgroundColor: '#e0e0e0', display:"flex", justifyContent:"center" }}/>


    </Container>
  );

}

export default HongKnow;


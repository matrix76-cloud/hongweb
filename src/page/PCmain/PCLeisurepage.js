import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';

import { UserContext } from "../../context/User";


import { imageDB } from "../../utility/imageData";
import { CONVENIENCEMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from "../../utility/life";


import { useDispatch } from "react-redux";

import { Helmet } from "react-helmet";
import PCGateLayout from "../../screen/LayoutPC/Layout/PCGateLayout";
import PCLeisurecontainer from "../../container/PCmain/PCLeisurecontainer";


const Container = styled.div`

`
const style = {
  display: "flex"
};


const LifeItems =[
  {name : TOURISTMENU.TOURPICTURE ,img :imageDB.tour},

  {name : TOURISTMENU.TOURREGION ,img :imageDB.tour},
  {name : TOURISTMENU.TOURFESTIVAL ,img :imageDB.gooutschoolsmall},
  {name : TOURISTMENU.TOURCOUNTRY ,img :imageDB.tourcountry},
  {name : PERFORMANCEMENU.PERFORMANCEEVENT, img : imageDB.performance},
  {name : PERFORMANCEMENU.PERFORMANCECINEMA, img : imageDB.schoolevent},
  {name : MEDICALMENU.MEDICALMEDICINE, img : imageDB.medical},
  {name : MEDICALMENU.FOODINFOMATION, img : imageDB.food},
  {name : CONVENIENCEMENU.CONVENIENCECAMPING, img : imageDB.camping},



]

const Bannerlayer = styled.div`
  position: fixed;
  width: 100px;
  right: 30px;
  top: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`

const PCLeisurepage =() =>  {

  const reduxdispatch = useDispatch();



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



  const lifecallback = (data)=>{
  console.log("TCL: lifecallback -> data", data);


  if(data == TOURISTMENU.TOURPICTURE){
    window.open('/PCtourpicture', '_blank','width=1200,height=700,resizable=yes,scrollbars=yes,left=100');
  } else if(data == TOURISTMENU.TOURREGION){
    window.open('/PCtourregion', '_blank','width=1200,height=700,resizable=yes,scrollbars=yes,left=100');
  }else if(data == TOURISTMENU.TOURFESTIVAL){
    window.open('/PCtourfestival', '_blank','width=1200,height=700,resizable=yes,scrollbars=yes,left=100');
  }else if(data == TOURISTMENU.TOURCOUNTRY){
    window.open('/PCtourcountry', '_blank','width=1200,height=700,resizable=yes,scrollbars=yes,left=100');
  }else if(data == PERFORMANCEMENU.PERFORMANCEEVENT){
    window.open('/PCperformanceevent', '_blank','width=1200,height=700,resizable=yes,scrollbars=yes,left=100');
  }else if(data == PERFORMANCEMENU.PERFORMANCECINEMA){
    window.open('/PCperformancecinema', '_blank','width=1200,height=700,resizable=yes,scrollbars=yes,left=100');
  }else if(data == MEDICALMENU.MEDICALMEDICINE){
    window.open('/PCmedicaldrug', '_blank','width=400,height=700,resizable=yes,scrollbars=yes,left=100');
  }else if(data == MEDICALMENU.FOODINFOMATION){
    window.open('/PCfooddrug', '_blank','width=400,height=700,resizable=yes,scrollbars=yes,left=100');
  }else if(data == CONVENIENCEMENU.CONVENIENCECAMPING){
    window.open('/PCcampingregion', '_blank','width=1200,height=700,resizable=yes,scrollbars=yes,left=100');
  }
  
  setRefresh((refresh) => refresh +1);
    
  }

 
  return (


    <>
    <Helmet>
    <title>여가생활</title>
    <meta name="description" content="구해줘 알바에서 여가생활에 필요한 모든 정보를 확인하세요" />
    <link rel="canonical" href="https://honglady.com/PCLeisuer" />
    </Helmet>
    <PCGateLayout main={true} name={""} height={80}>
      <PCLeisurecontainer/>
    </PCGateLayout>

    </>

  );

}

export default PCLeisurepage;


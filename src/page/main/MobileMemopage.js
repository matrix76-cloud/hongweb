import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from 'styled-components';
import MobileChatcontainer from "../../container/main/MobileChatcontainer";



import { UserContext } from "../../context/User";
import MobileChatLayout from "../../screen/Layout/Layout/MobileChatLayout";

import { MOBILEMAINMENU, PCMAINMENU } from "../../utility/screen";
import MobilePrevLayout from "../../screen/Layout/Layout/MobilePrevLayout";
import MobileCommonLayout from "../../screen/Layout/Layout/MobileCommonLayout";
import MobileSmartMemo from "../../components/MobileSmartMemo";
import MobileMemoLayout from "../../screen/Layout/Layout/MobileMemoLayout";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const MobileMemopage =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);


  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); // URL 쿼리에서 id 가져오기
  const type = searchParams.get('type'); // URL 쿼리에서 id 가져오기
  console.log("search param", id);


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
    <div style={{ overflow: "hidden", height: "100%" }}> 
      
      {id == null ? (<MobileMemoLayout name={'똑똑한 메모'} type={MOBILEMAINMENU.CHATMENU}>
        <MobileSmartMemo />
      </MobileMemoLayout>) : (<MobileSmartMemo type={type} id={id} />)}
     
    </div>
  );

}

export default MobileMemopage;


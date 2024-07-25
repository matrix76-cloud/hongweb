import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Roomcontainer from "../../container/main/Roomcontainer";
import Workcontainer from "../../container/main/Workcontainer";
import { UserContext } from "../../context/User";
import HomeLayout from "../../screen/Layout/Layout/HomeLayout";

const Container = styled.div`

`
const style = {
  display: "flex"
};

const Roompage =() =>  {

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

    <HomeLayout bottom={true} header={true} type={'room'} name={'홍여사공간'}>
        <Roomcontainer/>
    </HomeLayout>
  );

}

export default Roompage;


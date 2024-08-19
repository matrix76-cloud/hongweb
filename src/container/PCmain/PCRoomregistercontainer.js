import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import StoreInfo from "../../components/StoreInfo";
import { DataContext } from "../../context/Data";

import "./PCmain.css"
import { ReadWork } from "../../service/WorkService";
import { BetweenRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { LoadingType } from "../../utility/screen";
import { ROOMPOLICY, ROOMSIZE } from "../../utility/room";
import { WORKPOLICY } from "../../utility/work";
import { Column } from "../../common/Column";
import Button from "../../common/Button";


const Container = styled.div`
  background :#d8d8d8;
  height:650px;
  padding-top:20px;

`
const style = {
  display: "flex"
};


const TitleLayer = styled.div`
  height: 60px;
  padding: 0px 20px;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top:20px;

`
const Title = styled.div`
  font-size: 20px;
  letter-spacing: -1px;
  line-height: 60px;
  margin-bottom: 30px;
  font-weight :700;

`
const Box = styled.div`
  background : #f9f9f9;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  height: 100px;
  width: 20%;
  background: #f9f9f9;
  margin-right: 10px;
  margin-bottom: 20px;
  border: ${({clickstatus}) => clickstatus == true ? ('2px solid #ff0000') :('') };
  border-radius: 15px;

`

const RoomItems=[
  {name :ROOMSIZE.SMALL, img:imageDB.roomsize1},
  {name :ROOMSIZE.MEDIUM, img:imageDB.roomsize2},
  {name :ROOMSIZE.LARGE, img:imageDB.roomsize3},
]



const PCRoomRegistercontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [menu, setMenu] = useState('');
  const [totalset, setTotalset] = useState(0);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setMenu(menu);
    setTotalset(totalset);
  },[refresh])


  useEffect(()=>{

    async function FetchData(){
     
    } 
    FetchData();
  }, [])


  const _handleroomselect = () =>{
    if(menu ==''){
      alert("대여할 공간형태를 선택해주세여");
      return;
    }
    navigate("/PCregist",{state :{WORKTYPE :menu, WORKTOTAL : totalset}});
  }
  const _handlemenuclick =(menu) =>{

    setMenu(menu);

    if(menu == ROOMSIZE.SMALL){
      setTotalset(ROOMPOLICY.SMALL);
    }else if(menu == ROOMSIZE.MEDIUM){
      setTotalset(ROOMPOLICY.MEDIUM);
    }else if(menu == ROOMSIZE.LARGE){
      setTotalset(ROOMPOLICY.LARGE);
    }


    setRefresh((refresh) => refresh +1);
  }

  return (
    <>
      <Container style={containerStyle}>

      <Column style={{width:'28%', margin:"0px auto", backgroundColor:"#fff", height:"95%"}}>
          <TitleLayer><Title>대여할 공간을 선택해 주세요</Title></TitleLayer>
          <Row style={{flexWrap:"wrap", width:"100%"}}>
            {
              RoomItems.map((data, index)=>(
                <Box onClick={()=>{_handlemenuclick(data.name)}} clickstatus={menu == data.name}>
                  <div><img src={data.img} style={{width:64, height:64}}/></div>
                  <div style={{ fontSize:14}}>{data.name}</div>
                </Box>
              ))
            }
          


          </Row>

          <Button containerStyle={{ fontSize:18}} onPress={_handleroomselect} height={'45px'} width={'300px'} radius={'5px'} bgcolor={'#fffcfc'} color={'#222'} text={'등록하기'}/>


      </Column>


      </Container>

    <StoreInfo />
    </>


  );

}

export default PCRoomRegistercontainer;


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
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { LoadingType } from "../../utility/screen";
import { Column, FlexstartColumn } from "../../common/Column";
import Button from "../../common/Button";
import { WORKNAME, WORKPOLICY } from "../../utility/work";


const Container = styled.div`
    background :#d8d8d8;
    height:750px;
    padding-top:10px;

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


const WorkItems=[
  {name : WORKNAME.HOMECLEAN, img:imageDB.house},
  {name :WORKNAME.BUSINESSCLEAN, img:imageDB.business},
  {name :WORKNAME.MOVECLEAN, img:imageDB.move},
  {name :WORKNAME.FOODPREPARE, img:imageDB.cook},
  {name :WORKNAME.ERRAND, img:imageDB.help},
  {name :WORKNAME.GOOUTSCHOOL, img:imageDB.gooutschool},
  {name :WORKNAME.BABYCARE, img:imageDB.babycare},
  {name :WORKNAME.LESSON, img:imageDB.lesson},
  {name :WORKNAME.PATIENTCARE, img:imageDB.patientcare},
  {name :WORKNAME.CARRYLOAD, img:imageDB.carry},
  {name :WORKNAME.GOHOSPITAL, img:imageDB.hospital},
  {name :WORKNAME.RECIPETRANSMIT, img:imageDB.recipe},
  {name :WORKNAME.GOSCHOOLEVENT, img:imageDB.schoolevent},
  {name :WORKNAME.SHOPPING, img:imageDB.shopping},
  {name :WORKNAME.GODOGHOSPITAL, img:imageDB.doghospital},
  {name :WORKNAME.GODOGWALK, img:imageDB.dog},
]


const PCWorkregistercontainer =({containerStyle}) =>  {

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
  },[refresh]);

  const _handleworkselect = () =>{
    if(menu ==''){
      alert("일감 형태를 선택해주세여");
      return;
    }
    navigate("/PCregist",{state :{WORKTYPE :menu, WORKTOTAL : totalset}});
  }
  const _handlemenuclick =(menu) =>{

    setMenu(menu);

    if(menu == WORKNAME.HOMECLEAN){
      setTotalset(WORKPOLICY.HOMECLEAN);
    }else if(menu == WORKNAME.BUSINESSCLEAN){
      setTotalset(WORKPOLICY.BUSINESSCLEAN);
    }else if(menu == WORKNAME.MOVECLEAN){
      setTotalset(WORKPOLICY.MOVECLEAN);
    }else if(menu == WORKNAME.FOODPREPARE){
      setTotalset(WORKPOLICY.FOODPREPARE);
    }else if(menu == WORKNAME.GOOUTSCHOOL){
      setTotalset(WORKPOLICY.GOOUTSCHOOL);
    }else if(menu == WORKNAME.BABYCARE){
      setTotalset(WORKPOLICY.BABYCARE);
    }else if(menu == WORKNAME.LESSON){
      setTotalset(WORKPOLICY.LESSON);
    }else if(menu == WORKNAME.PATIENTCARE){
      setTotalset(WORKPOLICY.PATIENTCARE);
    }else if(menu == WORKNAME.GOHOSPITAL){
      setTotalset(WORKPOLICY.GOHOSPITAL);
    }else if(menu == WORKNAME.RECIPETRANSMIT){
      setTotalset(WORKPOLICY.RECIPETRANSMIT);
    }else if(menu == WORKNAME.GOSCHOOLEVENT){
      setTotalset(WORKPOLICY.GOSCHOOLEVENT);
    }else if(menu == WORKNAME.GODOGHOSPITAL){
      setTotalset(WORKPOLICY.GODOGHOSPITAL);
    }else if(menu == WORKNAME.GODOGWALK){
      setTotalset(WORKPOLICY.GODOGWALK);
    }else if(menu == WORKNAME.CARRYLOAD){
      setTotalset(WORKPOLICY.CARRYLOAD);
    }



    setRefresh((refresh) => refresh +1);
  }

  return (
    <>
      <Container style={containerStyle}>

        <Column style={{width:'28%', margin:"0px auto", backgroundColor:"#fff", height:"95%"}}>
          <TitleLayer><Title>홍여사에 요청할 일감 유형을 선택해 주세요</Title></TitleLayer>
          <Row style={{flexWrap:"wrap", width:"100%"}}>
            {
              WorkItems.map((data, index)=>(
                <Box onClick={()=>{_handlemenuclick(data.name)}} clickstatus={menu == data.name}>
                  <div><img src={data.img} style={{width:64, height:64}}/></div>
                  <div style={{ fontSize:14}}>{data.name}</div>
                </Box>
              ))
            }
          


          </Row>

          <Button containerStyle={{ fontSize:18}} onPress={_handleworkselect} height={'45px'} width={'300px'} radius={'5px'} bgcolor={'#fffcfc'} color={'#222'} text={'등록하기'}/>


        </Column>



      </Container>
    </>
  );

}

export default PCWorkregistercontainer;


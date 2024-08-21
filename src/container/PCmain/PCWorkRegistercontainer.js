import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";
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
import { GoPlus } from "react-icons/go";


const Container = styled.div`
    background :#f3f3f3;
    height:650px;
    display:flex;
    flex-direction:column;

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
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  height: 100px;
  width: 9%;
  margin-right: 10px;
  margin-bottom: 50px;
  border-radius: 15px;

`
const BoxImg = styled.div`
  background: #f9f9f9;
  border-radius: 100px;
  border: ${({clickstatus}) => clickstatus == true ? ('3px solid #FF7125') :('') };
  padding: 10px;
`
const RegistButton = styled.div`
    height: 50px;
    width: 131px;
    border-radius: 100px;
    background: #FF7125;
    color: #fff;
    margin: 0px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid;
    font-size: 18px;
`
const Label = styled.div`
  font-size: 24px;
  line-height: 26px;
  font-weight :400;



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
  console.log("TCL: PCWorkregistercontainer -> [menu", menu);
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

  function checkworkstep(menu){
    if(menu == WORKNAME.HOMECLEAN){
      return WORKPOLICY.HOMECLEAN;
    }else if(menu == WORKNAME.BUSINESSCLEAN){
      return WORKPOLICY.BUSINESSCLEAN;
    }else if(menu == WORKNAME.MOVECLEAN){
      return WORKPOLICY.MOVECLEAN;
    }else if(menu == WORKNAME.FOODPREPARE){
      return WORKPOLICY.FOODPREPARE;
    }else if(menu == WORKNAME.ERRAND){
      return WORKPOLICY.ERRAND;
    }else if(menu == WORKNAME.GOOUTSCHOOL){
      return WORKPOLICY.GOOUTSCHOOL;
    }else if(menu == WORKNAME.BABYCARE){
      return WORKPOLICY.BABYCARE;
    }else if(menu == WORKNAME.LESSON){
      return WORKPOLICY.LESSON;
    }else if(menu == WORKNAME.PATIENTCARE){
      return WORKPOLICY.PATIENTCARE;
    }else if(menu == WORKNAME.CARRYLOAD){
      return WORKPOLICY.CARRYLOAD;
    }else if(menu == WORKNAME.GOHOSPITAL){
      return WORKPOLICY.GOHOSPITAL;
    }else if(menu == WORKNAME.RECIPETRANSMIT){
      return WORKPOLICY.RECIPETRANSMIT;
    }else if(menu == WORKNAME.GOSCHOOLEVENT){
      return WORKPOLICY.GOSCHOOLEVENT;
    }else if(menu == WORKNAME.SHOPPING){
      return WORKPOLICY.SHOPPING;
    }else if(menu == WORKNAME.GODOGHOSPITAL){
      return WORKPOLICY.GODOGHOSPITAL;
    }else if(menu == WORKNAME.GODOGWALK){
      return WORKPOLICY.GODOGWALK;
    }
  }

 
  return (
    <>
      <Container style={containerStyle}>

        <FlexstartRow style={{background:"#fff", height:'80px', paddingLeft:'15%'}}>
          {
               menu != '' ? (<>
                <img src={Seekimage(menu)} style={{width:40, height:40, marginRight:20}}/>
                <Label>{menu}는 {checkworkstep(menu)}단계만 거치면 일감을 자유롭게 등록할수가 있습니다</Label>
                </>) :(<div>
                <Label>일감을 자유롭게 등록하세요</Label>
                </div>)
          }

            
            
        </FlexstartRow>

        <FlexstartColumn style={{width:'70%', margin:"100px auto 10px", justifyContent:"center"}}>

          <FlexstartRow style={{flexWrap:"wrap", width:"100%"}}>
            {
              WorkItems.map((data, index)=>(
                <Box onClick={()=>{_handlemenuclick(data.name)}} >
                  <BoxImg clickstatus={menu == data.name}><img src={data.img} style={{width:64, height:64}}/></BoxImg>
                  <div style={{ fontSize:14, marginTop:10}}>{data.name}</div>
                </Box>
              ))
            }
          


          </FlexstartRow>

          {/* <Button containerStyle={{ fontSize:18, borderRadius:100, marginTop:30}} onPress={_handleworkselect} height={'50px'} width={'131px'} radius={'5px'} bgcolor={'#FF7125'} color={'#fff'} text={'등록하기'}/> */}

          <RegistButton onClick={_handleworkselect}><GoPlus size={24}/> 등록</RegistButton>


        </FlexstartColumn>



      </Container>
    </>
  );

}

export default PCWorkregistercontainer;


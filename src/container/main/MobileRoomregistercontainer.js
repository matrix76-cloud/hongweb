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


import { ReadWork } from "../../service/WorkService";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { LoadingType } from "../../utility/screen";
import { Column, FlexstartColumn } from "../../common/Column";
import Button from "../../common/Button";
import { WORKNAME, WORKPOLICY } from "../../utility/work";
import { ROOMPOLICY, ROOMSIZE } from "../../utility/room";


const Container = styled.div`




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

`
const Title = styled.div`
  font-size: 18px;
  letter-spacing: -1px;
  line-height: 60px;
  margin-bottom: 30px;
  font-weight :700;

`
// const Box = styled.div`
//   background : #f9f9f9;
//   align-items: center;
//   display: flex;
//   justify-content: center;
//   flex-direction:column;
//   height: 80px;
//   width: 22%;
//   background: #f9f9f9;
//   margin-right: 5px;
//   margin-bottom: 20px;
//   border: ${({clickstatus}) => clickstatus == true ? ('2px solid #ff0000') :('') };
//   border-radius: 15px;

// `

const Box = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  height: 80px;
  width: 22%;
  margin-right: 5px;
  margin-bottom: 40px;


`
const BoxImg = styled.div`
  background: #f9f9f9;
  border-radius: 100px;
  border: ${({clickstatus}) => clickstatus == true ? ('3px solid #FF7125') :('') };
  padding: 10px;
`
const BoxText = styled.div`
  color: ${({clickstatus}) => clickstatus == true ? ('#FF7125') :('#000') };
  font-size:14px;
  margin-top:10px;

`

const RoomItems=[
  {name :ROOMSIZE.SMALL, img:imageDB.roomsize1},
  {name :ROOMSIZE.MEDIUM, img:imageDB.roomsize2},
  {name :ROOMSIZE.LARGE, img:imageDB.roomsize3},
]


const MobileRoomregistercontainer =({containerStyle}) =>  {

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

  const _handleroomselect = () =>{
    if(menu ==''){
      alert("일감 형태를 선택해주세여");
      return;
    }
    navigate("/Mobileregist",{state :{WORKTYPE :menu, WORKTOTAL : totalset}});
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

        <Column style={{ backgroundColor:"#fff", height:"95%", paddingTop:70}}>
          <TitleLayer><Title>대여할 공간을 선택해 주세요</Title></TitleLayer>
          <Row style={{flexWrap:"wrap", margin:"0px 20px", justifyContent:"space-evenly", width:"100%"}}>
            {
              RoomItems.map((data, index)=>(
              <Box onClick={()=>{_handlemenuclick(data.name)}}>
              <BoxImg  clickstatus={menu == data.name}><img src={data.img} style={{width:48, height:48}}/></BoxImg>
              <BoxText clickstatus={menu == data.name}>{data.name}</BoxText>
              </Box>
              ))
            }
          


          </Row>

          <Button containerStyle={{ fontSize:16}} onPress={_handleroomselect} height={'44px'} width={'300px'} radius={'5px'} bgcolor={'#FF7125'} color={'#fff'} text={'등록하기'}/>
    

        </Column>



      </Container>
    </>
  );

}

export default MobileRoomregistercontainer;


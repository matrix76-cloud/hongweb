import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import { WorkIcon, workColor } from "../../utility/workIcon";
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


const Container = styled.div`

    height:750px;


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
  background: ${({ $c }) => $c || "var(--icon-bg)"};
  border-radius: 100px;
  /* 선택 링 — 원이 주황(집안일)일 때도 보이게 흰 틈을 두고 감싼다 */
  box-shadow: ${({$clickstatus}) => $clickstatus == true ? ('0 0 0 2px var(--surface), 0 0 0 5px #FF7125') : ('none')};
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const BoxText = styled.div`
  color: ${({$clickstatus}) => $clickstatus == true ? ('#FF7125') :('#000') };
  font-size:14px;
  margin-top:10px;

`


// 아이콘은 utility/workIcon.jsx 공용 매핑 (형 리뷰 2026-08-14 — 원색 png 전부 교체)
// 요리비법(RECIPETRANSMIT)은 폐지된 항목이라 목록에서 뺐다 (CORE.md)
const WorkItems=[
  {name : WORKNAME.HOMECLEAN},
  {name :WORKNAME.BUSINESSCLEAN},
  {name :WORKNAME.MOVECLEAN},
  {name :WORKNAME.FOODPREPARE},
  {name :WORKNAME.ERRAND},
  {name :WORKNAME.GOOUTSCHOOL},
  {name :WORKNAME.BABYCARE},
  {name :WORKNAME.LESSON},
  {name :WORKNAME.PATIENTCARE},
  {name :WORKNAME.CARRYLOAD},
  {name :WORKNAME.GOHOSPITAL},
  {name :WORKNAME.GOSCHOOLEVENT},
  {name :WORKNAME.SHOPPING},
  {name :WORKNAME.GODOGHOSPITAL},
  {name :WORKNAME.GODOGWALK},
]


const MobileWorkregistercontainer =({containerStyle}) =>  {

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
    navigate("/Mobileregist",{state :{WORKTYPE :menu, WORKTOTAL : totalset}});
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

        <Column style={{ backgroundColor:"var(--surface)", height:"95%"}}>
          <TitleLayer><Title>홍여사에 요청할 일감 유형을 선택해 주세요</Title></TitleLayer>
          <Row style={{flexWrap:"wrap", margin:"5px 10px"}}>
            {
              WorkItems.map((data, index)=>(
                <Box onClick={()=>{_handlemenuclick(data.name)}}>
                  <BoxImg  $clickstatus={menu == data.name} $c={workColor(data.name)}><WorkIcon name={data.name} size={26} color="#fff"/></BoxImg>
                  <BoxText $clickstatus={menu == data.name}>{data.name}</BoxText>
                </Box>
              ))
            }
          


          </Row>

          <Button containerStyle={{ fontSize:16}} onPress={_handleworkselect} height={'44px'} width={'300px'} radius={'5px'} bgcolor={'#FF7125'} color={'#fff'} text={'등록하기'}/>


        </Column>



      </Container>
    </>
  );

}

export default MobileWorkregistercontainer;


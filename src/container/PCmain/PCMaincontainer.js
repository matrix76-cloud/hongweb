import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";

const Container = styled.div`
    margin-top:30px;
    height:1000px;
`
const style = {
  display: "flex"
};


const HongworkItems= ['','','','','','','','','','','',
'','','','','','','','','','','',
'','','','','','','','','','','',
'','','','','','','','','','','',
]

const PCMaincontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [popupstatus1, setPopupstatus1] = useState(false);
  const [popupstatus2, setPopupstatus2] = useState(false);
  const [popupstatus3, setPopupstatus3] = useState(false);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  /**
   * 팝업 노출여부를 확인 한다(hongpopup1, hongpopup2, hongpopup3 를 localstorage에서 가져온다
   * TODO : 홍여사 요청 업무를 서버에서 가져와야 한다
   * TODO : 임시적으로 배열을 생성 하자  HongworkItems
  
   * 
   */
  useEffect(()=>{
    const now = moment();

    async function FetchData(){
      let time = moment(now).subtract(1, "days").unix();
      const popupdate1 = window.localStorage.getItem("hongpopup1");
      console.log("popupdata", popupdate1/1000, time);
      if (popupdate1 /1000 < time) {
        setPopupstatus1(true);
        console.log("TCL: FetchData -> ",popupstatus1 );
      }

      const popupdate2 = window.localStorage.getItem("hongpopup2");
      console.log("popupdata", popupdate2/1000, time);
      if (popupdate2 /1000 < time) {
        setPopupstatus2(true);
        console.log("TCL: FetchData -> ",popupstatus2 );
      }

      const popupdate3 = window.localStorage.getItem("hongpopup3");
      console.log("popupdata", popupdate3/1000, time);
      if (popupdate3 /1000 < time) {
        setPopupstatus3(true);
        console.log("TCL: FetchData -> ",popupstatus3 );
      }


    } 
    FetchData();
  }, [])
  useEffect(()=>{

  },[refresh])

  const popupcallback1 = async () => {
    setPopupstatus1(!popupstatus1);
  };

  const popupcallback2 = async () => {
    setPopupstatus2(!popupstatus2);
  };

  const popupcallback3 = async () => {
    setPopupstatus3(!popupstatus3);
  };
  return (

    <Container style={containerStyle}>

      {popupstatus1 == true ? (
        <PcAdvertisePopup callback={popupcallback1} top={'53%'} left={'20%'} height={'640px'} width={'430px'} image={imageDB.sample14}></PcAdvertisePopup>
      ) : null}

      {popupstatus2 == true ? (
        <PcAdvertisePopup callback={popupcallback2} top={'40%'}  left={'45%'} height={'550px'} width={'400px'} image={imageDB.sample11}></PcAdvertisePopup>
      ) : null}

      {popupstatus3 == true ? (
        <PcAdvertisePopup callback={popupcallback3} top={'60%'}  left={'65%'} height={'450px'} width={'270px'} image={imageDB.sample12}></PcAdvertisePopup>
      ) : null}


      <div style={{display:"flex", flexDirection:"column", margin: "0px auto",width: '90%'}}>

      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between",
        height: '60px',padding: '0px 20px',alignItems: 'center'}}>
        <div style={{fontSize: '20px',fontWeight: 600,lineHeight: '32px'}}>확인된 일감</div>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <img src={imageDB.sample9} width={30} height={30} style={{borderRadius:50}}  />
            <div>경기 남양주시 다산동 6234</div>
          </div>
          <div style={{display:"flex", flexDirection:"row", alignItems:"center", backgroundColor:"#ededed",
            padding: "10px 10px",
            marginLeft: "10px",
            borderRadius: "10px"}}>
            <img src={imageDB.sample10} width={20} height={20} style={{borderRadius:50}} />
            <div>현재 위치 재검색</div>
            
          </div>
        </div>

      </div>
      <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
      {
          HongworkItems.map((data, index)=>(
            <PCWorkItem key={index} />
          ))
        }
      </div>

      
      </div>
   


    </Container>
  );

}

export default PCMaincontainer;


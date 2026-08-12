import React, { Fragment, useContext, useEffect, useLayoutEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import Image from "../../../common/Image";
import { GoPlus } from "react-icons/go";
import { MOBILEMAINMENU } from "../../../utility/screen";
import { regionLabel } from "../../../utility/geo";
import { FaChevronRight } from "react-icons/fa6";
import { PiMegaphoneBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useSleep } from "../../../utility/common";
import localforage from 'localforage';
import MobileSuccessPopup from "../../../modal/MobileSuccessPopup/MobileSuccessPopup";
import MobileLocationSheet from "../../../modal/MobileLocationSheet/MobileLocationSheet";
const Container = styled.div``;

const LogoText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Pretendard-SemiBold';
    font-weight:600;
    padding-top: 5px;
    font-size: 20px;
    padding-left: 10px;
    color :#000;

`



const Mobileheader = ({callback, registbtn, name}) => {

  const {value} = useSelector((state)=> state.menu);
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);
  const [refresh, setRefresh] = useState(1);
  const [registbutton, setReigstbutton] = useState(false);
  const [address_name, setAddress_name] = useState(user.address_name);

  const [locationsheet, setLocationsheet] = useState(false);

  useEffect(() => {
    setAddress_name(address_name);
    setReigstbutton(registbutton);
  }, [refresh]);


  useLayoutEffect(()=>{
    localforage.getItem('userconfig')
    .then(function(value) {
      console.log("TCL: listener -> GetItem value", value.address_name)
      setAddress_name(value.address_name);
    })
    .catch(function(err) {

    });

  
    setRefresh((refresh) => refresh +1);
  },[value])

  useLayoutEffect(()=>{
    console.log("TCL: Mobileheader -> [value]", [value],user)
    setAddress_name(user.address_name);
    setRefresh((refresh) => refresh +1);
  },[useDispatch])




  // 위치 영역 전체가 시트 진입점 (seekone 방식) — 재검색·지도지정은 시트 안에서 고른다
  const _handlelocation = () =>{
    setLocationsheet(true);
    setRefresh((refresh) => refresh +1);
  }

  // 시트에서 '현재 위치로 재검색' 성공 → 지역·좌표를 갱신하고 저장
  const _handlerelocated = ({ label, lat, lng }) =>{
    user.address_name = label;
    user.latitude = lat;
    user.longitude = lng;
    localforage.setItem('userconfig', user).catch(function(err){
      console.error('Error saving userconfig:', err);
    });
    dispatch(user);
    setAddress_name(label);
    setRefresh((refresh) => refresh +1);
  }

  const _handleAI = async() =>{
    navigation("/Mobilesearch" ,{state :{search :""}});
    setRefresh((refresh) => refresh +1);
  }

  /* 공지사항 (형 리뷰 2026-08-12) */
  const _handleNotice = () =>{
    navigation("/Mobilenotice");
  }


/**
 * 마우스를 움직일때 사라지고 없어지고 한다
 * ! id 값 : oneheader, twohenader
 */
useEffect(() => {
  const handleShowButton = () => {

    if (window.scrollY > 10) {
      setReigstbutton(true);
    } else {
      setReigstbutton(false);
    }
    setRefresh((refresh)=> refresh +1);
  };

  window.addEventListener("scroll", handleShowButton);

  return () => {
    window.removeEventListener("scroll", handleShowButton);
  };
}, []);

  return (
    <Container
      id="header"
      style={{
        zIndex: 999,
        position: "fixed",
        background: "var(--surface)",
        width: "100%",
        height: "50px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontFamily :"Pretendard-SemiBold"
  
      }}
    >


     

        <div style={{marginLeft:15, display:"flex",color:"var(--text)", fontSize:"16px",
        display:"flex", justifyContent:"flex-start", alignItems:"center",fontFamily:"Pretendard-SemiBold",
        fontWeight:400}}>
          <img src={imageDB.logo} style={{width:28, height:28}}/>

          {/* 핀·지역·화살표가 한 덩어리로 위치 시트를 연다 (seekone 방식) */}
          <div onClick={_handlelocation}
            style={{display:"flex", alignItems:"center", marginLeft:5, cursor:"pointer"}}>
            <img src={imageDB.mappin} style={{width:20, height:20}}/>
            <div style={{ margin:"0 6px 0 2px"}}>{regionLabel(address_name)}</div>
            <FaChevronRight />
          </div>

          {
            locationsheet == true && (
              <MobileLocationSheet
                open={locationsheet}
                onClose={()=>{ setLocationsheet(false); setRefresh((refresh)=> refresh +1); }}
                onRelocated={_handlerelocated}
              />
            )
          }

        </div>

     
        <div style={{display:"flex", flexDirection:"row", alignItems:"center",paddingRight:20}} >

        {/* 채팅 아이콘·알림 배지 제거 — 하단 탭에 채팅이 이미 있고 배지 숫자는 가짜였다 (형 리뷰 2026-08-12) */}
        <img src={imageDB.search} width={24} onClick={_handleAI} style={{paddingRight:14, cursor:"pointer"}}/>
        {/* 공지사항 (형 리뷰 2026-08-12) */}
        <PiMegaphoneBold size={23} color="#131313" onClick={_handleNotice} style={{cursor:"pointer"}} aria-label="공지사항"/>
        </div>
    


    
    </Container>
  );
};

export default Mobileheader;

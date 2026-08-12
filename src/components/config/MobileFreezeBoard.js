
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState, useMemo, Suspense, memo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { UserContext } from "../../context/User";

import "./mobile.css"
import { imageDB } from "../../utility/imageData";
import LottieAnimation from "../../common/LottieAnimation";

import { Column, FlexstartColumn } from "../../common/Column";
import { DataContext } from "../../context/Data";

import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../../screen/css/common";
import { PCCOMMNUNITYMENU } from "../../utility/screen";
import { ReadRECIPE } from "../../service/RecipeService";

import { shuffleArray } from "../../utility/common";
import { getNewDate } from "../../utility/date";
import LazyImage from "../../common/LasyImage";

import { FiPlus } from "react-icons/fi";
import ButtonEx from "../../common/ButtonEx";
import Empty from "./Empty";
import MobileRecipeadd from "../../modal/MobileRecipeadd";
import { ReadFREEZE, UpdateFREEZECHECKid } from "../../service/FreezeService";


import { OrbitControls, TransformControls, useAnimations } from "@react-three/drei";
import { useRef } from "react";




import { useGLTF } from "@react-three/drei";
import { Environment } from '@react-three/drei';

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { MdDeleteForever } from "react-icons/md";

import { FBXLoader } from "three-stdlib";
import { CiSearch } from "react-icons/ci";
import { animations } from "framer-motion";
import { Text } from '@react-three/drei';
import Alert from "../../common/Alert";

import { Toaster, toast } from 'sonner';
import { Recipemenus } from "../../store/jotai";
import { useAtom } from "jotai";
import KakaoShare from "../KakaoShare";
import { useMediaQuery } from "react-responsive";
import { getFontSize, isIOS } from "../../utility/fontsize";
import HongButton from "../HongButton";
import { LIFEMENU } from "../../utility/life";


const formatter = buildFormatter(koreanStrings); 


const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
`;


const HEADER_HEIGHT = 47;

const Container = styled.div`
  overflow-y: auto;
  padding-bottom:0px;
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;

`;





const style = {
  display: "flex"
};



const BoxLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const BoxItem = styled.div`
  width : 49%;
  height : 100%; 
  margin-bottom:40px;

`
const FreezeItem = styled.div`
  width : 100%;
  height : 100%; 
  margin-bottom:40px;
  display : flex;
  flex-direction: row;

`

const FreezeBoxLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const FreezeBoxItem = styled.div`
  width : 49%;
  background: ${({enable})=> enable== true ? ('bisque') :('#f9f9f9')};
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction:column;
  border-radius: 5px;
  margin-bottom:5px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:active {

    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }


`

const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}
const MapbtnStyle={
  background: "#ff",
  padding: "0px 20px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '50px',
  color: '#333',
  border :" 1px solid #c3c3c3",
  height: '38px',
  fontSize:'16px',
  fontFamily:'Pretendard-SemiBold',
  width:'30%',
  margin :'20px auto 0px',
}



const RecommendTitle = styled.div`
  font-family: 'Pretendard-Bold';
  margin: 20px 0px;

`
const Recipename = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px;
`
const RecommendButton = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(12)}px;
  color : #999;
`
const AddButton = styled.div`

  font-size: ${() => getFontSize(16)}px;
  width:48%;
  height:50px;
  color : #FFF;
  background :#FE6625;
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius :5px;
  cursor: pointer;
  &:active {
  transform: scale(0.95); /* 눌렀을 때 크기 조정 */

  }

`

const LeftButton = styled.div`
  font-size: ${() => getFontSize(16)}px;
  width: 48%;
  color : #FE6625;
  background :#FFF0E9;
  height:50px;
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius :5px;
  cursor: pointer;
  &:active {
  transform: scale(0.95); /* 눌렀을 때 크기 조정 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }
`

const SearchButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;


  background: linear-gradient(to right, #FFA94D, #FF7A3E);
  color: white;
  width : 50%;
  border: none;
  borderRadius: 24px;
  padding: 12px 24px;
  fontSize: () => getFontSize(16)px;
  fontWeight: 600;

  boxShadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
`


const Recipetip = styled.div`
font-size: ${() => getFontSize(12)}px;
font-family: 'Pretendard-Light';
`
const Recipereview = styled.div`
font-size: ${() => getFontSize(12)}px;
font-family: 'Pretendard-Light';
margin-top:10px;
`

const Tag1 = styled.div`

font-size: ${() => getFontSize(12)}px;
background: #fff;
color: #070606;
display: flex;
justify-content: center;
align-items: center;
border-radius: 10px;
`
const Tag2= styled.div`

  font-size: ${() => getFontSize(12)}px;
  background: #fff;
  color: #070606;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-left:5px;
`

const EmptyLine = styled.div`
  height: 2px;
  background: #ededed;
  margin: 20px 0px;

`
const Dday = styled.div`
  font-size: ${() => getFontSize(10)}px;
  background-color : ${({out}) => out == true ? ('#ff7e19') :('#fff')};
  border-radius: 20px;
  border : ${({out}) => out == true ? ('1px solid #ff7e19') :('1px solid #ff7e19')};
  color : ${({out}) => out == true ? ('#fff') :('#ff7e19')};

  padding: 5px 10px;
  margin-left: 10px;
  font-family: 'Pretendard-Bold';
`

const Alarm = styled.div`

  font-size: ${() => getFontSize(10)}px;
  border: 1px solid #1982ff;
  background-color : #1982ff;
  border-radius: 20px;
  color: #fff;
  padding: 5px 10px;
  margin-left: 10px;
  font-family: 'Pretendard-Bold';


`
const Freezename = styled.div`
  font-size: ${() => getFontSize(16)}px;

`
const Property = styled.div`
  font-size: ${() => getFontSize(10)}px;

`

const MenuButton = styled.div`
  background: ${({enable})=> enable == true ? ('#ff7e19'):('#fff')};
  color: ${({enable})=> enable == true ? ('#fff'):('#131313')};
  padding: 5px;
  border: 1px solid #ededed;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px;
  width: 50px;
  display: flex;
  justify-content: center;

`
const CheckLayer = styled.div`
  display : flex;
  width :20px;
  height :15px;
`

const ShareLayer = styled.div`
    position: fixed;
    top:10px;
    font-size: ${() => getFontSize(22)}px;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
`

const FreezeContentDefineItems = [
  // 첫 줄
  { NAME: "", POSITION: [-0.3, 0.60, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [-0.1, 0.60, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [0.1, 0.60, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [0.3, 0.60, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },

  // 두 번째 줄 → ⬇ 0.27
  { NAME: "", POSITION: [-0.3, 0.47, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [-0.1, 0.47, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [0.1, 0.47, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [0.3, 0.47, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },

  // 세 번째 줄 (이미 적용됨)
  // { NAME: "", POSITION: [-0.3, 0.14, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  // { NAME: "", POSITION: [-0.1, 0.14, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  // { NAME: "", POSITION: [0.1, 0.14, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  // { NAME: "", POSITION: [0.3, 0.14, 0.2], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
];




const FreezeContentDefineItems2 = [
  // 첫 줄
  { NAME: "", POSITION: [-0.3, 0.610, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [-0.1, 0.610, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [0.1, 0.610, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [0.3, 0.610, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },

  // 두 번째 줄 → ⬇ 0.28
  { NAME: "", POSITION: [-0.3, 0.480, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [-0.1, 0.480, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [0.1, 0.480, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  { NAME: "", POSITION: [0.3, 0.480, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },

  // 세 번째 줄 (이미 적용됨)
  // { NAME: "", POSITION: [-0.3, 0.15, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  // { NAME: "", POSITION: [-0.1, 0.15, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  // { NAME: "", POSITION: [0.1, 0.15, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
  // { NAME: "", POSITION: [0.3, 0.15, 0.3], ENDDATE: "", INDEX: "", STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
];




// const FreezeContentDefineItems = [
//   { NAME: "", POSITION: [-0.3, 0.6, 0.1], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.1, 0.6, 0.1], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.1, 0.6, 0.1], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.3, 0.6, 0.1], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.3, 0.68, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.1, 0.68, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.1, 0.68, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.3, 0.68, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.3, 0.45, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.1, 0.45, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.1, 0.45, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.3, 0.45, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
// ];
// const FreezeContentDefineItems2 = [
//   { NAME: "", POSITION: [-0.3, 0.58, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.1, 0.58, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.1, 0.58, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.3, 0.58, 0.2], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.3, 0.66, 0.3], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.1, 0.66, 0.3], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.1, 0.66, 0.3], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.3, 0.66, 0.3], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.3, 0.43, 0.3], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [-0.1, 0.43, 0.3], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.1, 0.43, 0.3], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
//   { NAME: "", POSITION: [0.3, 0.43, 0.3], ENDDATE: "", INDEX: '', STARTDATE: "", REALNAME: "", ALARM: false, FREEZE_ID: "", check: false },
// ];

const DetailButton = styled.div`
  position: absolute;
  top: 58px; // ✅ 더 아래로 내려줌
  right: 12px;
  background-color: #FE6625;
  color: #fff;
  font-size: ${() => getFontSize(13)}px !important;
  font-family: 'Pretendard-Medium';
  padding: 6px 12px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 1000;
  opacity: 0.92;
`;

const MobileFreezeBoard =memo(({containerStyle}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */

  const [searchParams] = useSearchParams();
  const [shareid, setShareid] = useState(searchParams.get('id'));// URL 쿼리에서 id 가져오기

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [refresh2, setRefresh2] = useState(1);

  const [loading, setLoading] = useState(true);
 
  const [adjustitem, setAdjustitem] = useState({});

  const [contentItems, setContentItems] = useState(FreezeContentDefineItems);


  const [recipeaddpopup, setRecipeaddpopup] = useState(false);
  const [recipeadjustpopup, setRecipeadjustpopup] = useState(false);

  const [isAnySelected, setIsAnySelected] = useState(false);

 
  const [visibleImages, setVisibleImages] = useState(10);


  const [recipemenus, setRecipemenus] = useAtom(Recipemenus);


  useEffect(() => {
    const selected = data.freezeitems.some(item => item.check === true);
    setIsAnySelected(selected);
  }, [data.freezeitems, refresh]);


  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setVisibleImages((prevVisibleImages) => prevVisibleImages + 10);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);




  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);



  const _handlemenu= ()=>{
    navigate("/Mobileconfigcontent", { state: { NAME: LIFEMENU.BOARD, TYPE: "" } });

  }


  const _handleFreeAdjustClick = () => {

    console.log("Adjust", data.freezeitems);


    let checkcount = 0;
    data.freezeitems.map((value, index) => {
      
      if (value.check == true) {
        checkcount++;
        setAdjustitem(value);
      }

    })


    
    if (checkcount == 0) {

      toast.error("수정하거나 삭제할 식재료를 클릭하여 선택하세요", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })

      return;
    }

    if (checkcount > 1) {

      toast.error("수정하거나 삭제할 식재료를 하나만 클릭하여 선택하세요", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })

      return;
    }


    setRecipeadjustpopup(true);
    setRefresh((refresh) => refresh +1);
  }

  async function FetchData(type){

 
    

    let USERS_ID = '';
    
    if (shareid !== null) {
      USERS_ID = shareid;
    } else {
      USERS_ID = user.USERS_ID;
    }
  


    const freezeitemsTmp = await ReadFREEZE({USERS_ID});

    data.freezeitems = FreezeContentDefineItems;
    datadispatch(data);
    

    

    contentItems.map((data)=>{
      data.NAME = '';
    })

    if(freezeitemsTmp != -1){

      freezeitemsTmp.map((data,index = 0)=>{


        if(data.NAME != undefined){
          contentItems[index].NAME = data.NAME;
  
          if(data.ENDDATE != ''){
            contentItems[index].NAME += "\n";
            contentItems[index].NAME += DDayCheck(data.ENDDATE);
            contentItems[index].REALNAME = data.NAME;
  
    
          }
          contentItems[index].ENDDATE = data.ENDDATE;
          contentItems[index].FREEZE_ID = data.FREEZE_ID;
          contentItems[index].STARTDATE = data.STARTDATE; 
          contentItems[index].ALARM = data.ALARM;
        }

      })
      setContentItems(contentItems);
    }


    setLoading(false);
    setRefresh((refresh) => refresh+1);
  }
  
  useEffect(()=>{
    FetchData();
  }, [])

  const _handleRecipeSearch = () =>{

    let filteSearchKeywordAry = [];

    let filterItems= data.freezeitems;

    filterItems.map((data)=>{
      if(data.check == true){
        filteSearchKeywordAry.push(data.REALNAME);
      }
      data.check = false;
    })

    if (filteSearchKeywordAry.length == 0) {

      return (
        toast.error("냉장고에서 재료를 클릭하여 선택하세요", {
          duration: 1000,
          style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
        })
      )
    }


    if(filteSearchKeywordAry.length > 2){

      toast.error("재료선택은 최대 두개까지만 선택하세요", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })

      return;
    }

    setRecipemenus(filteSearchKeywordAry);
    navigate("/Mobilefreezerecipe", {state : {filterary: filteSearchKeywordAry, name:"나의 냉장고 레시피"}});

    setRefresh((refresh) => refresh + 1);
  }


  async function RefreshFreezeData(type){

    const USERS_ID = user.USERS_ID;
    const freezeitemsTmp = await ReadFREEZE({USERS_ID});


    data.freezeitem= {};
    data.freezeitems = FreezeContentDefineItems;
    datadispatch(data);

    FreezeContentDefineItems.map((data)=>{
      data.NAME = '';
    })

    if(freezeitemsTmp != -1){
      freezeitemsTmp.map((data,index)=>{
        FreezeContentDefineItems[index].NAME = data.NAME;

        if(data.ENDDATE != ''){
          FreezeContentDefineItems[index].NAME += "\n";
          FreezeContentDefineItems[index].NAME += DDayCheck(data.ENDDATE);
          FreezeContentDefineItems[index].REALNAME = data.NAME;

        }
        FreezeContentDefineItems[index].STARTDATE = data.STARTDATE;
        FreezeContentDefineItems[index].ENDDATE = data.ENDDATE;
        FreezeContentDefineItems[index].FREEZE_ID = data.FREEZE_ID;
        FreezeContentDefineItems[index].ALARM = data.ALARM;

      })
    }
    setContentItems(FreezeContentDefineItems);


    setLoading(false);
    setRefresh((refresh) => refresh+1);
  }


  function DDayCheck (lastdate){
    const today = new Date();
    const targetDate = new Date(lastdate); // 목표 날짜를 지정하세요
    
    // 두 날짜의 차이를 밀리초 단위로 계산
    const diffInTime = targetDate.getTime() - today.getTime();
    
    // 밀리초를 일(day)로 변환
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

    if(diffInDays < 0){
      return diffInDays * -1 + "일지남";
    }else{
      return "D - " +diffInDays +"일";
    }

  }


  const MobileRecipeAddCallback = (data) => {
    // 식재료가 추가 되었습니다

    if (data == 'add') {
      toast.error("식재료가 추가 되었습니다", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })
    }


    setRecipeaddpopup(false);
    RefreshFreezeData();
    setRefresh((refresh) => refresh +1);
  }

  const MobileRecipeAdjustCallback = (type) => {
    
    if (type == 'delete') {
      //식재료가 삭제 되었습니다
      toast.info("식재료가 삭제 되었습니다", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })
    } else if(type == 'adjust') {
      //식재료가 수정 되었습니다.
      toast.info("식재료가 수정 되었습니다", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })
    }


    



    setAdjustitem({});
    setRecipeadjustpopup(false);
    RefreshFreezeData();
    setRefresh((refresh) => refresh +1); 
  }
  const _handleFilterAdd = (dataitem, type) => {

    let filterItems= data.freezeitems;


    if(type == true){
      const FindIndex = filterItems.findIndex(x=>x.REALNAME == dataitem);
      filterItems[FindIndex].check =true;
       
      data.freezeitem= filterItems[FindIndex];
    }else{
      const FindIndex = filterItems.findIndex(x=>x.REALNAME == dataitem);
      filterItems[FindIndex].check =false;
      data.freezeitem= {};
    }



    data.freezeitems = filterItems;

    datadispatch(data);


    
  }

  const _handleadd = () =>{

    let Freezecount = 0;
    contentItems.map((data)=>{
      if(data.NAME != ''){
        Freezecount++;
      }
    })
    if(Freezecount ==12){
  
      toast.error("냉장고가 꽉 찾습니다", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })

      return;
    }
    setRecipeaddpopup(true);
    setRefresh((refresh) => refresh +1);
  }

  const Fridge = () => {
    const { animations, scene } = useGLTF("/models/fridge.glb");
    const { actions } = useAnimations(animations, scene);
    const actionRef = useRef(null);
    const [hasPlayed, setHasPlayed] = useState(false); // ✅ animation 실행 여부 추적

    useEffect(() => {
      if (animations.length > 0) {
        actionRef.current = actions['Animation'];
        actionRef.current.setLoop(THREE.LoopOnce);
        actionRef.current.clampWhenFinished = true;
      }
    }, [animations]);

    const handleClick = () => {
      if (hasPlayed) return; // ✅ 이미 한 번 실행했다면 무시
      if (actionRef.current) {
        actionRef.current.reset().play();
        actionRef.current.timeScale = 0.3;
        setHasPlayed(true); // ✅ 재실행 방지 플래그
      }
    };

    return (
      <group>
        <primitive
          object={scene}
          position={[0, -1.05, 0]}
          onClick={handleClick}
          castShadow
        />
      </group>
    );
  };
  
  
  function Model({ url, position }) {
    const { scene } = useGLTF(url);
    return (
      <>
          <primitive object={scene} scale={0.4} position={position} />
          {/* <Text text="Hello World" fontSize={0.5} color="white" /> */}      
      </>


    )
  }

  function TextInScene({ position, content }) {
    const [color, setColor] = useState("black");
    const [refresh, setRefresh] = useState(1);
    const [selected, setSelected] = useState(false);

    useEffect(() => {
      setColor(color);
    }, [refresh]);

    const _handleClick = () => {
      const freezeitems = data.freezeitems;
      const lines = content.split('\n');
      const FindIndex = freezeitems.findIndex(x => x.REALNAME === lines[0]);

      if (FindIndex === -1 || !freezeitems[FindIndex]) {
        console.warn("❌ 해당 재료를 freezeitems에서 찾지 못했습니다:", lines[0]);
        return;
      }

      const isNowSelected = color === "black";
      freezeitems.forEach(f => f.check = false); // 하나만 선택
      freezeitems[FindIndex].check = isNowSelected;

      setColor(isNowSelected ? "black" : "black");
      setSelected(isNowSelected);

      data.freezeitems = [...freezeitems];
      datadispatch(data);
      setRefresh(r => r + 1);
    };

    return (
      <Text
        position={position}
        fontSize={selected ? 0.025 : 0.025}
        fontWeight={selected ? 'normal' : 'normal'}
        color={color}
        maxWidth={1}
        outlineColor={selected ? '#00000000' : '#00000000'}
        outlineWidth={selected ? 0 : 0}
        onClick={_handleClick}
      >
        {content}
      </Text>
    );
  }


  const BoxWithText = ({ content, position, position2, dataItem, callback, index }) => {
    const [isSelected, setIsSelected] = useState(false);
    const freezeitems = data.freezeitems;

    // const handleClick = () => {
    //   const FindIndex = freezeitems.findIndex(x => x.REALNAME === dataItem.REALNAME);

    //   // 🛡️ 방어막: 일치 항목 없으면 중단
    //   if (FindIndex === -1 || !freezeitems[FindIndex]) {
    //     console.warn("❌ freezeitems에서 해당 항목을 찾을 수 없음:", dataItem.REALNAME);
    //     return;
    //   }

    //   const nowChecked = !freezeitems[FindIndex].check;

    //   freezeitems[FindIndex].check = nowChecked;
    //   data.freezeitem = nowChecked ? freezeitems[FindIndex] : {};
    //   data.freezeitems = freezeitems;

    //   setIsSelected(nowChecked);
    //   datadispatch(data);
    // };

    const meshRef = useRef();

    const textTexture = useMemo(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext("2d");

      context.fillStyle = isSelected ? "#FFF0E9" : "white";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = "22px Pretendard-Bold";
      context.fillStyle = "black";
      context.textAlign = "center";
      context.textBaseline = "middle";

      const lines = content.split('\n');
      const lineHeight = parseInt("80px Pretendard-Bold", 10) * 3;
      const centerY = 512 / 2 - (lines.length * lineHeight) / 2;

      lines.forEach((line, index) => {
        const y = centerY + index * lineHeight + 120;
        context.fillText(line, 512 / 2, y);
      });

      return new THREE.CanvasTexture(canvas);
    }, [content, isSelected]);

    return (
      <>
        <TextInScene position={position2} content={content} />
        <Model url={`/models/fridgebox${index + 1}.glb`} position={position} map={textTexture}  />
      </>
    );
  };

  const FridgeScene = memo(({}) => {

    const controlsRef = useRef();
    return (

      <Canvas 
      dpr={[1, 2]} // 디스플레이 해상도 최적화
      frameloop="demands" // 필요할 때만 렌더링
      gl={{ antialias: true }} // 부드러운 렌더링
      orthographic // 정사각형 카메라 사용
      camera={{
        zoom: 280, // 줌 레벨 고정
        position: [0, 0, 8], // 카메라 위치 (냉장고 앞)
        near: 1,
        far: 280,
      }}
     
        style={{
          background: "#fff",
          height: "80vh", // ✅ 뷰포트의 80% 높이
          marginBottom: 0, // ✅ 추가
          paddingBottom: 0, // ✅ 추가
          width: "100%",}}
      >

      {/* 환경 조명: 부드러운 배경광 */}
      <ambientLight intensity={0.1} />


      <Environment files="/models/venice_sunset_1k.hdr" />

      {contentItems.map((data, index) =>(
        <>
          {
            data.NAME != '' &&
              <>
                <BoxWithText content={data.NAME} position2={FreezeContentDefineItems2[index].POSITION} index={index} position={data.POSITION} dataItem={data} callback={_handleFilterAdd}/>
              </>
          }  
        </>
      ))}
      <Fridge />

      {/* <MovingCamera/> */}
        <OrbitControls ref={controlsRef} 
          enableRotate={true} // ✅ 회전 허용
          enableZoom={false}
          enablePan={true}  // ✅ 이동 허용
          screenSpacePanning={true}
          rotateSpeed={0.4}
          panSpeed={0.5}/>
      </Canvas>


    );
  });


  const MainData = () => {
    return ( 
      <Container>
        <Suspense fallback={<div></div>}>
          <FridgeScene />
        </Suspense>
      </Container>
    )
  }


  return (

    <Container style={containerStyle} >     
      <DetailButton onClick={_handlemenu}>자세히 보기</DetailButton>
      <MainData />
    </Container>
  );

});


export default MobileFreezeBoard;


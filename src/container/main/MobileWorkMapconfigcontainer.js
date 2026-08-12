
import React, {Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../../common/Button";
import { Column, FlexstartColumn } from "../../common/Column";
import { FlexstartRow, Row } from "../../common/Row";
import MobileGpsLaw from "../../components/MobileGpsLaw";
import MobilePrivacyLaw from "../../components/MobilePrivacyLaw";
import MobileUseLaw from "../../components/MobileUseLaw";
import UseLaw from "../../components/UseLaw";
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";

import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../api/config";
import { getuserInfobyusers_id, get_phonenumber, get_userInfoForUID, Read_userphone, Update_addrbyusersid, Update_addrItemsbyusersid, Update_addrsbyusersid, Update_userdevice, Update_userinfobyusersid } from "../../service/UserService";
import { useSleep } from "../../utility/common";
import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';
import DaumPostcode from "react-daum-postcode";
import { distanceFunc, KeywordAddress } from "../../utility/region";
import { DefaultReadWork, findWorkAndFunctionCallFromCurrentPosition, ReadAllWork, ReadWork } from "../../service/WorkService";
import Axios from "axios";
import LottieAnimation from "../../common/LottieAnimation";
import { findRoomAndFunctionCallFromCurrentPosition, ReadRoom } from "../../service/RoomService";
import { CHECKDISTANCE } from "../../utility/screen";
import { getFontSize } from "../../utility/fontsize";
const Container = styled.div`
  display : flex;
  flex-direction: column;
  align-items:center;
  width :95%;
  margin : 0 auto;
  background : #FFF;
  padding-top:70px;

`
const Label = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-left: 20px;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(22)}px;
  color: #131313;


`
const style = {
  display: "flex"
};



const SubText = styled.div`
  width: 100%;
  padding-left: 20px;
  margin-top: 10px;
  color: #131313;
  margin-bottom:10px;
`
const Inputstyle ={
  border: '1px solid #C3C3C3',
  background: '#fff',
  width: '90%',
  borderRadius:'5px',
  fontSize:'16px',
  padding :'12px'

}

const CodeInputstyle ={
  border: '1px solid #C3C3C3',
  background: '#fff',
  width: '90%',
  borderRadius:'5px',
  fontSize:'16px',
  padding :'12px',
  marginTop:"20px"

}
const ReqButton = styled.div`
  height: 44px;
  width: 90%;
  margin : 20px auto;
  border-radius: 4px;
  background: ${({enable}) => enable == true ? ('#FF7125') :('#dbdada')};
  color:  ${({enable}) => enable == true ? ('#fff') :('#999')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${() => getFontSize(18)}px;
  font-family:"Pretendard-SemiBold";
`
const BoxLayer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-left: 20px;
  min-height: calc(70vh);
  max-height: calc(70vh);
  height: 100%;
  overflow-y: auto;

`
const BoxItem = styled.div`
  height: 20px;
  display: flex;
  justify-content: space-between;
  padding: 20px 0px;
  border-bottom: 1px solid #ededed;
  width: 100%;
  font-size: ${() => getFontSize(14)}px;
  color: #131313;
`
const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const MobileWorkMapconfigcontainer =({containerStyle, TYPE}) =>  {

  const [address, setAddress] = useState("");

  const [newpopup, setNewpopup] = useState(false);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const [addressitems, setAdderssitems] = useState([]);
  const [selectaddress, setSelectaddress] = useState(user.address_name);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  useEffect(()=>{
    setAddress(address);
    setNewpopup(newpopup);
    setSelectaddress(selectaddress);
    setLoading(loading);
  },[refresh])

  /**
   * 
  
   */
  useEffect(()=>{
    FetchData();

  }, [])

  async function FetchData(){


  }

  const handleComplete = async(data) => {
    // 선택된 주소를 처리하는 로직
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setAddress(fullAddress); // 선택된 주소를 상태에 저장

    navigate(-1);

  };
/**
 * 위치 정보에 맞는 일감과 공간 정보를 데이타베이스에서 얻은후 
 * usercontext, datacontext 에 넣어주고 main으로 이동한다 
 *
 */
  const _handleAddressloading =(address) =>{
    setSelectaddress(address);

    setLoading(true);

    const geocoder = new kakao.maps.services.Geocoder();
    user.address_name = address;
    
    geocoder.addressSearch(address, async function(result, status) {
      // API 호출 결과 처리
      if (status === kakao.maps.services.Status.OK) {
        // 좌표 정보를 가져온다
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        console.log("위도:", coords.getLat());
        console.log("경도:", coords.getLng());


        let latitude = coords.getLat();
        let longitude = coords.getLng();

        user.USERINFO.latitude = latitude;
        user.USERINFO.longitude = longitude;
        user.address_name = address;


    

      }
    });




    setRefresh((refresh) => refresh +1);

  }


  const _handleaddrregister = () =>{
    setNewpopup(true);
    setRefresh((refresh) => refresh +1);
  }
  const _handleDelete = async(data) =>{
    const FindIndex = addressitems.findIndex(x=>x == data);
    addressitems.splice(FindIndex, 1);
    const ADDRITEMS = addressitems;
    const USERS_ID =user.USERS_ID;
    const updateaddr = await Update_addrItemsbyusersid({ADDRITEMS, USERS_ID});
    setRefresh((refresh) => refresh +1);
  }
  return (
    <Container style={containerStyle}>
      <Column style={{width:"100%"}}>
        <Label>주소지 찾기</Label>
        <SubText>개인정보를 위해 대략적으로 선택해주세요. 상세한 주소는 채팅을 통해 전달해주세요</SubText>

        {
          loading == true &&(<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
            width={"100px"} height={'100px'}/>)
        }
    
    
      </Column>
      {
        <div style={{position:"absolute", paddingTop:"80px", height:"470px", width:"95%", margin:"10 auto"}}>
          <DaumPostcode onComplete={handleComplete} style={{height:"470px"}} />
        </div>
      }
 
    </Container>
  );
}

export default MobileWorkMapconfigcontainer;



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
import { getuserInfobyusers_id, get_phonenumber, get_userInfoForUID, Read_userphone, Update_addrbyusersid, Update_addrItemsbyusersid, Update_addrsbyusersid, Update_userdevice } from "../../service/UserService";
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
  font-size: 22px;
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
  font-size: 18px;
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
  font-size: 14px;
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

const MobileMapReconfigcontainer =({containerStyle}) =>  {

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

    const USERS_ID = user.users_id;
    console.log("TCL: FetchData -> user.users_id", user.users_id)

    const userdata = await getuserInfobyusers_id({USERS_ID});
    console.log("TCL: FetchData -> userdata", userdata);
    if(userdata.ADDRESSITEMS != undefined){
      setAdderssitems(userdata.ADDRESSITEMS);
    }
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
    setRefresh((refresh) => refresh +1);
    setNewpopup(false);
    const ADDR = fullAddress;
    const USERS_ID = user.users_id;
    const updateaddr = await Update_addrbyusersid({ADDR, USERS_ID});
    AutoSetting(ADDR);
    FetchData();
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

        user.latitude = latitude;
        user.longitude = longitude;
        user.address_name = address;


        localforage.setItem('userconfig', user)
        .then(async function(value) {
          console.log("TCL: listener -> setItem userconfig", user);

          dispatch(user);
          const workitems = await ReadWork({latitude, longitude});
          const roomitems = await ReadRoom({latitude, longitude});
      
          data.workitems = workitems;
          data.roomitems = roomitems;
          datadispatch(data);

          setLoading(false);
          navigate("/Mobilemain");
    
        })
        .catch(function(err) {
            console.error('데이터 저장 실패:', err);
        });
    
 


      }
    });




    setRefresh((refresh) => refresh +1);

  }

/**
 * 위치 정보에 맞는 일감과 공간 정보를 firebase function 을 호출하도록 한다
 *
 */
  const AutoSetting = (addr) =>{

    const geocoder = new kakao.maps.services.Geocoder();

        // 주소 검색 (Geocoding)
    geocoder.addressSearch(addr, async function(result, status) {
      // API 호출 결과 처리
      if (status === kakao.maps.services.Status.OK) {
        // 좌표 정보를 가져온다
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        console.log("위도:", coords.getLat());
        console.log("경도:", coords.getLng());

        const currentlatitude = coords.getLat();
        const currentlongitude = coords.getLng();
        const checkdistance = CHECKDISTANCE;
        const workfunctioncall = await findWorkAndFunctionCallFromCurrentPosition({currentlatitude, currentlongitude, checkdistance});
        const roomfunctioncall= await findRoomAndFunctionCallFromCurrentPosition({currentlatitude, currentlongitude, checkdistance});
  

      
      } else {
        console.error("Geocoding 실패:", status);
        return null;
      }
    });



  }
  const _handleaddrregister = () =>{
    setNewpopup(true);
    setRefresh((refresh) => refresh +1);
  }
  const _handleDelete = async(data) =>{
    const FindIndex = addressitems.findIndex(x=>x == data);
    addressitems.splice(FindIndex, 1);
    const ADDRITEMS = addressitems;
    const USERS_ID =user.users_id;
    const updateaddr = await Update_addrItemsbyusersid({ADDRITEMS, USERS_ID});
    setRefresh((refresh) => refresh +1);
  }
  return (
    <Container style={containerStyle}>
      <Column style={{width:"100%"}}>
        <Label>주소관리</Label>
        <SubText>홍여사에서 사용하실 주소를 등록 해주세요</SubText>

        <BoxLayer>
        {
          addressitems.map((data)=>(
            <BoxItem >
              <FlexstartRow style={{alignItems:"center"}}>
                <div>{KeywordAddress(data)}</div>
  
              </FlexstartRow>

              <div style={{display:"flex"}}>

                <div onClick={()=>{_handleDelete(data)}}><img src={imageDB.close2} style={{width:16,paddingRight:15, paddingTop:3}}/></div>
                {
                  selectaddress == data ?( <img src={imageDB.check_e} style={{width:22,paddingRight:15, height:22}}/>)
                  :( <img onClick={()=>{_handleAddressloading(data)}} src={imageDB.check_d} style={{width:22,paddingRight:15,height:22}}/>)
                }

              </div>


              
            </BoxItem>
          ))
        }
        </BoxLayer>

        {
          loading == true &&(<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
            width={"100px"} height={'100px'}/>)
        }
    
    
      </Column>
      {
        newpopup == true && <div style={{position:"absolute", paddingTop:"80px", height:"470px", width:"95%", margin:"0 auto"}}>
          <DaumPostcode onComplete={handleComplete} style={{height:"470px"}} />
        </div>
      }
      <ReqButton enable={true} onClick={_handleaddrregister}>새 주소 등록 </ReqButton>
    </Container>
  );
}

export default MobileMapReconfigcontainer;


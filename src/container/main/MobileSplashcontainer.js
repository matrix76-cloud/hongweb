import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import LottieAnimation from "../../common/LottieAnimation";
import { DataContext } from "../../context/Data";
import { UserContext } from "../../context/User";
import { ReadCommunitySummary } from "../../service/CommunityService";
import { DefaultReadRoom, ReadAllRoom, ReadRoom } from "../../service/RoomService";
import { DefaultReadWork, ReadAllWork, ReadWork } from "../../service/WorkService";
import { getPlatform, isValidJSON, useSleep } from "../../utility/common";
import { imageDB } from "../../utility/imageData";
import { ReadCampingRegion, ReadHospitalRegion, ReadHospitalRegion1, ReadPerformanceCinema, ReadPerformanceEvent, ReadTourCountry, ReadTourFestival, ReadTourPicture, ReadTourRegion } from "../../service/LifeService";
import { LINKTYPE, MOVE } from "../../utility/link";
import { Create_userdevice, Read_userdevice, Update_tokendevice, update_userdevice } from "../../service/UserService";

import { v4 as uuidv4 } from 'uuid';

import localforage from 'localforage';
import Axios from "axios";
import randomLocation from 'random-location'
import { setStorage } from "../../utility/data";
import { distanceFunc } from "../../utility/region";



const Container = styled.div`
  height: 100%;
  display : flex;
  justify-content:center;
  alignItems:center;
  width :100%;
  background : #FFF;
`
const style = {
  display: "flex"
};



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const MobileSplashcontainer =({containerStyle}) =>  {
  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const [move, setMove] = useState(0);
  const [webview, setWebview] = useState(false);

  const [switchscreen, setSwitchscreen]= useState(false);
  const [height, setHeight] = useState(0);

  const elementRef = useRef(null);

  useLayoutEffect(() => {
    setHeight(elementRef.current.offsetHeight -10);
    console.log("TCL: MobileMaincontainer -> elementRef.current.offsetWidth", elementRef.current.offsetHeight)
  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);


  // useEffect(()=>{
  //   setSwitchscreen(switchscreen);
  //   setWebview(true);
  // },[refresh])


   /**
   * 실제로 react-native앱에서 받은 로직을 처리하는 Function
   * ! react-native에서 제일 중요한 부분은 token 값을 받는다
   * ! 이 token 값은 푸시알람을 위해서 필요하다 
   * ! 이 token 값은 usercontext에 저장 해두며 다음 세가지 케이스에 서버에 저장된다
   * ! 1) 저장된 DEVICEID 가 있고 서버도 동일한 DEVICEID가 존재 할때 서버에 TOKEN을 업데이트 한다 : Splash => Main
   * ! 2) 저장된 DEVICEID 가 있지만 서버에 동일한 DEVICEID가 없을때 : Splash => Gate => Phone => Main
   * ! 3) 저장된 DEVICEID 가 없을때: Splash => Gate => Phone => Policy => Main
   */
  //  const listener = async (event) => {
  //   if(getPlatform() === 'web'){
  //     return;
  //   }
  //   if(!isValidJSON(event.data))
  //     return;
  //   }
  //   const { appdata, type } = JSON.parse(event.data);
  //   if (type === LINKTYPE.START) {
  //     user.token = appdata.token;
  //     dispatch(user);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("message", listener);
  //   /** ios */
  //   window.addEventListener("message", listener);

  // }, []);


  /**
   * ! StartProcess 함수
   * ① 메인함수로 이동한다
   */
  useEffect(()=>{
    // StartProcess();
  }, [])

  // const StartProcess2 = async()=>{

  //   const readroomitems = await ReadAllRoom();

  //   let bExist =false;
  //   readroomitems.map((data)=>{
  //     let ROOM_INFONEW = data.ROOM_INFO;
  //     const FindIndex = ROOM_INFONEW.findIndex(x=>x.requesttype == '지역');
  //     const distance = distanceFunc(ROOM_INFONEW[FindIndex].latitude , ROOM_INFONEW[FindIndex].longitude,user.latitude,user.longitude );

  //     if(distance < 10){
  //       bExist = true;
  //     }
  //   })

  //   if(!bExist){
  //     // function에 호출하자
  //     const latitude = user.latitude;
  //     const longitude = user.longitude;
  //     const defaultreadroomitems = await DefaultReadRoom({latitude, longitude});
  //     console.log("TCL: MobileSplashcontainer -> defaultreadroomitems", defaultreadroomitems)

  //     const jsonPayload = {
  //       roomitems: defaultreadroomitems,
     
  //     };
  //     console.log("TCL: StartProcess -> defaultreadworkitems", defaultreadroomitems);
  
  //     Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/newroom',  jsonPayload, {
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     })
  //     .then(async(response) =>{
  //       console.log("TCL: StartProcess -> post url", );

  //       StartProcess3();
  //     })
  //     .catch((error) => {
  
  //     })

  //   }else{
     
  //     StartProcess3();             
    
  //   }

  // }
  // const StartProcess3 = async()=>{
  //   //Function 호출
  //   const latitude = user.latitude;
  //   const longitude = user.longitude;
  //   const workitems = await ReadWork({latitude, longitude});
  //   console.log("TCL: MobileSplashcontainer -> workitems", workitems)
  //   const roomitems = await ReadRoom({latitude, longitude});

  //   data.workitems = workitems;
  //   data.roomitems = roomitems;
  //   datadispatch(data);

  //   let uniqueId = "";
  //   localforage.getItem('uniqueId')
  //   .then(async function(value) {
  //     console.log("TCL: listener -> GetItem", value)

  //     uniqueId = value;

    
  //     if (uniqueId == '') {
  //       navigate("/Mobilegate");
  //     }else{
  
  //       const DEVICEID = uniqueId;
  //       const userdata = await Read_userdevice({DEVICEID});
  //       console.log("TCL: StartProcess -> user", userdata)
    
  //       if(userdata == -1){
  //         navigate("/Mobilegate");
  //       }else{
  //         console.log("TCL: FetchLocation -> data", data)
  //         setRefresh((refresh) => refresh +1);
  //         user.deviceid = uniqueId;
  //         user.phone = userdata.PHONE;
  //         user.nickname = userdata.NICKNAME;
  //         user.users_id = userdata.USERS_ID;


  //         dispatch(user);

  //         setStorage(uniqueId, user.latitude, user.longitude, user.address_name, user.users_id);
  
  //         const DEVICEID = user.deviceid;
  //         const TOKEN = user.token;
  //         const userupdate = await Update_tokendevice({DEVICEID, TOKEN});

  //         navigate("/Mobilemain");
  //       }
  
  //     }

  //   })
  //   .catch(function(err) {
  //   console.log("TCL: StartProcess -> storage fail ",);

  
  //   navigate("/Mobilegate");

  //   });

  
  // }
  /**
   * 모바일 웹에서 시작 
   * 현재 위치를 계산 하여 구한다음 1. 현재 위치로 주소 값을 구하여 userContext에 값을 설정 한다
   * TODO 2. 현재 위치에서 해당 하는 정보 값에 대한 세팅 값을 먼저 설정하기 위해 Function을 호출한다. 
   * 3. 일감 정보와 공간 대여정보를 세팅 해주고
   * 4. 이미 로그인 되어 있는지 확인 해야 한다. 
   * 5. 로그인 상태를 확인 하기 위해 스토리지값에서 값을 뺀다
   * 6. 스토리지에 값이 있으면 스토리지로 해당 데이타 베이스에 값을 가져 와서 세팅 해준다
   * 7. 데이타 베이스에 값이 없으면 /Mobilegate로 이동한다
   * 8. 데이타 베이스에 값이 있으면 /Mobilemain으로 이동한다
   * ! 8번 이라면 최종적으로 UserContext 값에 설정
   * 6-1.스토리지에 값이 없으면 시작화면으로 이동한다 /Mobilegate
  */
  // const StartProcess =() =>{
  //   console.log("TCL: StartProcess")
  //   navigator.geolocation.getCurrentPosition(
  //     (pos) => {
  //       const { latitude, longitude } = pos.coords;
  //       setLocation({ latitude, longitude });
  //       console.log("TCL: StartProcess -> latitude", latitude)
  //       console.log("TCL: StartProcess -> longitude", longitude)
  //       // Geocoder를 사용하여 좌표를 주소로 변환
  //       const geocoder = new kakao.maps.services.Geocoder();
  //       geocoder.coord2Address(longitude, latitude, async (result, status) => {
  //         if (status === kakao.maps.services.Status.OK) {
  //           const address = result[0].address;

  //           console.log("TCL: FetchLocation -> ", address);
          
  //           user.address_name = address.address_name;
  //           user.region_1depth_name = address.region_1depth_name;
  //           user.region_2depth_name = address.region_2depth_name;
  //           user.region_3depth_name = address.region_3depth_name;
  //           user.main_address_no = address.main_address_no;
  //           user.latitude  = latitude;
  //           user.longitude = longitude;
           
  //           dispatch(user);
  //           console.log("TCL: FetchLocation -> ", user );

  //           // 5km 내외에 현재 위치에 존재 하는 데이타가 있습니까?

  //           const readworkitems = await ReadAllWork();

  //           let bExist =false;
  //           readworkitems.map((data)=>{

  //             let WORK_INFONEW = data.WORK_INFO;

  //             const FindIndex = WORK_INFONEW.findIndex(x=>x.requesttype == '지역');

  //             const distance = distanceFunc(WORK_INFONEW[FindIndex].latitude , WORK_INFONEW[FindIndex].longitude,latitude,longitude );
      
        
  //             if(distance < 5){
  //               bExist = true;
  //             }
  //           })

  //           if(!bExist){
  //             // function에 호출하자
  //             const defaultreadworkitems = await DefaultReadWork({latitude, longitude});

  //             const jsonPayload = {
  //               workitems: defaultreadworkitems,
             
  //             };
  //             console.log("TCL: StartProcess -> defaultreadworkitems", defaultreadworkitems);
          
  //             Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/newwork',  jsonPayload, {
  //               headers: {
  //                 "Content-Type": "application/json"
  //               }
  //             })
  //             .then(async(response) =>{
  //               console.log("TCL: StartProcess -> post url", );

  //               StartProcess2();
  //             })
  //             .catch((error) => {
          
  //             })

  //           }else{
             
  //             StartProcess2();             
            
  //           }
  //         }else{
  //          alert(status);
  //         }
  //       });
 
  //     },
  //     (err) => {
  //       console.error(err);
  //       alert(err);
  //     }
  //   );


  // } 


  return (
    <div ref={elementRef}>
      <Container style={containerStyle} height={height}>
          <LottieAnimation containerStyle={{marginTop:"65%"}} animationData={imageDB.loadinglarge}
            width={"150px"} height={'150px'}/>
      </Container>
    </div>
  );
}
export default MobileSplashcontainer;


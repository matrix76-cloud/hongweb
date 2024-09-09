import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate, Navigate } from "react-router-dom";
import { UserContext } from "./context/User";
import { useMediaQuery } from "react-responsive";
import Configpage from "./page/main/Configpage";
import Mainpage from "./page/main/Mainpage";
import Mappage from "./page/main/Mappage";
import Roompage from "./page/main/Roompage";
import Workpage from "./page/main/Workpage";
import PCAttendanceEventpage from "./page/PCmain/PCAttendanceEventpage";
import PCCenterpage from "./page/PCmain/PCCenterpage";
import PCCommunitypage from "./page/PCmain/PCCommunitypage";
import PCCommunityreadpage from "./page/PCmain/PCCommunityreadpage";
import PCCommunitywritepage from "./page/PCmain/PCCommunitywriepage";
import PCEventdetailpage from "./page/PCmain/PCEventdetailpage";
import PCEventpage from "./page/PCmain/PCEventpage";
import PCHongguidepage from "./page/PCmain/PCHongguidepage";
import PCLoginpage from "./page/PCmain/PCLoginpage";
import PCMainpage from "./page/PCmain/PCMainpage";
import PCMappage from "./page/PCmain/PCMappage";
import PCPolicypage from "./page/PCmain/PCPolicypage";
import PCProfilepage from "./page/PCmain/PCProfilepage";
import PCRegistserpage from "./page/PCmain/PCWorkregisterpage";
import PCRoomguidepage from "./page/PCmain/PCRoomguidepage";
import PCRoompage from "./page/PCmain/PCRoompage";
import PCRoomPricepage from "./page/PCmain/PCRoomPricepage";
import PCRulletEventpage from "./page/PCmain/PCRulletEventpage";
import PCSplashpage from "./page/PCmain/PCSplashpage";
import Splashpage from "./page/sub/Splash/Splashpage";
import PCWorkregistserpage from "./page/PCmain/PCWorkregisterpage";
import PCRoomregisterpage from "./page/PCmain/PCRoomregisterpage";
import PCWorkregistpage from "./page/PCmain/PCRegistpage";
import PCRegistpage from "./page/PCmain/PCRegistpage";


import {Provider as MyProvider, useDispatch} from 'react-redux';
import PCChatpage from "./page/PCmain/PCChatpage";
import MobileSplashpage from "./page/main/MobileSplashpage";
import MobileMainpage from "./page/main/MobileMainpage";
import MobileRoomppage from "./page/main/MobileRoompage";
import MobileWorkregistserpage from "./page/main/MobileWorkregisterpage";
import MobileRoomregistserpage from "./page/main/MobileRoomregisterpage";
import MobileRegistpage from "./page/main/MobileRegistpage";
import MobileMappage from "./page/main/Mobilemappage";
import MobileSearchpage from "./page/main/MobileSearchpage";
import MobileSearchHistorypage from "./page/main/MobileSearchHistorypage";
import MobileGatepage from "./page/main/MobileGatepage";

import MobilePolicypage from "./page/main/MobilePolicypage";
import MobilePhonepage from "./page/main/MobilePhonepage";
import PCLifepage from "./page/PCmain/PCLifepage";
import MobileCommunityppage from "./page/main/MobileCommunitypage";
import MobileWorkpage from "./page/main/Mobileworkpage";
import MobileChatpage from "./page/main/MobileChatpage";
import MobileContentpage from "./page/main/MobileContentpage";

import localforage from 'localforage';
import MobileCommunityContentpage from "./page/main/MobileCommunityContentpage";
import MobileRoomWorkpage from "./page/main/MobileRoomworkpage";
import { ALLWORK } from "./store/menu/MenuSlice";
import MobileMapReconfigpage from "./page/main/MobileMapReconfigpage";



const App =() =>  {

  const reduxdispatch = useDispatch();

  const { user, dispatch } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
    } 
    FetchData();

  }, [])
  useEffect(()=>{

  },[refresh])

  useEffect(() => {

    localforage.getItem('address_name')
    .then(function(value) {
      console.log("TCL: listener -> GetItem address_name", value)
      user.address_name = value;
      dispatch(user);
      reduxdispatch(ALLWORK());
      
    })
    .catch(function(err) {

    });

    localforage.getItem('users_id')
    .then(function(value) {
      console.log("TCL: listener -> GetItem users_id", value)
      user.users_id = value;
      dispatch(user);
    })
    .catch(function(err) {

    });


    localforage.getItem('latitude')
    .then(function(value) {
      console.log("TCL: listener -> GetItem latitude", value)
      user.latitude = value;
      dispatch(user);
    })
    .catch(function(err) {

    });

    localforage.getItem('longitude')
    .then(function(value) {
      console.log("TCL: listener -> GetItem longitude", value)
      user.longitude = value;
      dispatch(user);

    })
    .catch(function(err) {

    });


  }, []);



  return (
   
    <Routes>

      <Route
          path="/"
          element={isMobile ?  (<MobileSplashpage />) :   (<PCSplashpage />)} 
        />

      <Route path="/Mobilegate" element={<MobileGatepage />} />
      <Route path="/Mobilepolicy" element={<MobilePolicypage />} />
      <Route path="/Mobilephone" element={<MobilePhonepage />} />
      <Route path="/Mobilemain" element={<MobileMainpage />} />
      <Route path="/Mobileroom" element={<MobileRoomppage />} />
      <Route path="/Mobilecommunity" element={<MobileCommunityppage />} />
      <Route path="/Mobilecommunitycontent" element={<MobileCommunityContentpage />} />
      <Route path="/Mobileworkregister" element={<MobileWorkregistserpage />} />
      <Route path="/Mobileroomregister" element={<MobileRoomregistserpage />} />
      <Route path="/Mobileregist" element={<MobileRegistpage />} />
      <Route path="/Mobilemap" element={<MobileMappage />} />
      <Route path="/Mobilework" element={<MobileWorkpage />} />
      <Route path="/Mobileworkroom" element={<MobileRoomWorkpage />} />
      <Route path="/Mobilechat" element={<MobileChatpage />} />
      <Route path="/Mobilecontent" element={<MobileContentpage />} />
      <Route path="/Mobilesearch" element={<MobileSearchpage />} />
      <Route path="/Mobilesearchhistory" element={<MobileSearchHistorypage />} />
      <Route path="/Mobilemapreconfig" element={<MobileMapReconfigpage />} />

      <Route path="/PCmain" element={<PCMainpage />} />
      <Route path="/PCmap" element={<PCMappage />} />
      <Route path="/PCchat" element={<PCChatpage />} />
      <Route path="/PCcommunity" element={<PCCommunitypage />} />
      <Route path="/PCcommunitywrite" element={<PCCommunitywritepage />} />
      <Route path="/PCcommunityread" element={<PCCommunityreadpage />} />
      <Route path="/PChongguide" element={<PCHongguidepage />} />
      <Route path="/PCroomguide" element={<PCRoomguidepage />} />
      <Route path="/PClogin" element={<PCLoginpage />} />
      <Route path="/PCprofile" element={<PCProfilepage />} />
      <Route path="/PCcenter" element={<PCCenterpage />} />
      <Route path="/PCevent" element={<PCEventpage />} />
      <Route path="/PClife" element={<PCLifepage />} />
      <Route path="/PCeventdetail" element={<PCEventdetailpage />} />
      <Route path="/PCattendanceevent" element={<PCAttendanceEventpage />} />
      <Route path="/PCrulletevent" element={<PCRulletEventpage />} />
      <Route path="/PCpolicy" element={<PCPolicypage />} />
      <Route path="/PCroom" element={<PCRoompage />} />
      <Route path="/PCroomprice" element={<PCRoomPricepage />} />
      <Route path="/PCworkregister" element={<PCWorkregistserpage />} />
      <Route path="/PCregist" element={<PCRegistpage />} />
      <Route path="/PCroomregister" element={<PCRoomregisterpage />} />
 
      <Route path="/main" element={<Mainpage />} />
      <Route path="/work" element={<Workpage />} />
      <Route path="/map" element={<Mappage />} />
      <Route path="/room" element={<Roompage />} />
      <Route path="/config" element={<Configpage />} />

    </Routes>

  );


 
}

export default App;

import React, {useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileRegistcontainer from "../../container/main/MobileRegistcontainer";
import PCRegistcontainer from "../../container/PCmain/PCRegistcontainer";
import PCWorkRegistcontainer from "../../container/PCmain/PCRegistcontainer";
import MobilePrevheader from "../../screen/Layout/Header/MobilePrevheader";
import MobileLayout from "../../screen/Layout/Layout/MobileLayout";
import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { PCMAINMENU } from "../../utility/screen";




const MobileRegistpage =() =>  {

  const navigate = useNavigate();
  const {state} = useLocation();
  const [totalset, setTotalset] = useState(0);
  const [refresh, setRefresh] = useState(1);



  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{

  }, [])

  useEffect(()=>{
    setTotalset(totalset);
  },[refresh])


 
  return (
    <div>
      <MobilePrevheader> </MobilePrevheader>
      <MobileRegistcontainer type={state.WORKTYPE}  totalset={state.WORKTOTAL}/>
    </div>

   
  );

}

export default MobileRegistpage;


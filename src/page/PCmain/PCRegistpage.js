import React, {useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PCRegistcontainer from "../../container/PCmain/PCRegistcontainer";
import PCWorkRegistcontainer from "../../container/PCmain/PCRegistcontainer";
import PCLayout from "../../screen/LayoutPC/Layout/PCLayout";
import { PCMAINMENU } from "../../utility/screen";
import { WORKNAME } from "../../utility/work";



const PCRegistpage =() =>  {

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

    <PCLayout main={true} name={PCMAINMENU.HOMEMENU} height={180}>
        <PCRegistcontainer type={state.WORKTYPE}  totalset={state.WORKTOTAL}/>
    </PCLayout>
  );

}

export default PCRegistpage;


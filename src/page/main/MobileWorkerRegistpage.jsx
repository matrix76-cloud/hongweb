import React, {useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileRegistcontainer from "../../container/main/MobileRegistcontainer";
import MobileWorkerRegistcontainer from "../../container/main/MobileWorkerRegistcontainer";
import MobileWorkerLayout from "../../screen/Layout/Layout/MobileWorkerLayout";





const MobileWorkerRegistpage =() =>  {

  const navigate = useNavigate();
  const {state} = useLocation();
  const [totalset, setTotalset] = useState(0);
  const [refresh, setRefresh] = useState(1);


  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

 
  return (
    
    <MobileWorkerLayout name={'아르바이트 등록'} >
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <MobileWorkerRegistcontainer />
      </div>
    </MobileWorkerLayout>
    
  );

}

export default MobileWorkerRegistpage;


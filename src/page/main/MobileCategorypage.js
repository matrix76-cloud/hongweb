import React, {useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileRegistcontainer from "../../container/main/MobileRegistcontainer";
import MobileCategorycontainer from "../../container/main/MobileCategorycontainer";





const MobileCategorypage =() =>  {

  const navigate = useNavigate();
  const {state} = useLocation();
  const [totalset, setTotalset] = useState(0);
  const [refresh, setRefresh] = useState(1);


  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

 
  return (

    <MobileCategorycontainer/>


   
  );

}

export default MobileCategorypage;


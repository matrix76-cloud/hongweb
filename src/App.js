import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./context/User";
import Configpage from "./page/main/Configpage";
import Mainpage from "./page/main/Mainpage";
import Mappage from "./page/main/Mappage";
import Roompage from "./page/main/Roompage";
import Workpage from "./page/main/Workpage";
import Splashpage from "./page/sub/Splash/Splashpage";






const App =() =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

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

 
  return (

    <Routes>
      <Route path="/" element={<Splashpage />} />
      <Route path="/main" element={<Mainpage />} />
      <Route path="/work" element={<Workpage />} />
      <Route path="/map" element={<Mappage />} />
      <Route path="/room" element={<Roompage />} />
      <Route path="/config" element={<Configpage />} />

    </Routes>
  );


 
}

export default App;

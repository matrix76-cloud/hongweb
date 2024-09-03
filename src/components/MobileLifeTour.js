import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataContext } from '../context/Data';
import { LIFEMENU, TOURISTMENU } from '../utility/life';
import MobileLifeTourCountry from './MobileLifeTourCountry';
import MobileLifeTourRegion from './MobileLifeTourRegion';
import MobileLifeTourFestival from './MobileLifeTourFestival';
import MobileLifeTourPicture from './MobileLifeTourPicture';



const Container = styled.div`
  width: 100%;


`
const TabButton = styled.div`
    padding: 15px 10px;
    cursor: pointer;
    border-bottom : ${({active}) => active == true ? ('2px solid #FF7125') :('')};
    outline: none;
    color : ${({active}) => active == true ? ('#FF7125') :('#131313')};
    font-family : 'Pretendard-SemiBold';


`



const MobileLifeTour = () => {
  const [activeTab, setActiveTab] = useState(TOURISTMENU.TOURFESTIVAL);

  const [refresh, setRefresh] = useState(1);
  const [tourfestivalitem, setTourfestivalitem] = useState([]);


  const { datadispatch, data } = useContext(DataContext);

  const handleTabClick = (label) => {
    setActiveTab(label);
    console.log("TCL: handleTabClick -> label", label);

    setRefresh((refresh) => refresh +1);
  };

  useEffect(()=>{
    setActiveTab(activeTab);
    setTourfestivalitem(tourfestivalitem);

  },[refresh])

  useEffect(()=>{
    async function FetchData(){
      setTourfestivalitem(data.tourfestivalitem);
    
    }
    FetchData();

  },[])


  return (

     <Container>

      {
          <div style={{ display: 'flex', borderBottom: '2px solid #ddd', width:"100%",
          flexDirection:"row", justifyContent:"space-around", alignItem:"center", position:"sticky", top:"50px",background:"#fff",zIndex:2 }}>

          <TabButton  onClick={() => handleTabClick(TOURISTMENU.TOURFESTIVAL)} active={activeTab == TOURISTMENU.TOURFESTIVAL} >문화축제</TabButton>
          <TabButton onClick={() => handleTabClick(TOURISTMENU.TOURREGION)} active={activeTab == TOURISTMENU.TOURREGION}>관광지</TabButton>
          <TabButton onClick={() => handleTabClick(TOURISTMENU.TOURCOUNTRY)} active={activeTab == TOURISTMENU.TOURCOUNTRY}>문화유적</TabButton>
          <TabButton onClick={() => handleTabClick(TOURISTMENU.TOURPICTURE)} active={activeTab == TOURISTMENU.TOURPICTURE}>관광사진</TabButton>

          </div>
      }

      {
        activeTab == TOURISTMENU.TOURFESTIVAL &&   <MobileLifeTourFestival/>
      }
      {
        activeTab == TOURISTMENU.TOURREGION &&   <MobileLifeTourRegion />
      }
      {
        activeTab == TOURISTMENU.TOURCOUNTRY &&   <MobileLifeTourCountry />
      }
      {
        activeTab == TOURISTMENU.TOURPICTURE &&   <MobileLifeTourPicture />
      }

     </Container>


  
  );
};

export default MobileLifeTour;

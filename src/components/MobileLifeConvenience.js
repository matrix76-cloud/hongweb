import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataContext } from '../context/Data';
import { CONVENIENCEMENU, FAMILYMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from '../utility/life';
import MobileLifeMedicalDrug from './MobileLifeMedicalDrug';
import MobileLifeTourCountry from './MobileLifeTourCountry';
import MobileLifeTourRegion from './MobileLifeTourRegion';
import MoblileLifePerformanceCinema from './MobileLifePerformanceCinema';
import MoblileLifePerformanceEvent from './MobileLifePerformanceEvent';
import MobileLifeTourFestival from './MobileLifeTourFestival';
import MobileLifeTourPicture from './MobileLifeTourPicture';
import MobileLifeFoodDrug from './MobileLifeFoodDrug';
import MobileLifeCampingRegion from './MobileLifeCampingRegion';



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



const MobileLifeConvenience = () => {
  const [activeTab, setActiveTab] = useState(CONVENIENCEMENU.CONVENIENCECAMPING);

  const [refresh, setRefresh] = useState(1);
  const [campingregionitem, setCampingregionitem] = useState([]);


  const { datadispatch, data } = useContext(DataContext);

  const handleTabClick = (label) => {
    setActiveTab(label);
    console.log("TCL: handleTabClick -> label", label)
    setRefresh((refresh) => refresh +1);
  };

  useEffect(()=>{
    setActiveTab(activeTab);
    setCampingregionitem(campingregionitem);

  },[refresh])

  useEffect(()=>{
    async function FetchData(){
 
      setCampingregionitem(data.campingregionitem);
    }
    FetchData();

  },[])


  return (

     <Container>

      {
          <div style={{ display: 'flex', borderBottom: '1px solid #ddd', width:"100%",
          flexDirection:"row", justifyContent:"flex-start", alignItem:"center" }}>
          <TabButton  onClick={() => handleTabClick(CONVENIENCEMENU.CONVENIENCECAMPING)} active={activeTab == CONVENIENCEMENU.CONVENIENCECAMPING} >전국캠핑장</TabButton>
          </div>
      }

      {
        activeTab == CONVENIENCEMENU.CONVENIENCECAMPING &&   <MobileLifeCampingRegion/>
      }
 
  
     </Container>


  
  );
};

export default MobileLifeConvenience;

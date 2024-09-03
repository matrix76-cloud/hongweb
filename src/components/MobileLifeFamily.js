import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataContext } from '../context/Data';
import { FAMILYMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from '../utility/life';
import MobileLifeMedicalDrug from './MobileLifeMedicalDrug';
import MobileLifeTourCountry from './MobileLifeTourCountry';
import MobileLifeTourRegion from './MobileLifeTourRegion';
import MoblileLifePerformanceCinema from './MobileLifePerformanceCinema';
import MoblileLifePerformanceEvent from './MobileLifePerformanceEvent';
import MobileLifeTourFestival from './MobileLifeTourFestival';
import MobileLifeTourPicture from './MobileLifeTourPicture';
import MobileLifeFoodDrug from './MobileLifeFoodDrug';



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



const MobileLifeFamily = () => {
  const [activeTab, setActiveTab] = useState(MEDICALMENU.FOODINFOMATION);

  const [refresh, setRefresh] = useState(1);
  


  const { datadispatch, data } = useContext(DataContext);

  const handleTabClick = (label) => {
    setActiveTab(label);
    console.log("TCL: handleTabClick -> label", label)
    setRefresh((refresh) => refresh +1);
  };

  useEffect(()=>{
    setActiveTab(activeTab);


  },[refresh])

  useEffect(()=>{
    async function FetchData(){

    }
    FetchData();

  },[])


  return (

     <Container>

      {
          <div style={{ display: 'flex', borderBottom: '1px solid #ddd', width:"100%",
          flexDirection:"row", justifyContent:"flex-start", alignItem:"center" , position:"sticky", top:"50px",background:"#fff",zIndex:2}}>

          <TabButton  onClick={() => handleTabClick(MEDICALMENU.FOODINFOMATION)} active={activeTab == MEDICALMENU.FOODINFOMATION} >건강식품정보</TabButton>

          </div>
      }

      {
        activeTab == MEDICALMENU.FOODINFOMATION &&   <MobileLifeFoodDrug />
      }
 
  
     </Container>


  
  );
};

export default MobileLifeFamily;

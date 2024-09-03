import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataContext } from '../context/Data';
import { LIFEMENU, PERFORMANCEMENU, TOURISTMENU } from '../utility/life';
import MobileLifeTourCountry from './MobileLifeTourCountry';
import MobileLifeTourRegion from './MobileLifeTourRegion';
import MoblileLifePerformanceCinema from './MobileLifePerformanceCinema';
import MoblileLifePerformanceEvent from './MobileLifePerformanceEvent';
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



const MobileLifePerformance = () => {
  const [activeTab, setActiveTab] = useState(PERFORMANCEMENU.PERFORMANCEEVENT);

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

          <TabButton  onClick={() => handleTabClick(PERFORMANCEMENU.PERFORMANCEEVENT)} active={activeTab == PERFORMANCEMENU.PERFORMANCEEVENT} >공연행사할인</TabButton>
          <TabButton onClick={() => handleTabClick(PERFORMANCEMENU.PERFORMANCECINEMA)} active={activeTab == PERFORMANCEMENU.PERFORMANCECINEMA}>공공시설물개방</TabButton>

          </div>
      }

      {
        activeTab == PERFORMANCEMENU.PERFORMANCEEVENT &&   <MoblileLifePerformanceEvent/>
      }
 
      {
        activeTab == PERFORMANCEMENU.PERFORMANCECINEMA &&   <MoblileLifePerformanceCinema/>
      }
     </Container>


  
  );
};

export default MobileLifePerformance;

import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataContext } from '../context/Data';
import { LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from '../utility/life';
import MobileLifeMedicalDrug from './MobileLifeMedicalDrug';
import MobileLifeTourCountry from './MobileLifeTourCountry';
import MobileLifeTourRegion from './MobileLifeTourRegion';
import MoblileLifePerformanceCinema from './MobileLifePerformanceCinema';
import MoblileLifePerformanceEvent from './MobileLifePerformanceEvent';
import MobileLifeTourFestival from './MobileLifeTourFestival';
import MobileLifeTourPicture from './MobileLifeTourPicture';
import MobileLifeMedicalHospital from './MobileLifeMedicalHospital';



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



const MobileLifeMedical = () => {
  const [activeTab, setActiveTab] = useState(MEDICALMENU.MEDICALMEDICINE);

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
          flexDirection:"row", justifyContent:"flex-start", alignItem:"center", position:"sticky", top:"50px",background:"#fff",zIndex:2 }}>

          <TabButton  onClick={() => handleTabClick(MEDICALMENU.MEDICALMEDICINE)} active={activeTab == MEDICALMENU.MEDICALMEDICINE} >의약품정보</TabButton>
          <TabButton onClick={() => handleTabClick(MEDICALMENU.MEDICALHOSPITAL)} active={activeTab == MEDICALMENU.MEDICALHOSPITAL}>병원정보</TabButton>

          </div>
      }

      {
        activeTab == MEDICALMENU.MEDICALMEDICINE &&   <MobileLifeMedicalDrug/>
      }
 
      {
        activeTab == MEDICALMENU.MEDICALHOSPITAL &&   <MobileLifeMedicalHospital/>
      }
     </Container>


  
  );
};

export default MobileLifeMedical;

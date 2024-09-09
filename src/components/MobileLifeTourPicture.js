
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column } from "../common/Column";
import { DataContext } from "../context/Data";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import { ReadTourPicture } from "../service/LifeService";


const Container = styled.div`

  margin : 0 auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  height: 1500px;
  overflow-y : auto; 
  scrollbar-width: none;
`
const style = {
  display: "flex"
};

const  SearchLayer = styled.div`
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display:flex;
  flex-direction: row;
  justify-content:center;
  align-items:center;
  width:100%;
  background:#fff;
  position:sticky;
  top:0px;
`

const BoxItem = styled.div`
  padding: 20px;
  border: 1px solid #ededed;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #333;
  line-height: 1.8;
  width:85%;
  font-family: "Pretendard-Light";


`
const Inputstyle={
  margin :"10px auto",
  border: '2px solid #ff7e10',
  background: '#fff',
  height: '20px',
  width:"77%",

}
const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}
const MapbtnStyle={
  background: "#f3f3f3",
  padding: "10px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '5px',
  color: '#333',
}

const Taglabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size:16px;
  margin-right:10px;
`
const Item = styled.div`
  margin: 5px 0px;
`
const LocationText  = styled.div`
  color : #131313;
  font-size:13px;
`
const SearchText = styled.div`
color : #131313;
font-family:'Pretendard-Light';
font-size:10px;
`  

const MobileLifeTourPicture =({containerStyle}) =>  {


/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [search, setSearch] = useState('');
  const [show, setShow] = useState(true);
  const [searching, setSearching] = useState(true);
  const [displayitems, setDisplayitems] = useState(data.tourpictureitem);

  const [popupstatus, setPopupstatus] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitudie, setLongitude] = useState('');

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setSearching(searching);
    setDisplayitems(displayitems);

  }, [refresh])

  useEffect(()=>{
      async function FetchData(){

        if(data.tourpictureitem.length == 0){
          const tourpictureitem = await ReadTourPicture();
          const dataToSavpicture = JSON.parse(tourpictureitem);
          data.tourpictureitem = dataToSavpicture.response.body.items.item;

          datadispatch(data);
        }

        await useSleep(1000);

        setDisplayitems(data.tourpictureitem);

        setSearching(false);
    
      
      }

      FetchData();
  }, [])

   /**
   * 페이지내에 스크롤을 막아 주는 코드입니다 
   */
  //  useEffect(() => {
  //   document.documentElement.style.scrollbarGutter = 'stable'; // 추가

  //   if (show) document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = 'unset';
  //   };
  // }, [show]);
 

  return (

    <Container style={containerStyle}>
        
        {
          searching == true ? (<LottieAnimation containerStyle={LoadingStyle} animationData={imageDB.loading}
            width={"50px"} height={'50px  '} />)
          :(
            <Row style={{flexWrap:"wrap", width:"100%"}}>      
            {
              displayitems.map((data, index)=>(
              <>
              {
                index < 1000 &&
                  <div style={{width:'45%', margin:"10px auto",}}>
                  <img src={data.galWebImageUrl} style={{width:"150px", height:"150px"}}/>
              
                  <LocationText>{data.galPhotographyLocation}</LocationText>
                    <SearchText>
                    {data.galSearchKeyword.slice(0, 25)}
                    {data.galSearchKeyword.length > 25 ? "..." : null}
                    </SearchText>
                  </div>
                
              }
              </>
   
            ))
            }
            </Row>)
        }
  

         
    </Container>
  );

}

export default MobileLifeTourPicture;


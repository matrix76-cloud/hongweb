
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
import { ReadPerformanceEvent } from "../service/LifeService";
import ResultLabel from "../common/ResultLabel";


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
width: 90%;
margin : 0 auto;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
background: #fff;
position: sticky;
top: 0px;
padding-top: 10px;
padding-bottom: 10px;
`

const BoxItem = styled.div`
padding: 20px 0px;
border-bottom: 1px solid #131313;
margin-bottom: 20px;
color: #333;
line-height: 1.8;
width:100%;
font-family: "Pretendard-Light";


`
const Inputstyle={

  background: '#FFF',
  borderRadius:'5px',
  fontSize: '16px',
  padding: '0px 16px 0px 16px',
  height : '40px',
  border : "1px solid #FF7125",

}
const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "400px",
  position:"absolute"
}
const MapbtnStyle={
  background: "#ff",
  padding: "0px 20px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '50px',
  color: '#333',
  border :" 1px solid #c3c3c3",
  height: '38px',
  fontSize:'16px',
  fontFamily:'Pretendard-SemiBold',
  width:'30%',
  margin :'20px auto 0px',
}

const Taglabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size:14px;
  margin-right:10px;
  color :#131313;
  min-width:55px;
  display : flex;
  align-items: center;
  justify-content: flex-start;
`

const TagData = styled.div`
  font-family: "Pretendard-Light";
  font-size:14px;

  color :#131313;
`
const Item = styled.div`
  margin: 5px 0px;
  display:flex;
  flex-direction: row;
  justify-content:flex-start;
  align-items:center;
`

const MoblileLifePerformanceEvent =({containerStyle}) =>  {


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
  const [displayitems, setDisplayitems] = useState([]);

  const [popupstatus, setPopupstatus] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitudie, setLongitude] = useState('');
  const [performanceeventname, setPerformanceeventname] = useState('');

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setSearching(searching);
    setDisplayitems(displayitems);
    setPopupstatus(popupstatus);
    setLatitude(latitude);
    setLongitude(longitudie);
    setPerformanceeventname(performanceeventname);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){


        let items = [];

        if(data.performanceeventitem.length == 0)
        {
          const performanceeventitem = await ReadPerformanceEvent();

          performanceeventitem.map((data, index)=>{
            const dataToSave = JSON.parse(data.dateitem);
  
            if(dataToSave.response.body != undefined){
              dataToSave.response.body.items.map((subdata)=>{
                items.push(subdata);
              })
  
            }
          })
          data.performanceeventitem = items;
          datadispatch(data);
        }


        setDisplayitems(data.performanceeventitem);


        await useSleep(1000);
        setSearching(false);
        setRefresh((refresh) => refresh +1);
    
      
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
 
  const _handleSubmit = async(event) => {
    event.preventDefault();

    Searchfunc();

  };
  const popupcallback = async () => {
    setPopupstatus(!popupstatus);
    setRefresh((refresh) => refresh +1);
  };

  const _handleMapview= (lat, long, performanceeventname)=>{

    setPopupstatus(true);
    setLatitude(lat);
    setLongitude(long);
    setPerformanceeventname(performanceeventname);
    setRefresh((refresh) => refresh +1);

  }

  const handleKeyDown = (event)=>{
    if (event.key === 'Enter') {
      Searchfunc();
    }

  }

  async function Searchfunc(){
    setSearching(true);

    await useSleep(2000);
    const keyworditems = searchkeyword(search, data.performanceeventitem);

    const regionitems = searchRegion(search, data.performanceeventitem);

    let resultitems = [];
    keyworditems.map((data)=>{resultitems.push(data)});
    regionitems.map((data)=>{resultitems.push(data)});

    setDisplayitems(resultitems);

    setSearching(false);
    setRefresh((refresh) => refresh +1);
  }
  function searchkeyword(data, items){

    const foundItems = items.filter(item => item.eventNm.toLowerCase().includes(data.toLowerCase()));

    return foundItems;

  }
  function searchRegion(data, items){

    const foundItems = items.filter(item => item.rdnmadr.toLowerCase().includes(data.toLowerCase()));

    return foundItems;

  }
  return (

    <Container style={containerStyle}>
        
        {
          popupstatus == true && <MobileMapPopup callback={popupcallback} latitude={latitude} longitude={longitudie}
          name={performanceeventname} markerimg={imageDB.performance}
          top={'30%'}  left={'10%'} height={'280px'} width={'280px'}
          />
        }

        {
          searching == true ? (<LottieAnimation containerStyle={LoadingStyle} animationData={imageDB.loading}
            width={"50px"} height={'50px'} />)
          :(
            <Column style={{marginTop:10,width:"100%",margin:"0 auto", paddingTop:"50px"}}>

              <Column style ={{width:"100%", backgroundColor:"#fff", position:"fixed", top:"50px"}}>
                <SearchLayer>
                  <input className="custom-input" type="text" style={Inputstyle}
                  onKeyDown={handleKeyDown} 
                  value={search} onChange={(e)=>{
                    setSearch(e.target.value);
                    setRefresh((refresh) => refresh +1);
                  
                  }}
                  placeholder="공연 이름, 지역 입력" />
                  <img className ="searchicon" src={imageDB.redsearch} style={{width:20, height:20, position:"absolute", left:'88%'}} onClick={_handleSubmit}/>

                </SearchLayer>

                <FlexstartRow style={{width:"90%", margin : '10 auto', marginBottom:10}}>
                    <img src={imageDB.infocircle} width={16} height={16} o/>
                    <span style={{fontSize:"12px", color :"#636363", marginLeft:5}}>알아보고자 하는 공연 이름이나 지역이름을 넣어주세요</span>                  
              </FlexstartRow>
              </Column>

         

              <FlexstartRow style={{width:"100%", marginTop:50, marginBottom:10, borderBottom: "1px solid #000"}}>
                <ResultLabel label={'총'} result = {displayitems.length} unit={'건'}/>
              </FlexstartRow>

              <div style={{overflowY:"hidden",width:"90%",margin:"0 auto"}}>
              {
                displayitems.map((data, index)=>(
                    <BoxItem>
            
                      <Item style={{color:"#131313", fontWeight:500,fontFamily: "Pretendard-SemiBold"}}>{data.eventNm}</Item>
                      <Item><TagData>{data.eventStartDate} ~ {data.eventEndDate}</TagData></Item>
                      <Item><Taglabel><img src={imageDB.dot} style={{width:'3px',marginRight:3}}/>공연홀</Taglabel><TagData>{data.opar}</TagData></Item>
                      <Item><Taglabel><img src={imageDB.dot} style={{width:'3px',marginRight:3}}/>공연종류</Taglabel><TagData>{data.eventCo}</TagData></Item>

                      <Item><Taglabel><img src={imageDB.dot} style={{width:'3px',marginRight:3}}/>공연시간</Taglabel><TagData>{data.eventStartTime} ~ {data.eventEndTime}</TagData></Item>
                      <Item><Taglabel><img src={imageDB.dot} style={{width:'3px',marginRight:3}}/>공연주관</Taglabel><TagData>{data.mnnstNm}{data.phoneNumber}</TagData></Item>
                      <Item><Taglabel><img src={imageDB.dot} style={{width:'3px',marginRight:3}}/>요금</Taglabel><TagData>{data.chrgeInfo}</TagData>
                      {
                        data.seatNumber != '' && <div>{data.seatNumber}석</div>
                      }
                      </Item>
                      <Item><Taglabel><img src={imageDB.dot} style={{width:'3px',marginRight:3}}/>무료여부</Taglabel><TagData>{data.admfee}</TagData></Item>
                      <Item><Taglabel><img src={imageDB.dot} style={{width:'3px',marginRight:3}}/>연령제한</Taglabel><TagData>{data.entncAge}</TagData></Item>
                      <Item><Taglabel><img src={imageDB.dot} style={{width:'3px',marginRight:3}}/>가시는길</Taglabel><TagData>{data.rdnmadr}</TagData></Item>
                      <Item><div style={MapbtnStyle} onClick={()=>{_handleMapview(data.latitude,data.longitude,data.eventNm)}}>지도로보기</div></Item>
                    </BoxItem>
                ))
              }
              </div>



            </Column>)
        }
          
    </Container>
  );

}

export default MoblileLifePerformanceEvent;


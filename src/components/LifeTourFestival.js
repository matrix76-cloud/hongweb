
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./table.css"
import "./medicalinput.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";


const Container = styled.div`
  padding :0px 20px;
  width :100%;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
`
const style = {
  display: "flex"
};

const Inputstyle={
  width: '40%',
  margin :"10px auto",
  border: '3px solid #ff7e10',
  background: '#fff',
  height: '30px',

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
  background: "#f3f3f3",
  padding: "10px",
  width: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '5px',
  color: '#333',
}

const LifeTourFestival =({containerStyle, items}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [search, setSearch] = useState('');
  const [show, setShow] = useState(true);
  const [searching, setSearching] = useState(false);
  const [displayitems, setDisplayitems] = useState([]);

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
    setPopupstatus(popupstatus);
    setLatitude(latitude);
    setLongitude(longitudie);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
        setDisplayitems(items);
      }

      FetchData();
  }, [])

   /**
   * 페이지내에 스크롤을 막아 주는 코드입니다 
   */
   useEffect(() => {
    document.documentElement.style.scrollbarGutter = 'stable'; // 추가

    if (show) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);
 
  const _handleSubmit = async(event) => {
    event.preventDefault();

    Searchfunc();

  };
  const popupcallback = async () => {
    setPopupstatus(!popupstatus);
    setRefresh((refresh) => refresh +1);
  };

  const _handleMapview= (lat, long)=>{

    setPopupstatus(true);
    setLatitude(lat);
    setLongitude(long);
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
    const keyworditems = searchkeyword(search, items);

    const regionitems = searchRegion(search, items);

    let resultitems = [];
    keyworditems.map((data)=>{resultitems.push(data)});
    regionitems.map((data)=>{resultitems.push(data)});

    setDisplayitems(resultitems);

    setSearching(false);
    setRefresh((refresh) => refresh +1);
  }
  function searchkeyword(data, items){

    const foundItems = items.filter(item => item.fstvlNm.toLowerCase().includes(data.toLowerCase()));

    return foundItems;

  }
  function searchRegion(data, items){

    const foundItems = items.filter(item => item.rdnmadr.toLowerCase().includes(data.toLowerCase()));

    return foundItems;

  }
  return (

    <Container style={containerStyle}>
        
        {
          popupstatus == true && <PCMapPopup callback={popupcallback} latitude={latitude} longitude={longitudie}
          top={'30px'}  left={'18%'} height={'480px'} width={'800px'}
          />
        }
  
          <FlexstartRow style={{fontFamily:"Pretendard-SemiBold", fontSize:20}}>
          █ {'전국 축제 정보'}
          </FlexstartRow>


            <Row style={{width:'100%', background:"#fff", position:"sticky", top:'170px'}}>
              <input className="custom-input" type="text" style={Inputstyle}
              onKeyDown={handleKeyDown} 
              value={search} onChange={(e)=>{
                setSearch(e.target.value);
                setRefresh((refresh) => refresh +1);
              
              }}
              placeholder="알아보고자 하는 축제 이름 이나 지역을 넣어주세여" />
              <img className ="searchicon" src={imageDB.search} style={{width:30, height:30, position:"absolute", left:'68%'}} onClick={_handleSubmit}/>
            </Row>
          
              {
                searching == true ? (<LottieAnimation containerStyle={LoadingStyle} animationData={imageDB.loadinglarge}/>)
                :( "")
              }
              <div className="table-container">
                <Table>
                  <thead>
                  <tr>
                      <th>축제이름</th>
                      <th>일시</th>
                      <th>축제내용</th>
                      <th>주관</th>
                      <th>관리</th>
                      <th>지원</th>
                      <th>전화번호</th>
                      <th>가는 길</th>
                      <th>위치</th>
                  </tr>
                  </thead>
    
                  <tbody>
                  {
                      displayitems.map((data, index)=>(
                      <tr>
                      <td>{data.fstvlNm}</td>
                      <td>{data.fstvlStartDate} ~ {data.fstvlEndDate}</td>
                      <td>{data.fstvlCo}</td>
                      <td>{data.mnnstNm}</td>
                      <td>{data.auspcInsttNm}</td>
                      <td>{data.suprtInsttNm}</td>
                      <td>{data.phoneNumber}</td>
                      <td>{data.rdnmadr}</td>
                      <td><div style={MapbtnStyle} onClick={()=>{_handleMapview(data.latitude,data.longitude)}}>지도로보기</div></td>
                      </tr>
                  ))
                  }
                  </tbody>
                </Table>
              </div>



         
    </Container>
  );

}

export default LifeTourFestival;


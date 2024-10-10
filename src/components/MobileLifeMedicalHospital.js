
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
import Button from "../common/Button";
import Axios from "axios";
import { IoEllipseSharp } from "react-icons/io5";
import ResultLabel from "../common/ResultLabel";
import { ReadHospitalRegion1 } from "../service/LifeService";
import { LoadingCommunityStyle } from "../screen/css/common";


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

const Inputstyle ={

  background: '#FFF',
  borderRadius:'5px',
  fontSize: '16px',
  padding: '0px 16px 0px 16px',
  height : '40px',
  border : "1px solid #FF7125",


}


const  SearchLayer = styled.div`
  width: 100%;
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
  padding: 20px;
  border: 1px solid #ededed;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #333;
  line-height: 1.8;
  width:85%;
  font-family: "Pretendard-Light";


`

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
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '5px',
  color: '#333',
}

const PopupWorkEx = styled.div`
  height: 3050px;
  width: 100%;
  background: #fff;
  z-index: 5;
  overflow-y: auto;
`

const TableLayout = styled.div`
  overflow-y: scroll;
  scroll-behavior: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
`

const Taglabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size:16px;
  margin-right:10px;
`
const Item = styled.div`
  margin: 5px 0px;
`
const SpecialLayer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top:20px;
`
const SpecialItem = styled.div`
    margin: 5px;
    border-radius: 20px;
    height: 30px;
    padding: 5px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9f9;

`
const MainLabelInfo = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: 20px;
`


const SubLabelInfo = styled.div`
  font-family: 'Pretendard-Regular';
  font-size: 18px;
`
const Box = styled.div`
  background: #f9f9f9;
    color: #131313;
    height: 30px;
    font-size :14px;
    padding: 5px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
    &:hover {
      margin-top:5px;
      background-color :#f0f0f0;
    }


`

const MobileLifeMedicalHospital =({containerStyle}) =>  {


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
  const [searching, setSearching] = useState(false);
  const [displayitems, setDisplayitems] = useState([]);

  const [popupstatus, setPopupstatus] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitudie, setLongitude] = useState('');
  const [item, setItem] = useState(null);

  const [specialitem, setSpecialitem] = useState([]);
  const [facilityitem, setFacilityitem] = useState({});
  const [departmentitems, setDepartmentitems] = useState([]);
  const [equipmentitems, setEquipmentitems] = useState([]);

  const [resulthospital, setResulthospital] = useState([]);


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
    setResulthospital(resulthospital);
    setItem(item);
    setDepartmentitems(departmentitems);
    setEquipmentitems(equipmentitems);
    setFacilityitem(facilityitem);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){


        let items = [];
        const hospitalitem = await ReadHospitalRegion1();
  
        hospitalitem.map((data, index)=>{
  
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.hospitalitem, "text/xml");
      
      
          // 데이터 추출
          const xmlitems = xmlDoc.getElementsByTagName("item");
     
    
  
          for (let i = 0; i < xmlitems.length; i++) {
            let XPos = "", YPos = "", hospUrl ="", telno ="";
            const clCdNm = xmlitems[i].getElementsByTagName("clCdNm")[0].textContent; 
            const drTotCnt = xmlitems[i].getElementsByTagName("drTotCnt")[0].textContent; 
  
            const cmdcGdrCnt = xmlitems[i].getElementsByTagName("cmdcGdrCnt")[0].textContent; 
            const cmdcIntnCnt = xmlitems[i].getElementsByTagName("cmdcIntnCnt")[0].textContent; 
            const cmdcResdntCnt = xmlitems[i].getElementsByTagName("cmdcResdntCnt")[0].textContent; 
            const cmdcSdrCnt = xmlitems[i].getElementsByTagName("cmdcSdrCnt")[0].textContent; 
  
  
            const detyGdrCnt = xmlitems[i].getElementsByTagName("detyGdrCnt")[0].textContent; 
            const detyIntnCnt = xmlitems[i].getElementsByTagName("detyIntnCnt")[0].textContent; 
            const detyResdntCnt = xmlitems[i].getElementsByTagName("detyResdntCnt")[0].textContent; 
            const detySdrCnt = xmlitems[i].getElementsByTagName("detySdrCnt")[0].textContent; 
  
  
  
            const mdeptGdrCnt = xmlitems[i].getElementsByTagName("mdeptGdrCnt")[0].textContent; 
            const mdeptIntnCnt = xmlitems[i].getElementsByTagName("mdeptIntnCnt")[0].textContent; 
            const mdeptResdntCnt = xmlitems[i].getElementsByTagName("mdeptResdntCnt")[0].textContent; 
            const mdeptSdrCnt = xmlitems[i].getElementsByTagName("mdeptSdrCnt")[0].textContent; 
  
            const yadmNm = xmlitems[i].getElementsByTagName("yadmNm")[0].textContent;
  
            const addr = xmlitems[i].getElementsByTagName("addr")[0].textContent;
            if(xmlitems[i].getElementsByTagName("XPos")[0] != undefined){
              XPos = xmlitems[i].getElementsByTagName("XPos")[0].textContent;
              YPos = xmlitems[i].getElementsByTagName("YPos")[0].textContent;
            }
       
            const ykiho = xmlitems[i].getElementsByTagName("ykiho")[0].textContent;
    
            if(xmlitems[i].getElementsByTagName("telno")[0] != undefined){
              telno = xmlitems[i].getElementsByTagName("telno")[0].textContent;
            }
  
  
            if(xmlitems[i].getElementsByTagName("hospUrl")[0] != undefined){
  
              hospUrl = xmlitems[i].getElementsByTagName("hospUrl")[0].textContent;
            }
  
  
            items.push({clCdNm,drTotCnt,
              cmdcGdrCnt,cmdcIntnCnt,cmdcResdntCnt,cmdcSdrCnt,
              detyGdrCnt,detyIntnCnt,detyResdntCnt,detySdrCnt,
              mdeptGdrCnt,mdeptIntnCnt,mdeptResdntCnt,mdeptSdrCnt,
              yadmNm,
              addr,XPos, YPos,
              ykiho,telno,hospUrl})
          }
  
        
  
        })
  
        data.hospitalregionitem = items;

        setDisplayitems(data.hospitalregionitem);

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


  async function gethospitalinfo(ykiho){

    setSearching(true);

    const jsonPayload = {
      name: ykiho,
   
    };

    setSearching(true);
    Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/medicalspecial',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{

      if(response.data.response.body.items != undefined){
        setSpecialitem(response.data.response.body.items.item);
   
        setRefresh((refresh) => refresh +1);
      }

    })
    .catch((error) => console.error('Error:', error));



    Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/medicalfacility',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{
      console.log("TCL: medicalfacility -> response", response.data.response.body.items.item)
      setFacilityitem(response.data.response.body.items.item);
      
      setRefresh((refresh) => refresh +1);
    })
    .catch((error) => console.error('Error:', error));


    Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/medicaldepartment',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{
      console.log("TCL: medicaldepartment -> response", response.data.response.body.items.item)
      setDepartmentitems(response.data.response.body.items.item);
      
      setRefresh((refresh) => refresh +1);
    })
    .catch((error) => console.error('Error:', error));

    Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/medicalequipment',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{
      console.log("TCL: medicalequipment -> response", response.data.response.body.items.item)
      setEquipmentitems(response.data.response.body.items.item);
      

      setSearching(false);
      setRefresh((refresh) => refresh +1);
    })
    .catch((error) => console.error('Error:', error));

  }

  const _handleView =(data)=>{
  console.log("TCL: _handleView -> data", data)

    
    setItem(data);
    gethospitalinfo(data.ykiho);

    setResulthospital([]);
    setRefresh((refresh) => refresh +1);
  }


  const _handleClose = () =>{

    
    console.log("TCL: _handleClose ->  why not",  )
    setItem(null);
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
    const keyworditems = searchkeyword(search, data.hospitalregionitem);

    setResulthospital(keyworditems);
    setSearching(false);

    // if(keyworditem != null){
    //   gethospitalinfo(keyworditem.ykiho);
    // }

    setRefresh((refresh) => refresh +1);
  }
  function searchkeyword(data, items){

    const foundItems = items.filter(item => item.yadmNm.toLowerCase().includes(data.toLowerCase()));

    if(foundItems != null){
      return foundItems;
    }else{
      return null;
    }
  }

  return (

    <Container style={containerStyle}>
        
  
  
      <Column style={{width:"95%", position:"sticky", top:0, margin: "20px auto"}}>
      <SearchLayer>
                <input className="custom-input" type="text" style={Inputstyle}
                onKeyDown={handleKeyDown} 
                value={search} onChange={(e)=>{
                  setSearch(e.target.value);
                  setRefresh((refresh) => refresh +1);
                
                }}
                placeholder="병원 이름 입력" />
                <img className ="searchicon" src={imageDB.redsearch} style={{width:20, height:20, position:"absolute", left:'88%'}} onClick={_handleSubmit}/>

        </SearchLayer>

        <FlexstartRow style={{width:"100%", marginBottom:10}}>
                    <img src={imageDB.infocircle} width={16} height={16} o/>
                    <span style={{fontSize:"12px", color :"#636363", marginLeft:5}}>알아보고자 병원이름을 넣어주세요</span>                  
        </FlexstartRow>
        </Column>
        {
          searching == true ? (<LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loading}
            width={"50px"} height={'50px'}/>)
          :(

            <>
              <FlexstartRow style={{width:"100%", marginTop:20, marginBottom:10, borderBottom: "1px solid #000"}}>
                <ResultLabel label={"'"+search +"'" +'검색 결과'}/>
              </FlexstartRow>

              {
                item != null ? ( <PopupWorkEx style={{marginTop:10,}}>
                  <TableLayout> 
                      <Table class="hospitaltable">
                      <tbody> 
                        <tr>
                          <td>이름</td>
                          <td>{item.yadmNm}</td>
                        </tr>
                        <tr>
                          <td>구분</td>
                          <td>{item.clCdNm}</td>
                        </tr>
                        <tr>
                          <td>주소</td>
                          <td>{item.addr}</td>
                        </tr>
                        <tr>
                          <td>홈페이지</td>
                          <td>{item.hospUrl}</td>
                        </tr>
                        <tr>
                          <td>전화번호</td>
                          <td>{item.telno}</td>
                        </tr>
                        <tr>
                          <td>의사수</td>
                          <td>{item.pchrgUdrTotCntseYn}</td>
                        </tr>
                        {/* <tr>
                          <td>특징</td>
                          <td>
                          {
                           specialitem.map((data, index)=>(
                            <SpecialItem>{data.srchCdNm}</SpecialItem>
                            ))
                          }
                          </td>
                        </tr>
                        <tr>
                          <td>병원의사수</td>
                          <td>
                          <Row style ={{flexWrap:"wrap"}}>
                          {
                          departmentitems.map((data)=>(
                          
                            <FlexstartRow>
                              <div>{data.dgsbjtCdNm}</div>
                              <div>{data.dtlSdrCnt}명</div>
                            </FlexstartRow>
                          ))
                          }
                          </Row>
                          </td>
    
                        </tr>
                        <tr>
                          <td>장비</td>
                          <td>
                          <Row style ={{flexWrap:"wrap"}}>
                          {
                            equipmentitems.map((data)=>(
                            <FlexstartRow>
                            <div>{data.oftCdNm}</div>
                            <div>{data.oftCnt}개</div>
                            </FlexstartRow>
                            ))
                          }
                          </Row>
                          </td>
                        </tr> */}
                       
                        
                      </tbody>
                      </Table> 
    
                              
                  </TableLayout>
                </PopupWorkEx>):(
                  <PopupWorkEx style={{marginTop:10,}}>
                  {
                    resulthospital.map((data)=>(
                      <Box>
                        <div onClick={()=>{_handleView(data)}}>{data.yadmNm}</div>
                      </Box>
                    ))
                  }
                  </PopupWorkEx>
                )
              }
            
            
            </>
           )
        }
  

         
    </Container>
  );

}

export default MobileLifeMedicalHospital;


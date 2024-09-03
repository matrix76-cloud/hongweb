
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column, FlexstartColumn } from "../common/Column";
import { Row } from "../common/Row";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";

import "./medicaltable.css";
import "./medicalinput.css";
import axios from "axios";


const Container = styled.div`
  display:flex;
  flex-direction:column;
  width:100%;
  align-items:flex-start;
  justify-content:center;
  height:100%;
`
const style = {
  display: "flex"
};

const MainLabelInfo = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: 35px;
`


const SubLabelInfo = styled.div`
  font-family: 'Pretendard-Regular';
  font-size: 25px;
`

const Inputstyle={
  width: '40%',
  margin :"0 auto",
  border: '3px solid #ff7e10',
  background: '#fff',
  height: '30px',

}

const StyledInput = styled.input`
  ::placeholder {
    font-size: 22px;
  }
`;


const LifeHealthFood=({containerStyle}) =>  {


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
  const [resultitem, setResultitem] = useState([]);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setSearch(search);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      }
      FetchData();
  }, [])

  const _handleSubmit = (event) => {
    event.preventDefault();

    console.log("TCL: _handleSubmit -> search", search)

    const jsonPayload = {
      name: search,
    };


    axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/foodhealth',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{

      if(response.data.body.items != undefined){
        setResultitem(response.data.body.items);
        console.log("TCL: _handleSubmit -> response.data", response.data)
        setRefresh((refresh) => refresh +1);
      }

    })
    .catch((error) => console.error('Error:', error));
  };

 
  return (

    <Container style={containerStyle}>
        
        <Column style={{width:"100%", height:120}}>
          <Row style={{width:'40%'}}>
          <div><img src={imageDB.shopping} style={{width:"120px", height:"120px"}}/></div>
          <div style={{paddingLeft:30}}>
          <MainLabelInfo>가족 들을 건강하게 </MainLabelInfo>
            <SubLabelInfo>건강식품 알아보고 드세요</SubLabelInfo>
          </div>
   
          </Row>

        </Column>

        <Column style={{width:"100%", height:100, background:'#fff', position:"sticky", top:170}}>
        
          <Row style={{width:'100%'}}>
            <input className="custom-input" type="text" style={Inputstyle}
            value={search} onChange={(e)=>{
              setSearch(e.target.value);
              setRefresh((refresh) => refresh +1);
            }}
            placeholder="알아보고자 하는 건강식품 이름을 넣어주세여" />
            <img className ="searchicon" src={imageDB.search} style={{width:32, height:32, position:"absolute", left:'68%'}} onClick={_handleSubmit}/>
          </Row>
   
        </Column>

        <Column style={{ margin:"0 auto", width:'70%'}}>
          {
            resultitem.map((data)=>(
              <Table class="custom-table" style={{marginBottom:20}}>
              <tbody>
                <tr>
                  <td>이름</td>
                  <td>{ data.item.PRDUCT}</td>
                </tr>           
                <tr>
                  <td>제조사</td>
                  <td>{data.item.ENTRPS}</td>
                </tr>
                <tr>
                  <td>등록일</td>
                  <td>{data.item.REGIST_DT}</td>
                </tr>
                <tr>
                  <td>유효기간</td>
                  <td>{data.item.DISTB_PD}</td>
                </tr>
                <tr>
                  <td>특징</td>
                  <td>{data.item.SUNGSANG}</td>
                </tr>
                <tr>
                  <td>사용법</td>
                  <td>{data.item.SRV_USE}</td>
                </tr>
                <tr>
                  <td>보관방법</td>
                  <td>{data.item.PRSRV_PD}</td>
                </tr>
                <tr>
                  <td>부작용</td>
                  <td>{data.item.INTAKE_HINT1}</td>
                </tr>
                <tr>
                  <td>기능</td>
                  <td>{data.item.MAIN_FNCTN}</td>
                </tr>
              </tbody>
              </Table>
            ))
          }

        </Column>
         
    </Container>
  );

}

export default LifeHealthFood;


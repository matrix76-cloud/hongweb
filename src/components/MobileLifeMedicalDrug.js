
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column, FlexstartColumn } from "../common/Column";
import { FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";

import "./medicaltable.css";
import "./medicalinput.css";
import axios from "axios";
import LottieAnimation from "../common/LottieAnimation";
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

const MainLabelInfo = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: 20px;
`


const SubLabelInfo = styled.div`
  font-family: 'Pretendard-Regular';
  font-size: 18px;
`



const StyledInput = styled.input`
  ::placeholder {
    font-size: 22px;
  }
`;


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

const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "400px",
  position:"absolute"
}


const MobileLifeMedicalDrug=({containerStyle}) =>  {


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
  const [show, setShow] = useState(true);
  const [searching, setSearching] = useState(false);

  const scrollableDivRef = useRef(null);

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



  /**
   * 페이지내에 스크롤을 막아 주는 코드입니다 
   */
  // useEffect(() => {
  //     document.documentElement.style.scrollbarGutter = 'stable'; // 추가
  
  //     if (show) document.body.style.overflow = 'hidden';
  //     return () => {
  //       document.body.style.overflow = 'unset';
  //     };
  //   }, [show]);

  const _handleSubmit = (event) => {
    event.preventDefault();
    Searchfunc();
  };

 
  const handleKeyDown = (event)=>{
    if (event.key === 'Enter') {
      Searchfunc();
    }

  }

  function Searchfunc(){

    console.log("TCL: _handleSubmit -> search", search);
    setSearching(true);

    const jsonPayload = {
      name: search,
    };


    axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/medicalmedicine',  jsonPayload, {
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

      setSearching(false);
      setRefresh((refresh) => refresh +1);
    })
    .catch((error) => {
      setSearching(false);
      setRefresh((refresh) => refresh +1);
      console.error('Error:', error)});

    
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
                placeholder="약 이름 입력" />
                <img className ="searchicon" src={imageDB.redsearch} style={{width:20, height:20, position:"absolute", left:'88%'}} onClick={_handleSubmit}/>

        </SearchLayer>

        <FlexstartRow style={{width:"100%", marginBottom:10}}>
                    <img src={imageDB.infocircle} width={16} height={16} o/>
                    <span style={{fontSize:"12px", color :"#636363", marginLeft:5}}>알아보고자 약이름을 넣어주세요</span>                  
        </FlexstartRow>

      </Column>

      {/* <SearchLayer>

        
        <input className="custom-input" type="text" style={Inputstyle}
        onKeyDown={handleKeyDown} 
        value={search} onChange={(e)=>{
          setSearch(e.target.value);
          setRefresh((refresh) => refresh +1);
        
        }}
        placeholder="알아보고자 하는 약이름을 넣어주세여" />
        <img className ="searchicon" src={imageDB.search} style={{width:20, height:20, position:"absolute", left:'82%'}} onClick={_handleSubmit}/>
      </SearchLayer> */}

      <>
      {
          searching == true ? (<LottieAnimation containerStyle={LoadingStyle} animationData={imageDB.loading}
            width={"100px"} height={'100px'}/>)
          :( <Column style={{ margin:"0 auto", width:'100%'}}>

        <FlexstartRow style={{width:"100%", marginTop:20, marginBottom:10, borderBottom: "1px solid #000"}}>
          <ResultLabel label={"'"+search +"'" +'검색 결과'} result = {resultitem.length} unit={'건'}/>
        </FlexstartRow>


        {
        resultitem.map((data)=>(
        <Table class="custom-table" style={{marginBottom:20}}>
        <tbody>
        <tr>
          <td style={{maxWidth:'30px'}}>이름</td>
          <td>{data.itemName}</td>
        </tr>

        <tr>
          <td>제품이미지</td>
          <td><img src={data.itemImage} style={{width:50, height:50}}/></td>
        </tr>
        <tr>
          <td>제조사</td>
          <td>{data.entpName}</td>
        </tr>
        <tr>
          <td>효능</td>
          <td>{data.efcyQesitm}</td>
        </tr>
        <tr>
          <td>사용법</td>
          <td>{data.useMethodQesitm}</td>
        </tr>
        <tr>
          <td>사용전유의사항</td>
          <td>{data.atpnWarnQesitm}</td>
        </tr>
        <tr>
          <td>사용상주의사항</td>
          <td>{data.atpnQesitm}</td>
        </tr>
        <tr>
          <td>주의해야할 약/음식</td>
          <td>{data.intrcQesitm}</td>
        </tr>
        <tr>
          <td>부작용</td>
          <td>{data.seQesitm}</td>
        </tr>
        <tr>
          <td>보관방법</td>
          <td>{data.depositMethodQesitm}</td>
        </tr>
        </tbody>
        </Table>
        ))
        }
   

        </Column>)
      }
      </>
    
         
    </Container>
  );

}

export default MobileLifeMedicalDrug;


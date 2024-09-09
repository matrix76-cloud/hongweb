
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
import Border from "../common/Border";
import Empty from "./Empty";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp  } from "react-icons/io";


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
  top: "300px",
  position:"absolute"
}

const Label = styled.div`
  font-size: 14px;
  color : #131313;
  font-weight: 500
`
const Content = styled.div`
  font-size: 12px;
  color : #636363;
  line-height:2.5;
`

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
    setResultitem(resultitem);
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

        response.data.body.items.map((data)=>{
          data.efcyQesitmopen = false;
          data.useMethodQesitmopen = false;
          data.atpnQesitmopen = false;
          data.intrcQesitmopen = false;
          data.seQesitmopen = false;
          data.depositMethodQesitmopen = false;
        
        })

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

  const _handleView= (index)=>{
    if(resultitem[index].OPEN ){
      resultitem[index].OPEN = false;
    }else{
      resultitem[index].OPEN = true;
    }
    setRefresh((refresh) => refresh +1);
  }

  const _handleefcyQesitmView= (index)=>{
    if(resultitem[index].efcyQesitmopen ){
      resultitem[index].efcyQesitmopen = false;
    }else{
      resultitem[index].efcyQesitmopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }
  const _handleuseMethodQesitmView= (index)=>{
    if(resultitem[index].useMethodQesitmopen ){
      resultitem[index].useMethodQesitmopen = false;
    }else{
      resultitem[index].useMethodQesitmopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }
  const _handleatpnQesitmView= (index)=>{
    if(resultitem[index].atpnQesitmopen ){
      resultitem[index].atpnQesitmopen = false;
    }else{
      resultitem[index].atpnQesitmopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }

  const _handleintrcQesitmView= (index)=>{
    if(resultitem[index].intrcQesitmopen ){
      resultitem[index].intrcQesitmopen = false;
    }else{
      resultitem[index].intrcQesitmopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }
  const _handleseQesitmView= (index)=>{
    if(resultitem[index].seQesitmopen ){
      resultitem[index].seQesitmopen = false;
    }else{
      resultitem[index].seQesitmopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }
  
  const _handledepositMethodQesitmView= (index)=>{
    if(resultitem[index].depositMethodQesitmopen ){
      resultitem[index].depositMethodQesitmopen = false;
    }else{
      resultitem[index].depositMethodQesitmopen = true;
    }
    setRefresh((refresh) => refresh +1);
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

        <FlexstartRow style={{width:"100%", marginBottom:10, background:"#fff"}}>
                    <img src={imageDB.infocircle} width={16} height={16} o/>
                    <span style={{fontSize:"12px", color :"#636363", marginLeft:5}}>알아보고자 약이름을 넣어주세요</span>                  
        </FlexstartRow>

      </Column>

      <>
      {
          searching == true ? (<LottieAnimation containerStyle={LoadingStyle} animationData={imageDB.loading}
            width={"50px"} height={'50px'}/>)
          :( <Column style={{ margin:"0 auto", width:'100%'}}>

        <FlexstartRow style={{width:"100%", marginTop:20, marginBottom:10, borderBottom: "1px solid #000"}}>
          {
            search != '' ? (<ResultLabel label={"'"+search +"'" +'검색 결과'} result = {resultitem.length} unit={'건'}/>)
            :(<ResultLabel label={'검색 결과'} result = {resultitem.length} unit={'건'}/>)
          }

        </FlexstartRow>


        {
          resultitem.map((data, index)=>(

          <div style={{width:"90%", margin:"0 auto"}}>
            <Column style={{alignItems:"flex-start"}}>
            <Row style={{width:"100%"}}>
            <Column style={{width:'30%', alignItems:"flex-start"}}>
              <img src={data.itemImage} style={{width:80, height:80, borderRadius:"10px"}}/>
            </Column>
    
            <Column style={{width:'70%',alignItems:"flex-start"}}>
              <div style={{color:"#131313", fontSize:'16px'}}>{data.itemName}</div>
              <div style={{color:"#636363", fontSize:'12px', marginTop:10}}>{data.entpName}</div>
            </Column>
            </Row>
            <Border/>
            <Column onClick={()=>{_handleefcyQesitmView( index)}} style={{ alignItems:"flex-start"}}> 
              <Row style={{justifyContent:"center", alignItems:"center"}}>
                <Label>효능</Label>
                <div style={{marginLeft:10, paddingTop:5}}>
                    {
                        data.efcyQesitmopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                    }
                </div>
              </Row>

              {
                data.efcyQesitmopen == true && <Content>{data.efcyQesitm}</Content>
              }
            
            </Column>
            <Border/>
            <Column onClick={()=>{_handleuseMethodQesitmView( index)}} style={{ alignItems:"flex-start"}}> 
              <Row style={{justifyContent:"center", alignItems:"center"}}>
                <Label>사용법</Label>
                <div style={{marginLeft:10, paddingTop:5}}>
                    {
                        data.useMethodQesitmopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                    }
                </div>
              </Row>

              {
                data.useMethodQesitmopen == true && <Content>{data.useMethodQesitm}</Content>
              }
            
            </Column>
            <Border/>
            <Column onClick={()=>{_handleatpnQesitmView( index)}} style={{ alignItems:"flex-start"}}> 
              <Row style={{justifyContent:"center", alignItems:"center"}}>
                <Label>사용상 주의사항</Label>
                <div style={{marginLeft:10, paddingTop:5}}>
                    {
                        data.atpnQesitmopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                    }
                </div>
              </Row>

              {
                data.atpnQesitmopen == true && <Content>{data.atpnQesitm}</Content>
              }
            
            </Column>
            <Border/>
            <Column onClick={()=>{_handleintrcQesitmView( index)}} style={{ alignItems:"flex-start"}}> 
              <Row style={{justifyContent:"center", alignItems:"center"}}>
                <Label>주의해야할 약 음식</Label>
                <div style={{marginLeft:10, paddingTop:5}}>
                    {
                        data.intrcQesitmopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                    }
                </div>
              </Row>

              {
                data.intrcQesitmopen == true && <Content>{data.intrcQesitm}</Content>
              }
            
            </Column>
            <Border/>
            <Column onClick={()=>{_handleseQesitmView( index)}} style={{ alignItems:"flex-start"}}> 
              <Row style={{justifyContent:"center", alignItems:"center"}}>
                <Label>부작용</Label>
                <div style={{marginLeft:10, paddingTop:5}}>
                    {
                        data.seQesitmopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                    }
                </div>
              </Row>

              {
                data.seQesitmopen == true && <Content>{data.seQesitm}</Content>
              }
            
            </Column>
            <Border/>
   

            <Column onClick={()=>{_handledepositMethodQesitmView( index)}} style={{ alignItems:"flex-start"}}> 
              <Row style={{justifyContent:"center", alignItems:"center"}}>
                <Label>보관 방법</Label>
                <div style={{marginLeft:10, paddingTop:5}}>
                    {
                        data.depositMethodQesitmopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                    }
                </div>
              </Row>

              {
                data.depositMethodQesitmopen == true && <Content>{data.depositMethodQesitm}</Content>
              }
            
            </Column>
            <Border bgcolor={'#000'} containerStyle={{margin:"20px 0px"}}/>
            </Column>
  
          </div>

          ))
        }
        {
          resultitem.length == 0 && <Empty content = "검색에 맞는 약이 존재 하지 않습니다"
          containerStyle={{marginTop:"150px"}}
          />
        }
   

        </Column>)
      }
      </>
    
         
    </Container>
  );

}

export default MobileLifeMedicalDrug;


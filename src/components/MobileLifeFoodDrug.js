
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
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
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp  } from "react-icons/io";
import Empty from "./Empty";
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



const MobileLifeFoodDrug=({containerStyle}) =>  {


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


    axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/foodhealth',  jsonPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) =>{

      if(response.data.body.items != undefined){

        response.data.body.items.map((data)=>{
          data.item.REGIST_DTopen = false;
          data.item.DISTB_PDopen  = false;
          data.item.SUNGSANGopen  = false;
          data.item.SRV_USEopen  = false;
          data.item.PRSRV_PDopen  = false;
          data.item.INTAKE_HINT1open  = false;
          data.item.MAIN_FNCTNopen  = false;
        })

        setResultitem(response.data.body.items);
        console.log("TCL: _handleSubmit -> response.data", response.data)
        setRefresh((refresh) => refresh +1);
      }
      setSearching(false);
      setRefresh((refresh)=>refresh+1);

    })
    .catch((error) =>{
      setSearching(false);
      setRefresh((refresh)=>refresh+1);
      console.error('Error:', error)
    });
  }

  const _handleREGIST_DTopenView = (index)=>{
    if(resultitem[index].item.REGIST_DTopen ){
      resultitem[index].item.REGIST_DTopen = false;
    }else{
      resultitem[index].item.REGIST_DTopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }

  const _handleDISTB_PDopenView = (index)=>{
    if(resultitem[index].item.DISTB_PDopen ){
      resultitem[index].item.DISTB_PDopen = false;
    }else{
      resultitem[index].item.DISTB_PDopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }

  const _handleSUNGSANGopenView= (index)=>{
    if(resultitem[index].item.SUNGSANGopen ){
      resultitem[index].item.SUNGSANGopen = false;
    }else{
      resultitem[index].item.SUNGSANGopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }
  const _handleSRV_USEopenView= (index)=>{
    if(resultitem[index].item.SRV_USEopen ){
      resultitem[index].item.SRV_USEopen = false;
    }else{
      resultitem[index].item.SRV_USEopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }
  const _handlePRSRV_PDopenView= (index)=>{
    if(resultitem[index].item.PRSRV_PDopen ){
      resultitem[index].item.PRSRV_PDopen = false;
    }else{
      resultitem[index].item.PRSRV_PDopen = true;
    }
    setRefresh((refresh) => refresh +1);
  }
  
  const _handleINTAKE_HINT1openView= (index)=>{
    if(resultitem[index].item.INTAKE_HINT1open ){
      resultitem[index].item.INTAKE_HINT1open = false;
    }else{
      resultitem[index].item.INTAKE_HINT1open = true;
    }
    setRefresh((refresh) => refresh +1);
  }
  const _handleMAIN_FNCTNopenView= (index)=>{
    if(resultitem[index].item.MAIN_FNCTNopen ){
      resultitem[index].item.MAIN_FNCTNopen = false;
    }else{
      resultitem[index].item.MAIN_FNCTNopen = true;
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
                placeholder="건강식품 이름 입력" />
                <img className ="searchicon" src={imageDB.redsearch} style={{width:20, height:20, position:"absolute", left:'88%'}} onClick={_handleSubmit}/>

        </SearchLayer>

        <FlexstartRow style={{width:"100%", marginBottom:10, background:"#fff"}}>
                    <img src={imageDB.infocircle} width={16} height={16} o/>
                    <span style={{fontSize:"12px", color :"#636363", marginLeft:5,background:"#fff"}}>알아보고자 건강식품이름을 넣어주세요</span>                  
        </FlexstartRow>

      </Column>



      <>
      {
          searching == true ? (<LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loading}
            width={"50px"} height={'50px'}/>)
          :( <Column style={{ margin:"0 auto", width:'100%'}}>

        <FlexstartRow style={{width:"100%", marginTop:20, marginBottom:10, borderBottom: "1px solid #000"}}>
          <ResultLabel label={"'"+search +"'" +'검색 결과'} result = {resultitem.length} unit={'건'}/>
        </FlexstartRow> 
          {/* {
            resultitem.map((data)=>(
              <Table class="custom-table" style={{marginBottom:20}}>
              <tbody>
                <tr>
                  <td style={{maxWidth:'30px'}}>이름</td>
                  <td>{data.item.PRDUCT}</td>
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
          } */}

          {
            resultitem.map((data, index)=>(

            <div style={{width:"90%", margin:"0 auto"}}>
              <Column style={{alignItems:"flex-start"}}>
              <Row style={{width:"100%"}}>
              <Column style={{width:'100%',alignItems:"flex-start"}}>
                <div style={{color:"#131313", fontSize:'16px'}}>{data.item.PRDUCT}</div>
                <div style={{color:"#636363", fontSize:'12px', marginTop:10}}>{data.item.ENTRPS}</div>
              </Column>
              </Row>
              <Border/>
              <Column onClick={()=>{_handleREGIST_DTopenView( index)}} style={{ alignItems:"flex-start"}}> 
                <Row style={{justifyContent:"center", alignItems:"center"}}>
                  <Label>등록일</Label>
                  <div style={{marginLeft:10, paddingTop:5}}>
                      {
                          data.item.REGIST_DTopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                      }
                  </div>
                </Row>

                {
                  data.item.REGIST_DTopen == true && <Content>{data.item.REGIST_DT}</Content>
                }
              
              </Column>
              <Border/>
              <Column onClick={()=>{_handleDISTB_PDopenView( index)}} style={{ alignItems:"flex-start"}}> 
                <Row style={{justifyContent:"center", alignItems:"center"}}>
                  <Label>유효기간</Label>
                  <div style={{marginLeft:10, paddingTop:5}}>
                      {
                          data.item.DISTB_PDopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                      }
                  </div>
                </Row>

                {
                  data.item.DISTB_PDopen == true && <Content>{data.item.DISTB_PD}</Content>
                }
              
              </Column>
              <Border/>
              <Column onClick={()=>{_handleSUNGSANGopenView( index)}} style={{ alignItems:"flex-start"}}> 
                <Row style={{justifyContent:"center", alignItems:"center"}}>
                  <Label>특징</Label>
                  <div style={{marginLeft:10, paddingTop:5}}>
                      {
                          data.item.SUNGSANGopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                      }
                  </div>
                </Row>

                {
                  data.item.SUNGSANGopen == true && <Content>{data.item.SUNGSANG}</Content>
                }
              
              </Column>
              <Border/>
              <Column onClick={()=>{_handleSRV_USEopenView( index)}} style={{ alignItems:"flex-start"}}> 
                <Row style={{justifyContent:"center", alignItems:"center"}}>
                  <Label>사용법</Label>
                  <div style={{marginLeft:10, paddingTop:5}}>
                      {
                          data.item.SRV_USEopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                      }
                  </div>
                </Row>

                {
                  data.item.SRV_USEopen == true && <Content>{data.item.SRV_USE}</Content>
                }
              
              </Column>
              <Border/>
              <Column onClick={()=>{_handlePRSRV_PDopenView( index)}} style={{ alignItems:"flex-start"}}> 
                <Row style={{justifyContent:"center", alignItems:"center"}}>
                  <Label>보관방법</Label>
                  <div style={{marginLeft:10, paddingTop:5}}>
                      {
                          data.item.PRSRV_PDopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                      }
                  </div>
                </Row>

                {
                  data.item.PRSRV_PDopen == true && <Content>{data.item.PRSRV_PD}</Content>
                }
              
              </Column>
              <Border/>
              <Column onClick={()=>{_handleMAIN_FNCTNopenView( index)}} style={{ alignItems:"flex-start"}}> 
                <Row style={{justifyContent:"center", alignItems:"center"}}>
                  <Label>기능</Label>
                  <div style={{marginLeft:10, paddingTop:5}}>
                      {
                          data.item.MAIN_FNCTNopen == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                      }
                  </div>
                </Row>

                {
                  data.item.MAIN_FNCTNopen == true && <Content>{data.item.MAIN_FNCTN}</Content>
                }
              
              </Column>
              <Border/>
    
              
              <Column onClick={()=>{_handleINTAKE_HINT1openView( index)}} style={{ alignItems:"flex-start"}}> 
                <Row style={{justifyContent:"center", alignItems:"center"}}>
                  <Label>부작용</Label>
                  <div style={{marginLeft:10, paddingTop:5}}>
                      {
                          data.item.INTAKE_HINT1open == false ? (<div><IoIosArrowDown/></div>):(<div><IoIosArrowUp /></div>)
                      }
                  </div>
                </Row>

                {
                  data.item.INTAKE_HINT1open == true && <Content>{data.item.INTAKE_HINT1}</Content>
                }
              
              </Column>
              <Border bgcolor={'#000'} containerStyle={{margin:"20px 0px"}}/>
              </Column>
    
            </div>

            ))
          }
          {
            resultitem.length == 0 && <Empty content = "검색에 맞는 건강식품이 존재 하지 않습니다"
            containerStyle={{marginTop:"150px"}}
            />
          }
          </Column>
          
        )
      }
      </>

         
    </Container>
  );

}

export default MobileLifeFoodDrug;


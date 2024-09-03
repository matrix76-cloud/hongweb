
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import PcHospitalpopup from "../modal/PcHospitalPopup/PcHospitalPopup";
import { imageDB } from "../utility/imageData";

import "./table.css"


const Container = styled.div`

`
const style = {
  display: "flex"
};





const LifeHospital =({containerStyle, items}) =>  {


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
  const [popupstatus, setPopupstatus] = useState(false);
  const [ykiho, setYkiho] = useState('');
  const [name, setName] = useState('');

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setPopupstatus(popupstatus);
    setName(name);
    setYkiho(ykiho);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      }
      FetchData();
  }, [])

  const popupcallback =() =>{
    setPopupstatus(false);
    setRefresh((refresh) => refresh +1);
  }
 
  const popup = (ykiho,name) =>{
  console.log("TCL: popup -> ykiho", ykiho)
  console.log("TCL: popup -> name", name)

    
    setPopupstatus(true);
    setName(name);
    setYkiho(ykiho);
    setRefresh((refresh) => refresh +1);
  }
  return (

    <Container style={containerStyle}>

    {popupstatus == true ? (
        <PcHospitalpopup callback={popupcallback}
        top={'30px'}  left={'18%'} height={'640px'} width={'1080px'} image={imageDB.sample11}
        name={name} ykiho= {ykiho}
        ></PcHospitalpopup>
      ) : null}

      
            <Table>
            <thead>
            <tr>
                <td>이름</td>
                <td>구분</td>
                <td>주소</td>
                <td>홈페이지</td>
                <td>전화번호</td>
                <td>의사수</td>
                <td>내용</td>
                <td>내용</td>
                <td>내용</td>
                <td>상세보기</td>
            </tr>
            </thead>

            <tbody>
            {
                items.map((data, index)=>(
                  <>
                            {
                    index < 500 &&   <tr>
                    <td>{data.yadmNm}</td>
                    <td>{data.clCdNm}</td>
                    <td>{data.addr}</td>
                    <td>
                    {data.hospUrl.slice(0, 20)}
                    {data.hospUrl.length > 20 ? "..." : null}
                    </td>
                    <td>{data.telno}</td>
                    <td>{data.drTotCnt}</td>
                    <td>{data.cmdcGdrCnt}/{data.cmdcIntnCnt}/{data.cmdcResdntCnt}/{data.cmdcSdrCnt}</td>
                    <td>{data.cmdcGdrCnt}/{data.cmdcIntnCnt}/{data.cmdcResdntCnt}/{data.cmdcSdrCnt}</td>
                    <td>{data.cmdcGdrCnt}/{data.cmdcIntnCnt}/{data.cmdcResdntCnt}/{data.cmdcSdrCnt}</td>
                    <td><span style={{textDecoration:"underline"}} onClick={()=>{popup(data.ykiho, data.yadmNm)}}>상세보기</span></td>

                  </tr>
                  }
                  </>
        
              
            ))
            }
            </tbody>
            </Table>


         
    </Container>
  );

}

export default LifeHospital;


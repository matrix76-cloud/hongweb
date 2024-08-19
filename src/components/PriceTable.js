import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { ROOMSIZE } from "../utility/room";
import "./PriceTable.css";



const Container = styled.div`
    width: 90%;
    margin: 10px auto;
    text-align: center;
`
const style = {
  display: "flex"
};

const PriceTable =({containerStyle}) =>  {

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

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
    } 
    FetchData();
  }, [])
  useEffect(()=>{

  },[refresh])

 
  return (

    <Container style={containerStyle}>
        <table>
            <caption style={{fontSize:12, textAlign:"right"}}>가격표 <span style={{fontSize:10}}>(월기준 가격)</span></caption>
            <tbody>
                <tr>
                    <td className="tdspanbold">{ROOMSIZE.MINI}</td>
                    <td className="tdspan" style={{color:"#ff0000"}}>70,000원</td>
                    <td className="tdspanbold">{ROOMSIZE.LIGHT}</td>
                    <td className="tdspan" style={{color:"#ff0000"}}>70,000원</td>
               
           
                    
                </tr>
                <tr>
                    <td className="tdspanbold">{ROOMSIZE.LIGHTPLUS}</td>
                    <td className="tdspan" style={{color:"#ff0000"}}>70,000원</td>
                    <td className="tdspanbold">{ROOMSIZE.SMALL}</td>
                    <td className="tdspan">{'없음'}</td>
                </tr>
                <tr>
                    <td className="tdspanbold">{ROOMSIZE.MEDIUM}</td>
                    <td className="tdspan">{'없음'}</td>
                    <td className="tdspanbold">{ROOMSIZE.LARGE}</td>
                    <td className="tdspan">{'없음'}</td>
                </tr>
            </tbody>
        </table>
   
    </Container>
  );

}

export default PriceTable;


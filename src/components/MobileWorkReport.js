
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../common/Button";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import { REQUESTINFO } from "../utility/work";




const Container = styled.div`
  width:90%;
`
const style = {
  display: "flex"
};

const ResultContent = {
  width: '180px',
  fontSize: '14px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
 
}



const MobileWorkReport =({containerStyle, messages, WORK_ID}) =>  {

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

  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      }
      FetchData();
  }, [])
  const _handleReset = () =>{

  }
  const _handleReqComplete =(index) =>{

  }

 
  return (

    <Container style={containerStyle}>

        <table class="workreport-table" style={{  margin: '5px auto', borderTop: "1px solid #434343"}}>
             
             <tbody>
               {
                 messages.map((data)=>(
                   <>
                   {
                   data.type =='response' &&
                   <tr>
                   <td>{data.requesttype}</td>
                   <td>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                    {
                      data.requesttype == REQUESTINFO.COMMENT ? (
                      <textarea style={ResultContent} value={data.result}/>):(
                      <div> {data.result}</div>
                    )
                    }  

                    {
                      data.requesttype == REQUESTINFO.CUSTOMERREGION &&
                      <div><img src={imageDB.map} style={{width:20}}/> </div>
                    }
                    </div>
                   </td>
                   </tr>
                   }
                   </>                  
                 ))
               }
             </tbody>
        </table>

        <div style={{display:"flex", flexDirection:"row", margin:'10px auto', width:'100%',justifyContent: "space-between" }}>
          
          <Button containerStyle={{border: '1px solid #C3C3C3', fontSize:16, marginTop:10, fontWeight:600}} onPress={_handleReset} height={'44px'} width={'48%'} radius={'4px'} bgcolor={'#FFF'} color={'#131313'} text={'다시작성하기'}/>
          <Button containerStyle={{border: 'none', fontSize:16, marginTop:10, fontWeight:600}} onPress={()=>{_handleReqComplete(WORK_ID)}} height={'44px'} width={'48%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'요청하기'}/>

        </div>

    </Container>
  );

}

export default MobileWorkReport;


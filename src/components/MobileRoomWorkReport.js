
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../common/Button";
import { UserContext } from "../context/User";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import MobileWorkMapPopup from "../modal/MobileMapPopup/MobileWorkMapPopup";
import { imageDB, Seekimage } from "../utility/imageData";
import { REQUESTINFO } from "../utility/work_";




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



const MobileRoomWorkReport =({containerStyle, messages, ROOM_ID, ROOMTYPE}) =>  {

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

  const [latitude, setLatitude] = useState('');
  const [longitudie, setLongitude] = useState('');
  const [roomtype, setRoomtype] = useState(ROOMTYPE);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setPopupstatus(popupstatus);
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

  const popupcallback = async () => {
    setPopupstatus(!popupstatus);
    setRefresh((refresh) => refresh +1);
  };

  const _handleMapview= (lat, long, worktype)=>{

    setPopupstatus(true);
    setLatitude(lat);
    setLongitude(long);
    setRoomtype(roomtype);
    setRefresh((refresh) => refresh +1);

  }

 
  return (

    <Container style={containerStyle}>

      {
        popupstatus == true && <MobileWorkMapPopup callback={popupcallback} latitude={latitude} longitude={longitudie}
        top={'30%'}  left={'10%'} height={'280px'} width={'280px'} name={roomtype} markerimg={Seekimage(roomtype)}
        />
      }

        <table class="workreport-table" style={{  margin: '10px auto', borderTop: "1px solid #434343"}}>
             
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
                      <div> {
                        data.requesttype == REQUESTINFO.ROOM ? (<img src={data.result} style={{width:200, height:180}} />) :(
                        <div>{ data.result}</div>
                        ) 
                      }</div>
                    )
                    }  

                    {
                      data.requesttype == REQUESTINFO.CUSTOMERREGION &&
                      <div  onClick={()=>{_handleMapview(data.latitude,data.longitude, messages.WORKTYPE)}}><img src={imageDB.map} style={{width:20}}/> </div>
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

        <div style={{display:"flex", flexDirection:"row", margin:'10px auto', width:'100%',justifyContent: "center" }}>
          
          {/* <Button containerStyle={{border: '1px solid #C3C3C3', fontSize:16, marginTop:10, fontWeight:600}} onPress={_handleReset} height={'44px'} width={'48%'} radius={'4px'} bgcolor={'#FFF'} color={'#131313'} text={'다시작성하기'}/> */}
          <Button containerStyle={{border: 'none', fontSize:16, marginTop:10, fontWeight:600}} onPress={()=>{_handleReqComplete(ROOM_ID)}} height={'44px'} width={'90%'} radius={'4px'} bgcolor={'#FF7125'} color={'#fff'} text={'요청하기'}/>

        </div>

    </Container>
  );

}

export default MobileRoomWorkReport;


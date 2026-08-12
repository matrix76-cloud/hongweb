
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Button from "../common/Button";
import LottieAnimation from "../common/LottieAnimation";
import { UserContext } from "../context/User";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import MobileWorkMapPopup from "../modal/MobileMapPopup/MobileWorkMapPopup";
import MobileSuccessPopup from "../modal/MobileSuccessPopup/MobileSuccessPopup";
import { CreateChat, ReadChat } from "../service/ChatService";

import { Readuserbyusersid } from "../service/UserService";
import { ReadWorkByIndividually } from "../service/WorkService";
import { imageDB, Seekimage } from "../utility/imageData";
import { REQUESTINFO } from "../utility/work_";
import WorkLocationMap from "./WorkLocationMap";




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

const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

const MobileWorkReport =({containerStyle, messages, WORK_ID, WORKTYPE, WORK_STATUS}) =>  {

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
  const [worktype, setWorktype] = useState(WORKTYPE);


  const [supporterwork, setSupporterwork] = useState(false);
  const [ownerwork, setOwnerwork] = useState(false);
  const [closework, setClosework] = useState(false);
  const [currentloading, setCurrentloading] = useState(true);

  const [supportWorkSuccess, setSupportWorkSuccess] = useState(false);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setPopupstatus(popupstatus);  
    setSupporterwork(supporterwork);
    setOwnerwork(ownerwork);
    setClosework(closework);
    setSupportWorkSuccess(supportWorkSuccess);
    setCurrentloading(currentloading);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      // 마감되었는지 확인 필요
      if(WORK_STATUS == 1){
          setClosework(true);
       }

       // 자신의 소유인지 확인 필요
       const WORK_INFO = await ReadWorkByIndividually({WORK_ID});
       if(WORK_INFO.USERS_ID == user.users_id){
          setOwnerwork(true);
       }

       // 지원 햇는지 확인 필요
       const USERS_ID = user.users_id;
       const chatitems = await ReadChat({USERS_ID});


       if(chatitems != -1){
        const FindIndex = chatitems.findIndex(x=>workOf(x).WORK_ID == WORK_ID);
        if(FindIndex != -1){
         if(chatitems[FindIndex].SUPPORTER_ID == USERS_ID){
           setSupporterwork(true);
         }
        }
       }
  
       setCurrentloading(false);
      }
      FetchData();
  }, [])
  const _handleReset = () =>{

  }

  /**
   * WORK_ID를가지고 
   * 1) WORK 정보를 가져돈다
   * 2) 지원자 의 정보를 가져온다
   */
  const _handleReqComplete = async(WORK_ID) =>{
  
     const WORK_INFO = await ReadWorkByIndividually({WORK_ID});

    

     let USERS_ID = WORK_INFO.USERS_ID;
     let OWNER = await Readuserbyusersid({USERS_ID});

     console.log("TCL: _handleReqComplete -> WORK_INFO", USERS_ID, OWNER)
     if(OWNER == -1){
       return;
     }
     const OWNER_ID = OWNER.USERS_ID;

     USERS_ID = user.users_id;;
     const SUPPORTER = await Readuserbyusersid({USERS_ID});
     const SUPPORTER_ID = SUPPORTER.USERS_ID;
     const createchat = await CreateChat({OWNER, OWNER_ID,  SUPPORTER, SUPPORTER_ID, WORK_INFO});

     setSupportWorkSuccess(true);
     setRefresh((refresh) => refresh +1);


  }

  const popupcallback = async () => {
    setPopupstatus(!popupstatus);
    setRefresh((refresh) => refresh +1);
  };

  const supportsuccesscallback = async () =>{
    setSupportWorkSuccess(false);
    navigate("/Mobilechat");
    setRefresh((refresh) => refresh +1);
  }

  /* 금액류에는 "원"을 붙인다 (형 리뷰 2026-08-12).
     "협의필요" 같은 문구나 이미 원이 붙은 값은 그대로 둔다. */
  const MONEY_TYPES = ['금액', '시간과 금액', REQUESTINFO.MONEY];
  const formatValue = (type, value) => {
    const v = String(value ?? '');
    if (!MONEY_TYPES.includes(type)) return v;
    if (!/[0-9]/.test(v) || v.includes('원')) return v;
    const num = Number(v.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(num) && num > 0 ? `${num.toLocaleString('ko-KR')}원` : v;
  };

  // 지역 좌표 — 아이콘을 눌러 팝업을 띄우는 대신 화면에 바로 지도를 보여준다
  const regionPoint = (() => {
    const d = (messages || []).find((x) => x && x.requesttype === REQUESTINFO.CUSTOMERREGION && x.latitude);
    return d ? { lat: d.latitude, lng: d.longitude, addr: d.result } : null;
  })();

  const _handleMapview= (lat, long, worktype)=>{

    setPopupstatus(true);
    setLatitude(lat);
    setLongitude(long);
    setWorktype(worktype);
    setClosework(closework);
    setSupporterwork(supporterwork);
    setOwnerwork(ownerwork);

    setRefresh((refresh) => refresh +1);

  }

 
  return (

    <Container style={containerStyle}>

      {
        popupstatus == true && <MobileWorkMapPopup callback={popupcallback} latitude={latitude} longitude={longitudie}
        top={'30%'}  left={'10%'} height={'280px'} width={'280px'} name={worktype} markerimg={Seekimage(worktype)}
        />
      }

      {
        supportWorkSuccess == true && <MobileSuccessPopup callback={supportsuccesscallback} content ={'일감에 정상적으로 지원되었습니다'} />
      }

      {
        currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>) :(<>
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
                   <textarea style={ResultContent} value={data.result} readOnly/>):(
                   <div>{formatValue(data.requesttype, data.result)}</div>
                 )
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

          {/* 위치 지도 — 팝업 대신 화면에 바로 (형 리뷰 2026-08-12) */}
          {regionPoint && (
            <WorkLocationMap
              latitude={regionPoint.lat}
              longitude={regionPoint.lng}
              address={regionPoint.addr}
              markerimg={Seekimage(WORKTYPE)}
            />
          )}

          {/* 하단 고정 액션 바 — 스크롤과 무관하게 항상 보인다 (형 리뷰 2026-08-12) */}
          <div style={{height:96}} />
          <ActionBar>
   

       {
         closework == true ? (<Button containerStyle={{border: 'none', fontSize:17, fontWeight:700}} height={'52px'} width={'90%'} radius={'10px'} bgcolor={'#EDEDED'} color={'#999'} text={'이미 마감된 일감'}/>)
         :(
           <>
             {
               supporterwork == true && <Button containerStyle={{border: 'none', fontSize:17, fontWeight:700}} height={'52px'} width={'90%'} radius={'10px'} bgcolor={'#EDEDED'} color={'#999'} text={'이미 지원한 일감'}/>
             }

             {
               ownerwork == true && <Button containerStyle={{border: 'none', fontSize:17, fontWeight:700}} height={'52px'} width={'90%'} radius={'10px'} bgcolor={'#EDEDED'} color={'#999'} text={'본인이 등록한 일감'}/>
             }
             {
               (supporterwork ==false && ownerwork == false) && <Button containerStyle={{border: 'none', fontSize:17, fontWeight:700}} onPress={()=>{_handleReqComplete(WORK_ID)}} height={'52px'} width={'90%'} radius={'10px'} bgcolor={'#FF4E19'} color={'#fff'} text={'지원하기'}/>

             }
           </>
         )
       }
          </ActionBar>
          </>)
      }


    </Container>
  );

}

export default MobileWorkReport;


import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../../utility/imageData";

import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import { Column, FlexstartColumn } from "../../../common/Column";

import Button from "../../../common/Button";
import { DataContext } from "../../../context/Data";

import { readuserbydeviceid, Update_attendancebyusersid } from "../../../service/UserService";
import { getDateEx, getDateFullTime, getFullTime } from "../../../utility/date";
import { useDispatch } from "react-redux";
import { ALLREFRESH } from "../../../store/menu/MenuSlice";
import { sleep } from "../../../utility/common";
import LottieAnimation from "../../../common/LottieAnimation";
import { DeleteWorkByWORK_ID, ReadWorkByuserid, UpdateWorkInfoWORKSTATUS } from "../../../service/WorkService";
import MobileWorkItem from "../../MobileWorkItem";
import { FILTERITMETYPE, WORKSTATUS } from "../../../utility/screen";
import Empty from "../../Empty";
import PCStatusChangePopup from "../../../modal/PCStatusChangePopup";
import { RiDeleteBinLine } from "react-icons/ri";
import { PiStopCircleBold } from "react-icons/pi";
import { IoIosRefresh } from "react-icons/io";
import { ReadContactByRELATE } from "../../../service/ContactService";
import { distanceFunc } from "../../../utility/region";
import TimeAgo from 'react-timeago';
import Emptychat from "../../Emptychat";
import ButtonEx from "../../../common/ButtonEx";
import { getFontSize } from "../../../utility/fontsize";
import EmptyState from "../../EmptyState";

const Container = styled.div`
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh - 50px);
  touch-action: pan-y;
  background:#fff;

`

const TagItem = styled.div`

`
const Tag = styled.div`
  background: #ffffff;
  color: #131313;
  padding: 4px 8px;
  border-radius: 5px;
  width: 81px;
  display: flex;
  font-size: ${() => getFontSize(14)}px;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-family: "Pretendard-Light";
  border: 1px solid #ededed;
`
const DisableTag = styled.div`
  background: #F3F3F3;
  color: #A3A3A3;
  padding: 4px 8px;
  border-radius: 5px;
  width:81px;
  display:flex;
  font-size: ${() => getFontSize(14)}px;
  justify-content:center;
  align-items:center;
  font-family:"Pretendard-Light";
`

const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

const Box = styled.div`

    padding: 20px;
    border: 1px solid #ededed;
    width: 100%;
    border-radius: 5px;
    font-size: ${() => getFontSize(14)}px;
    margin: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    line-height:1.5;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 */

`
const ContractStyle = `
.contract-box {
  background: #fff; /* 배경색을 흰색으로 */
  border: 1px solid #ddd; /* 연한 회색 테두리 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 20px;
  width: 100%;
  max-width: 500px; /* 크기 제한 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 종이 느낌의 그림자 */
  margin: 20px auto;
  position: relative;
}

/* 상단 모양: 문서처럼 위쪽에 접힌 효과 */
.contract-box::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 50%;
  width: 60%;
  height: 10px;
  background: linear-gradient(to right, #eee, #ddd);
  border-radius: 50%;
  transform: translateX(-50%);
}

.contract-folder {
  background: #f7f7f7; /* 연한 폴더 색 */
  border: 1px solid #ddd; /* 테두리 */
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 입체감 */
  margin: 20px auto;
  position: relative;
}

/* 상단 폴더 탭 */
// .contract-folder::before {
//   content: "";
//   position: absolute;
//   top: -10px;
//   left: 15px;
//   width: 120px;
//   height: 25px;
//   background: #e0e0e0; /* 폴더 상단 색 */
//   border-top-left-radius: 8px;
//   border-top-right-radius: 8px;
// }

.contract-tab {
  position: absolute;
  top: -14px;
  left: 12px;
  width: 100px;
  height: 30px;
  background: #d9d9d9; /* 폴더 상단 색 */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${() => getFontSize(14)}px; /* 글씨 크기 */
  font-weight: bold;
  color: #333; /* 글자색 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 살짝 입체감 */
}



`
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    fontSize: "18px", // 제목 크기 줄이기
    fontWeight: "bold",
    marginBottom: "16px",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  card: {
    width: "80%",
    maxWidth: "450px", // 카드 크기 조금 줄이기
    backgroundColor: "#f8f7f7",
    padding: "16px", // 패딩 줄이기
    borderRadius: "10px", // 더 부드러운 모서리

    display: "flex",
    flexDirection: "column",
    gap: "6px", // 요소 간 간격 줄이기
  },
  type: {
    fontSize: "15px", // 글자 크기 줄이기
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    fontSize: "14px", // 본문 텍스트 크기 줄이기
    color: "#555",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#8b8b8b",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "center",
    transition: "background 0.2s",
  },
  
};

const WorkType = styled.div`

`
const WorkTypeText = styled.div`
  font-size: ${() => getFontSize(18)}px;
  font-family:Pretendard-SemiBold;
  line-height:23.4px;
`
const DocBtnLayer = styled.div`

    padding: 5px 20px;
    background: #ff7e19;
    color: #fff;
    width: 70%;

    text-align: center;
    font-size: ${() => getFontSize(16)}px;
    margin: 10px auto;
    border-radius: 10px;

`
const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;

const EmptyTitle = styled.div`
    margin-top: 20px;
    font-family: 'Pretendard-SemiBold';
    font-size: ${() => getFontSize(22)}px;
    color: #423f3f;
`

const EmptySubTitle = styled.div`
  margin: 5px 0px;

`

const MobileWorkDoc =({containerStyle}) =>  {
  const reduxdispatch = useDispatch();

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  const [currentloading, setCurrentloading] = useState(true);
  const [contactitems, setContactitems] = useState([]);


  const _handledownload = (downloadurl) => {

    console.log("downlaod", downloadurl);

    window.open(downloadurl, "_blank");


  }



  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{

    setCurrentloading(currentloading);
    setContactitems(contactitems);

  },[refresh])


  async function FetchData(){

    const USERS_ID = user.USERS_ID;

    const contactitempsTmp = await ReadContactByRELATE({ USERS_ID });

    if (contactitempsTmp != -1) {
      setContactitems(contactitempsTmp);
    }

    console.log("contactitempsTmp", contactitempsTmp);

    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);
  }

  /**
   * 초기 페이지 진입시에는 context에 있는 정보를 가져온다
  
   */

  useEffect(()=>{
   FetchData();
  }, [])



  





  return (
    <Container style={containerStyle}>

      {currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>):(  <Column margin={'0px auto;'} width={'100%'} style={{background:"#fff"}} >
  
          <FlexstartRow style={{ flexWrap: "wrap",  margin: "20px auto 50px" }}>
            
     
            <style>{ContractStyle}</style>

            <div style={styles.listContainer}>
              {contactitems.map((contract, index) => (
                <div key={index} className="contract-folder">
                  <div class="contract-tab">계약서</div>
                  <FlexstartRow>
                    <div style={{fontFamily:"Pretendard-SemiBold", fontSize: () => getFontSize(18), margin:"10px 0px"}}><strong>{contract.WORKTYPE}</strong></div>
                  </FlexstartRow>

                  <BetweenRow style={{width:"100%",marginBottom:10}}>
                    <img src={Seekimage(contract.WORKTYPE)} style={{ width: "50px" , height:"50px"}} />
                    <button style={styles.button} onClick={() => { _handledownload(contract.URL) }}>계약서 다운로드</button>
                  </BetweenRow>
  
       
                  <div style={{color:"#999", fontSize: () => getFontSize(12)}}>의뢰인 서명일자: <span>{getDateFullTime(contract.RIGHTCREATEDT)}</span>
                    일꾼 서명일자: <span>{getDateFullTime(contract.LEFTCREATEDT)}</span>
                  </div>
               
                </div>
              ))}
            </div>
     
            {
              contactitems.length == 0 &&
              <>
                <Column>
                  <EmptyState type={'contact'} hideButton={true} />
                </Column>
              </>

            }
          </FlexstartRow>
          <div style={{height:300}}/>
        </Column>)
      }


    </Container>
  );

}

export default MobileWorkDoc;


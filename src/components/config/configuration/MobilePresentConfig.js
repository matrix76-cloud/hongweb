import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column } from "../../../common/Column";
import { BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import { UserContext } from "../../../context/User";
import { imageDB } from "../../../utility/imageData";
import { CONFIGMOVE, EventItems, POINTSTATUS, POINTTYPE } from "../../../utility/screen";
import { REQUESTINFO, WORKNAME } from "../../../utility/work";

import { PiLockKeyLight } from "react-icons/pi"
import { BADGE } from "../../../utility/badge";
import { setRef } from "@mui/material";

import { IoIosRefresh } from "react-icons/io";
import { CreateName } from "../../../utility/data";
import { CountryAddress, MainRegion } from "../../../utility/region";
import MobileSuccessPopup from "../../../modal/MobileSuccessPopup/MobileSuccessPopup";
import { getuserInfobyusers_id, updatealluserbydeviceid, Update_addrbyusersid, Update_addrItemsbyusersid, Update_userinfobyusersid } from "../../../service/UserService";
import { SlEnvelopeOpen } from "react-icons/sl";
import { sleep } from "../../../utility/common";
import LottieAnimation from "../../../common/LottieAnimation";
import { LoadingChatAnimationStyle, LoadingMainAnimationStyle, LoadingMapConfigAnimationStyle, LoadingProfileAnimationStyle } from "../../../screen/css/common";

import Barcode from 'react-barcode';
import { ReadPoint, ReadPOINTByIndividually } from "../../../service/PointService";
import { getDateFullTime } from "../../../utility/date";
import Empty from "../Empty";
import ButtonEx from "../../../common/ButtonEx";
import { LIFEMENU } from "../../../utility/life";
import { getFontSize } from "../../../utility/fontsize";
import { getGiftCoupons, getReadCoupon } from "../../../service/CouponService";
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth, storage, firebaseConfig, firebaseApp } from '../../../api/config';

const Container = styled.div`
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh - 50px);
  touch-action: pan-y;

`
const Content = styled.div`
  width:100%;
  margin-bottom:100px;
  display:flex;
  flex-direction: row;
  flex-wrap:wrap;



`


const style = {
  display: "flex"
};

const ConfigLayer = styled.div`
  margin: 20px auto;
  width:80%;
  bottom: 0px;
  background: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding:20px;

`
const PointLayer = styled.div`
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start; /* 좌측 정렬 */
    gap: 16px; /* 카드 간격 */
    padding: 0px 20px;
}

`

const PointBox = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 15px 10px 0px;
    background :#fff;
    width:40%;


`
const PointLabel = styled.div`

  font-size: ${() => getFontSize(10)}px;
  color: ${({ enable }) => enable === true ? ('#fff') : ('#131313')};   
  background:${({ enable }) => enable === true ? ('#FE6625') : ('#f4f4f4')};   
  padding: 5px 10px;
  border-radius: 50px;
`

const Point = styled.div`
  color: ${({ enable }) => enable === true ? ('#131313') : ('#cdcdcd')};  
  font-size: ${() => getFontSize(20)}px;
  font-family :Pretendard-SemiBold;
`

const PointRegistDesc = styled.div`

    font-size: ${() => getFontSize(14)}px;
    color: #999;
    left: 10px;
`

const PointRegistDate = styled.div`

    font-size: ${() => getFontSize(10)}px;
    color: #999;

`
const PointExpireDate = styled.div`

    font-size: ${() => getFontSize(10)}px;
    color: #999;

`

const BarcodeLayer = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    transform: rotate(90deg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


`

const Layer = styled.div`
  background: #E3F2FD;
  position: absolute;
  top: 70px;
  background: rgb(24 24 24 / 23%);
  z-index: 10;
  font-size: ${() => getFontSize(12)}px;
  width: 80%;
  left: 5%;
  color: #131313;
  padding: 10px;
  display: flex;
  flex-direction: row;

`





const barcodeStyle = {
  fontSize: "10px", // 바코드 텍스트 크기 조정
  textAlign: "center",
  margin: "20px"
};

const ExpireLabel = styled.div`
    position: absolute;
    z-index: 20;
    background: #ffffff;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    right: -5px;
    top: -10px;
    border: 2px double;
    font-size: ${() => getFontSize(10)}px;
    font-family: 'Pretendard-Bold';
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

const SubButton = styled.div`
  background-color : #FFF3E0;
  color: #FF8A00;
  border-radius :16px;
`

const PresentCard = styled.div`
  position: relative;
  background: #f77c2b;  // 배경은 고정 또는 이벤트별 색상
  border-radius: 24px;
  padding: 24px 16px;  // ✅ 이미지 포함 전체 패딩 확보
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
`;


const PresentImage = styled.img`
  width: 100%;
  max-width: 320px;
  height: auto;
  border-radius: 12px;
  object-fit: contain;
  padding: 16px; /* ✅ 이미지 내부 패딩 */
  background: white; /* 배경 구분감 명확히 */
`;


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const MobilePresentConfig =({containerStyle}) =>  {

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
  const [currentloading, setCurrentloading] = useState(true);
  const [presentitems, setPresentitems] = useState([]);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);



  async function FetchData() {

    try {
      const events = await getGiftCoupons({ USERS_ID: user.USERS_ID });


      console.log("fetchdata", events);
      setPresentitems(events);
    } catch (err) {
      console.error("🎁 선물함 데이터 불러오기 실패:", err);
    } finally {
      setCurrentloading(false);
    }



  }

  
  useEffect(()=>{

    FetchData();

  }, [])


  const deleteGift = async (id) => {
    await deleteDoc(doc(db, "USERS", user.USERS_ID, "EVENTS", id));
    setPresentitems(prev => prev.filter(p => p.id !== id));
  };

  return (
    <Container>
      {
      currentloading == true ? (<LottieAnimation
      containerStyle={LoadingMainAnimationStyle} animationData={imageDB.loading} width={"50px"} height={'50px'}/>):(
        <Content style={containerStyle}>
        {
            presentitems.map((item) => (
              <div key={item.id} style={{ position: 'relative', margin: 20 }}>
                <img src={`https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/${encodeURIComponent(item.imagePath)}?alt=media`}
                  
                  
                  style={{ width: '100%', borderRadius: 12 }} />
                {/* <button
                  onClick={() => deleteGift(item.id)}
                  style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none',
                    borderRadius: 20, padding: '4px 8px', fontSize: 12
                  }}
                >삭제</button> */}
              </div>
            ))
          }
        </Content>)
      }

      {
        presentitems.length == 0 &&
        <Column style={{ marginTop: 100 }}>
            <EmptyImage src={imageDB.present} loading="eager" />
            <EmptySubTitle>보유하신 구해줘 알바 선물이 없습니다!</EmptySubTitle>
        </Column>

      }

    </Container>
  );

}

export default MobilePresentConfig;


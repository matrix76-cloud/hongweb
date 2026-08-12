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

  font-size: ${() => getFontSize(10)}px !important;
  color: ${({ enable }) => enable === true ? ('#fff') : ('#131313')};   
  background:${({ enable }) => enable === true ? ('#FE6625') : ('#f4f4f4')};   
  padding: 5px 10px;
  border-radius: 50px;
`

const Point = styled.div`
  color: ${({ enable }) => enable === true ? ('#131313') : ('#cdcdcd')};  
  font-size: ${() => getFontSize(20)}px !important;
  font-family :Pretendard-SemiBold;
`

const PointRegistDesc = styled.div`

    font-size: ${() => getFontSize(14)}px !important;
    color: #999;
    left: 10px;
`

const PointRegistDate = styled.div`

    font-size: ${() => getFontSize(10)}px !important;
    color: #999;

`
const PointExpireDate = styled.div`

    font-size: ${() => getFontSize(10)}px !important;
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
    font-size: ${() => getFontSize(10)}px !important;


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

const BarcodeWrapper = styled.div`
  .custom-barcode {
    font-size: 10px !important;
    text-align: center !important;

    width:90%;
  }
`;

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



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const MobilePointConfig =({containerStyle}) =>  {

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
  const [pointitems, setPointitems] = useState([]);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
  }, [refresh])

  async function FetchData() {

    const USERS_ID = user.USERS_ID;

    console.log("user", user, USERS_ID);

    const pointitemsTmp = await ReadPOINTByIndividually({ USERS_ID });

    console.log("pointitemsTmp", pointitemsTmp);



    if (pointitemsTmp != -1) {

      pointitemsTmp.map((data) => {

        if (data.ENABLE == POINTSTATUS.NORMAL) {
          const now = new Date(); // 현재 시간
          const targetDate = data.POINTEXPIREDATE.toDate();

          

         if (targetDate.getTime() < now.getTime()) {
            data.ENABLE = POINTSTATUS.ELAPSE;
          } else {
            console.log("현재와 동일한 날짜입니다.");
          }
        }
        
      })
      setPointitems(pointitemsTmp);
    }

    setCurrentloading(false);
    setRefresh((refresh) => refresh + 1);
  }

  
  useEffect(()=>{

    FetchData();

  }, [])

  const _handleRullet = () => {
    navigate("/Mobilecommunitycontent", { state: { name: CONFIGMOVE.RULLET } });
  }
  const _handleGame = () => {
    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.GAME } });
  }
  const _handleEvent = () => {
    navigate("/Mobilecommunitycontent", { state: { name: LIFEMENU.ATTENDANCE } });
  }


  return (
    <Container>
      {
      currentloading == true ? (<LottieAnimation
      containerStyle={LoadingMainAnimationStyle} animationData={imageDB.loading} width={"50px"} height={'50px'}/>):(
        <Content style={containerStyle}>
        {
          pointitems.length > 0 && <PointLayer>
            {
              pointitems.map((data) => (
                <PointBox>
                  <Row style={{
                    width: "100%", border: "2px solid #ededed", background: "#ededed",
                    height: 180, lineHeight: 1.7, borderRadius: 10
                  }}>
                    <Column style={{ width: "100%", height: "100%", position: "relative" }}>

                      {data.ENABLE === POINTSTATUS.USED && <ExpireLabel>사용완료</ExpireLabel>}
                      {data.ENABLE === POINTSTATUS.ELAPSE && <ExpireLabel>기간만료</ExpireLabel>}

                      <PointLabel enable={data.ENABLE === POINTSTATUS.NORMAL}>{data.POINTTYPE} 포인트</PointLabel>
                      <Point enable={data.ENABLE === POINTSTATUS.NORMAL}>{data.POINT} POINT</Point>
                      <BarcodeWrapper>
                        <Barcode value={data.POINTVARCODE}
                          width={1.4}
                          height={20}
                          fontSize="10px"
                          lineColor="#666" // 바코드 색상
                          background="#ededed" // 배경 색상
                          displayValue={true}
                          fontOptions="Light"
                          textAlign="center"
                          className="custom-barcode" />
                      </BarcodeWrapper>
                      <PointRegistDate>발행일자 {getDateFullTime(data.POINTDATE.toDate())}</PointRegistDate>
                      <PointExpireDate>유효일자 {getDateFullTime(data.POINTEXPIREDATE.toDate())}</PointExpireDate>
                    </Column>

                  </Row>


                </PointBox>
              ))
            }
          </PointLayer>
        }
        </Content>)
      }

      {
        pointitems.length == 0 &&
        <Column style={{ marginTop: 100 }}>
            <EmptyImage src={imageDB.simple_point_icon} loading="eager" />
            <EmptyTitle>보유하신 포인트가 없습니다!</EmptyTitle>
            <EmptySubTitle style={{ marginTop: 20 }}>획득한 포인트는 도움요청시에 </EmptySubTitle> 
            <EmptySubTitle>실제로 사용할수가 있습니다.</EmptySubTitle> 

        </Column>

      }

    </Container>
  );

}

export default MobilePointConfig;


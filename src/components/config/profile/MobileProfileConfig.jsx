import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import ButtonEx from "../../../common/ButtonEx";
import { BetweenColumn, Column } from "../../../common/Column";
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import Text from "../../../common/Text";
import { UserContext } from "../../../context/User";
import { CONFIGMOVE, EventItems } from "../../../utility/screen";

import "../../../screen/css/common.css";
import { FaTemperatureHigh } from "react-icons/fa";

import { GrTransaction } from "react-icons/gr";
import { FaRegHeart } from "react-icons/fa";
import { DiResponsive } from "react-icons/di";
import { TbRelationOneToOne } from "react-icons/tb";
import { RiArrowRightSLine } from "react-icons/ri";
import { uploadImage } from "../../../service/UploadService";
import { Update_userinfobyusersid } from "../../../service/UserService";
import ChatprofileImage from "../../ChatprofileImage";

const Container = styled.div`
  padding-bottom:30px;

`
const style = {
  display: "flex"
};

const BoxItem = styled.div`
  background: var(--surface);
  display: flex;
  flex-direction : column;
  width: 85%;
  margin: 10px auto;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  line-height: 1.6;
`

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;
const NameEditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const NameInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 0 12px;
  border: 1.5px solid #FF4E19;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  font-family: inherit;
  outline: none;
`;
const NameSaveBtn = styled.button`
  flex: none;
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: #FF4E19;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: .6; }
`;
const NameHint = styled.div`
  font-size: 13px;
  color: #A3A3A3;
  margin-top: 6px;
`;
const Name = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
`
const TemperatureLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 17px;
  color: var(--text);
  font-family: 'Pretendard-SemiBold';
`
const PointBox = styled.div`

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin : 10px 0px;
  flex-direction : row;
  padding: 15px 10px;

`
const PointBoxInner = styled.div`

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 16px;
  font-weight: 600;
  margin-top: 5px;
 

`
const SubLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding-left: 10px;
`
const SubLabelContent = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 17px;
  font-weight: 600;
  padding: 20px 0px;
`
const Point = styled.div`
  color: #ff4e19;
  padding: 10px 18px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-family: 'Pretendard-Bold';
  border: 2px dotted #ff4e19;

`
const ULITEM = styled.ul`
  padding-left: 15px;
  list-style-type: disc;
  line-height: 2;
  margin-top: 10px;
`


const MobileProfileConfig =({containerStyle}) =>  {

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
  const [temperature, setTemperature] = useState(40);
  const [img, setImg] = useState('');

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setTemperature(temperature);
    setImg(img);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
        setImg(user.userimg);
      }
      FetchData();
  }, [])

  const _handleNameMove = () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.PROFILENAME, TYPE : ""}});
  }

  const _handleBadge= () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.PROFILEBADGE, TYPE : ""}});
  }
  
 
  return (

    <Container style={containerStyle}>

    <BoxItem style={{padding:"30px 10px"}}>

      <Column style={{justifyContent:"space-between", width:"100%"}}>
        {/* 대화명은 사진 옆에서 바로 고친다 — 예전엔 별도 화면으로 한 번 더 들어가야 했다 (형 리뷰 2026-08-12) */}
        <Row style={{justifyContent:"flex-start", alignItems:"center", gap:16, width:"90%", marginBottom:20}}>
          {/* 보기 전용 — 사진 교체와 대화명 변경은 내 정보 상단에서 한다 (형 리뷰 2026-08-12) */}
          <ChatprofileImage source={img} size={92} />
          <Name>{user.nickname || '대화명 없음'}</Name>
        </Row>

        <TemperatureLine>
           <div>홍여사 온도 <FaTemperatureHigh size={16} color={'#FF4E19'}/>
           <span style={{fontSize:14, color:"#71717a", marginLeft:6}}>기본온도는 36도예요</span>
           </div>
           <div>
            <div style={{display:"flex"}}>
              <Text containerStyle={{fontFamily:"Pretendard-Bold"}} value={ parseInt(temperature *100 / 100) + '도'} size={20} color={'#FF4E19'} ></Text>
            </div>
          </div>  
        </TemperatureLine>
   
        <AroundRow style={{width:"100%"}}>
    
            <Column style={{alignItems:"unset", width:"100%"}}>
              <progress value={temperature} min="0" max="100"
              className="profile-progress-bar"
              style={{width:"100%", margin:"10px 0px"}}></progress>

              <PointBox>
                <PointBoxInner>
                  <div style={{display:"flex"}}>
                  <div>거래지수</div>
                  </div>
                  <div style={{lineHeight:1.6, marginTop:6, fontSize:15, color:"#71717a"}}>거래 내역을 토대로 지수를 산출해요</div>
                </PointBoxInner>
                <Point>
                  1
                </Point>

              </PointBox>
              <PointBox>
                <PointBoxInner>
                <div style={{display:"flex"}}>
                  호감지수
                  </div>
                <div style={{lineHeight:1.6, marginTop:6, fontSize:15, color:"#71717a"}}>호감 표현이 많을수록 지수가 높아져요</div>
                </PointBoxInner>
                <Point>
                  2
                </Point>
              </PointBox>
              <PointBox>
                <PointBoxInner>
                <div style={{display:"flex"}}>
                  체팅응답률
                </div>
                <div style={{lineHeight:1.8,marginTop:5}}>응답이 빠를 수록 응답률이 높아 진다</div>
                </PointBoxInner>
                <Point>
                  1
                </Point>
              </PointBox>
       
           
            </Column>

        </AroundRow>
      </Column>
    </BoxItem>



    <BoxItem> 

      <div>주소지 변경 내역입니다</div>
      <ULITEM>
      <li> 다산 1동 미인증</li>
      <li> 성북동 미인증</li>
      <li> 다산 2동 미인증</li>
      </ULITEM>
         

    </BoxItem>


    <BoxItem> 


      <div>최근 3일내 이력 입니다</div>

      <ULITEM>
      <li> 의뢰 1회 계약완료 1회 2024.09.17</li>
      <li> 일감 등록 2024.09.17</li>
      <li> 공간 대여 등록 2024.09.17</li>
      </ULITEM>
    </BoxItem>

    <BoxItem>

    </BoxItem>



    </Container>
  );

}

export default MobileProfileConfig;


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
import { ReadWorkByUSERS_ID } from "../../../service/WorkService";
import { ReadChat } from "../../../service/ChatService";
import { WORKSTATUS } from "../../../utility/status";

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
/* 점선 원 안에 숫자만 있어서 무슨 수치인지 안 보였다 — 항목에 맞는 그림과 같이 보여준다
   (형 리뷰 2026-08-16 "각각에 맞는 이미지로 해서 수치를 나타내줘") */
const Point = styled.div`
  color: #ff4e19;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  min-width: 62px;
  padding: 4px 0;
`
const PointNum = styled.div`
  font-size: 20px;
  font-family: 'Pretendard-Bold';
  color: #ff4e19;
  line-height: 1;
`
const PointUnit = styled.span`
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  margin-left: 2px;
`
const EmptyLine = styled.div`
  margin-top: 10px;
  font-size: 15px;
  color: var(--text);
  opacity: .7;
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

  /* 지수와 이력은 지어낸 숫자가 아니라 이 계정의 실제 기록에서 센다 (형 리뷰 2026-08-16
     "목업 데이타 말고 진짜 데이타로 넣어줘") */
  const [stat, setStat] = useState({ trade: 0, like: 0, response: 0, ready: false });
  const [history, setHistory] = useState([]);

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

  /* 지수 · 최근 이력 — 이 계정의 일감과 대화방에서 직접 센다.
     거래지수  : 마감까지 간 내 일감 수
     호감지수  : 내 일감에 지원해 대화까지 이어진 사람 수 (아직 "호감 누르기" 기능이 없어 이걸로 센다)
     채팅응답률: 내 대화방 중 안 읽은 말이 없는 방의 비율 */
  useEffect(()=>{
    let alive = true;
    async function FetchStat(){
      const USERS_ID = user?.users_id;
      if(!USERS_ID) return;

      const works = await ReadWorkByUSERS_ID({ USERS_ID }).catch(()=> []);
      const chats = await ReadChat({ USERS_ID }).catch(()=> -1);
      const rooms = Array.isArray(chats) ? chats : [];

      const trade = works.filter((w)=> w.WORK_STATUS === WORKSTATUS.CLOSE).length;
      const like = rooms.filter((r)=> r.OWNER_ID === USERS_ID).length;
      const read = rooms.filter((r)=> !(r.UNREAD && r.UNREAD[USERS_ID] > 0)).length;
      const response = rooms.length ? Math.round((read / rooms.length) * 100) : 0;

      /* 최근 3일 — 일감을 올린 것과 대화가 시작된 것을 시간순으로 */
      const since = Date.now() - 3 * 24 * 60 * 60 * 1000;
      const day = (t)=> new Date(t).toLocaleDateString('ko-KR', { month:'2-digit', day:'2-digit' }).replace(/\.$/, '');
      const rows = [
        ...works.filter((w)=> (w.CREATEDT||0) >= since)
                .map((w)=> ({ at: w.CREATEDT, text: `일감 등록 · ${w.WORKTYPE || '일감'} · ${day(w.CREATEDT)}` })),
        ...works.filter((w)=> w.WORK_STATUS === WORKSTATUS.CLOSE && (w.UPDATEDT || w.CREATEDT || 0) >= since)
                .map((w)=> ({ at: w.UPDATEDT || w.CREATEDT, text: `거래 마감 · ${w.WORKTYPE || '일감'} · ${day(w.UPDATEDT || w.CREATEDT)}` })),
        ...rooms.filter((r)=> (r.CREATEDT||0) >= since)
                .map((r)=> ({ at: r.CREATEDT, text: `대화 시작 · ${r.OWNER_ID === USERS_ID ? (r.SUPPORTER || '지원자') : (r.OWNER || '의뢰인')}님 · ${day(r.CREATEDT)}` })),
      ].sort((a,b)=> b.at - a.at).slice(0, 8);

      if(!alive) return;
      setStat({ trade, like, response, ready: true });
      setHistory(rows);
    }
    FetchStat();
    return ()=>{ alive = false; };
  }, [user?.users_id])

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
                  <div style={{lineHeight:1.6, marginTop:6, fontSize:15, color:"var(--text)", opacity:.7}}>마감까지 간 거래를 세요</div>
                </PointBoxInner>
                <Point>
                  <GrTransaction size={22} color="#ff4e19" />
                  <PointNum>{stat.trade}<PointUnit>건</PointUnit></PointNum>
                </Point>

              </PointBox>
              <PointBox>
                <PointBoxInner>
                <div style={{display:"flex"}}>
                  호감지수
                  </div>
                <div style={{lineHeight:1.6, marginTop:6, fontSize:15, color:"var(--text)", opacity:.7}}>내 일감에 지원해 대화까지 온 분들이에요</div>
                </PointBoxInner>
                <Point>
                  <FaRegHeart size={22} color="#ff4e19" />
                  <PointNum>{stat.like}<PointUnit>명</PointUnit></PointNum>
                </Point>
              </PointBox>
              <PointBox>
                <PointBoxInner>
                <div style={{display:"flex"}}>
                  채팅응답률
                </div>
                <div style={{lineHeight:1.6, marginTop:6, fontSize:15, color:"var(--text)", opacity:.7}}>안 읽은 말을 남기지 않을수록 높아져요</div>
                </PointBoxInner>
                <Point>
                  <DiResponsive size={24} color="#ff4e19" />
                  <PointNum>{stat.response}<PointUnit>%</PointUnit></PointNum>
                </Point>
              </PointBox>
       
           
            </Column>

        </AroundRow>
      </Column>
    </BoxItem>



    {/* 주소지 변경 내역은 뺐다 (형 리뷰 2026-08-16 "주소지 변경부분은 삭제해줘") */}

    <BoxItem>


      <div>최근 3일내 이력 입니다</div>

      {
        history.length > 0 ? (
          <ULITEM>
            {history.map((h, i)=>(<li key={i}> {h.text}</li>))}
          </ULITEM>
        ) : (
          <EmptyLine>최근 3일 동안 올린 일감이나 시작한 대화가 없습니다.</EmptyLine>
        )
      }
    </BoxItem>



    </Container>
  );

}

export default MobileProfileConfig;


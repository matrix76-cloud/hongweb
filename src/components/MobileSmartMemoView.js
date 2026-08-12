
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from 'styled-components';
import { AroundRow, BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { sleep, useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column, FlexstartColumn } from "../common/Column";
import { DataContext } from "../context/Data";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import { ReadTourFestival } from "../service/LifeService";
import ResultLabel from "../common/ResultLabel";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { ReadCommunitySummary } from "../service/CommunityService";
import TimeAgo from 'react-timeago';
import { getFullTime, getNewDate } from "../utility/date";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { LoadingCommunityStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import { CurrentMenu, PCCOMMNUNITYMENU } from "../utility/screen";

import ButtonEx from "../common/ButtonEx";
import { Toaster, toast } from 'sonner';
import { FaRegTrashAlt } from "react-icons/fa";
import BirthCalendar from "./BirthCalendar";
import MobileMemoPopup from "../modal/MobileMemoPopup";
import { CreateMemo, DeleteMemoByMEMO_ID, ReadMemoByIndividually, Update_memobymemoid } from "../service/MemoService";
import MobileBirthdayadd from "../modal/MobileBirthdayadd";
import Empty from "./Empty";
import MobileShoppingMemo from "./MobileShoppingMemo";
import MobileBankMemo from "./MobileBankMemo";
import { CiBank } from "react-icons/ci";
import { CiShoppingBasket } from "react-icons/ci";
import { BsCalendar2Day } from "react-icons/bs";
import KakaoShare from "./KakaoShare";

import { RiShoppingBasketFill } from "react-icons/ri";
import { getFontSize } from "../utility/fontsize";




const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`

  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh);
  touch-action: pan-y;
  background:#fff;
`


const TagLayer = styled.div`
    width: 100%;
    height: 50px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e6e6e6;
`
const MenuButton = styled.div`

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50%;
  font-size: ${() => getFontSize(14)}px;
  border-bottom: ${({ enable }) => enable === true ? ('4px solid #FE6625') : ('null')};
  height: 50px; 
  color :#131313;
  font-family: ${({ enable }) => enable === true ? ('Pretendard-SemiBold') : ('null')};

`



const PlusButton = styled.div`
    position: fixed;
    bottom: 40px;
    right: 20px;
    background: #FF7E19;
    width: 45px;
    height: 45px;
    border-radius: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    z-index: 6;
`

const MemoButton = styled.div`

    position: fixed;
    right: 60px;
    background: #676565;
    width: 25px;
    height: 25px;
    border-radius: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    z-index: 6;

`

const MemoButtonData = styled.div`
    font-size: ${() => getFontSize(20)}px;
    justify-content: center;
    display: flex;
    align-items: center;
    padding-bottom: 5px;
`
const PlusButtonData = styled.div`
    font-size: ${() => getFontSize(35)}px;
    justify-content: center;
    display: flex;
    align-items: center;
    padding-bottom: 8px;
`
const ContentLayer = styled.div`

  display: flex;
  flex-direction: column;
  width: 100%;


`

const ContentLayer2 = styled.div`

  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top:70px;
`
const ContentLayer3 = styled.div`

  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top:120px;
`

const MainItem = styled.div`
  display:flex;
  flex-direction :row;
  justify-content: space-between;
  align-items:center;
  border-bottom : 1px solid #ededed;
  width:100%;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 90%;
  margin: 0 auto;
`
const Title = styled.div`
  padding-left:10px;
  font-family:Pretendard-Regular;
  font-size: ${() => getFontSize(14)}px;
  color: ${({ check }) => check == true ? ('#b5afac') : ('#131313')};
  text-decoration: ${({ check }) => check == true ? ('line-through') :(null)};
`

const SubTitle = styled.div`
  padding-left:10px;
  font-family:Pretendard;

`
const Header = styled.div`
    display: flex;
    justify-content: center;
    font-family: Pretendard-SemiBold;
    font-size: ${() => getFontSize(22)}px;
    margin: 20px;
    text-decoration: underline;


`

const TextInput = `

 .textarea{
    width: 80%;
    margin : 0 auto;
    resize: none;
    border-radius: 30px;
    height: 30px;
    outline: 0;
    font-size: ${() => getFontSize(16)}px;
    padding: 10px;
    color: #131313;
    background: #fff;
    border: none;
    font-family: Pretendard-Light;
    position: relative;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
 }


`




const BottomLine = styled.div`
  height: 70px;
  background-color: white;
  position: fixed;
  width: 100%;
  bottom: 20px;
`;
const ChatbtnLayer = styled.div`
    height: 100px;
    background-color: #f8f8f8;
    position: fixed;
    width: 100%;
    bottom: 0px;
    display: flex;
    align-items: center;

`;

const ChatIconLayer = styled.div`
  display: flex;
  flex-direction: row;
  width: 10%;
  justify-content: space-around;
  padding-left:10px;
`;

const InputChat = styled.input`
    width: 90%;
    resize: none;
    border-radius: 30px;
    height: 30px;
    outline: 0;
    font-size: ${() => getFontSize(16)}px;
    padding: 10px;
    color: #999;
    background: #fff;
    border: none;
    font-family: Pretendard-Light;
    display:flex;

`;

const ShareBtnLayer = styled.div`

    display: flex;
    flex-direction : row;
    justify-content: flex-start;
    align-items: center;
    margin-right:10px;

`
const TabStyle = `
.tab-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;

}

.tab-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: ${() => getFontSize(16)}px;
  font-weight: 600;
  color: #555;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.tab-button img {
  width: 20px;
  height: 20px;
}

.tab-button:hover {
  background: #f8f8f8;
  border-color: #ff7a00;
  color: #ff7a00;
}

.tab-button.active {
  background: #ff7a00;
  color: white;
  border-color: #ff7a00;

}

.tab-button.active img {
  filter: brightness(0) invert(1);
}



`




const MobileSmartMemoView =({containerStyle}) =>  {

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

  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(CurrentMenu.SHOPPING);
  const [addmemo, setAddmemo] = useState(false);
  const [addbirthday, setAddbirthday] = useState(false);

  const [shoppingitems, setShoppingitems] = useState([]);
  const [bankitems, setBankitems] = React.useState([]);
  const [birthdayitems, setBirthdayitems] = React.useState([]);
  const [key, setKey] = useState(1);
  const [memo, setMemo] = useState('');

  const [activeTab, setActiveTab] = useState(CurrentMenu.SHOPPING);

  const [searchParams] = useSearchParams();
  const [shareid, setShareid] = useState(searchParams.get('id'));// URL 쿼리에서 id 가져오기
  const [type, setType] = useState(searchParams.get('type'));// URL 쿼리에서 id 가져오기


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);


  async function FetchData() {
    let USERS_ID = '';
    USERS_ID = shareid;

    console.log("user id", USERS_ID);
  

    const memoitemsTmp = await ReadMemoByIndividually({ USERS_ID });

    console.log("memo", memoitemsTmp);

    let shoppingitemsTmp = [];
    let bankitemsTmp = [];
    let birthdayitemsTmp = [];

    if (memoitemsTmp != -1) {
      memoitemsTmp.map((data) => {

        if (data.MEMOTYPE == CurrentMenu.SHOPPING) {
          shoppingitemsTmp.push(data);
        } else if (data.MEMOTYPE == CurrentMenu.BANK) {
          bankitemsTmp.push(data);
        } else if (data.MEMOTYPE == CurrentMenu.BIRTHDAY) {
          birthdayitemsTmp.push(data);
        }
      }) 
    }
    setShoppingitems(shoppingitemsTmp);
    setBankitems(bankitemsTmp);
    setBirthdayitems(birthdayitemsTmp);
    setKey((key) => key + 1);
    setLoading(false);
  }


  useEffect(()=>{
    FetchData();
  }, [])

  useEffect(() => {
    setMenu(menu);
    setAddmemo(addmemo);
    setAddbirthday(addbirthday);
    setShoppingitems(shoppingitems);
    setBankitems(bankitems);
    setBirthdayitems(birthdayitems);
    // setKey(key);
    setActiveTab(activeTab);
    setMemo(memo);

  }, [refresh])


  const _handleMenu = (menu) => {
    setMenu(menu);

    setRefresh((refresh) => refresh + 1);
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.info("클립보드에 저장되었습니다", {
          duration: 1000,
          style: {
            backgroundColor: "#FE6625",
            color: "white",
            fontSize: "16px",
          },
        })

      }
      )
      .catch((err) => console.error("복사 실패:", err));
  };

  
  const _handleprev = () => {
    navigate("/Mobilelife");
  }


  const _handleDelete = async(data) => {
    const MEMO_ID = data.MEMO_ID;
    await DeleteMemoByMEMO_ID({ MEMO_ID });
    FetchData();
  }

  const _handleMemoClose = (data) => {
    setAddmemo(false);
    setAddbirthday(false);
    setRefresh((refresh) => refresh + 1);

    if (data == '') {
      console.log("그냥 닫았습니다");
    } else {

      FetchData();

      if (menu == CurrentMenu.SHOPPING) {
        toast.info("장바구니에 저장되었습니다", {
          duration: 500,
          style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
        })
      } else if (menu == CurrentMenu.BANK) {
          toast.info("계좌번호가 저장되었습니다", {
          duration: 500,
            style: { background: "#FFF", color: "#131313", fontSize:getFontSize(16), border: "none" }, // 스타일 변경
        })
      } else if (menu == CurrentMenu.BIRTHDAY) {
        toast.info("기념일내용이 저장되었습니다", {
          duration: 500,
          style: { background: "#FFF", color: "#131313", fontSize:getFontSize(16), border: "none" }, // 스타일 변경
        })
      }
      setKey((key) => key + 1);

    }
  }

  const _handlePlus = () => {

    if (menu == CurrentMenu.SHOPPING || menu == CurrentMenu.BANK) {
      setAddmemo(true);
    } else {
      setAddbirthday(true);
    }

    setRefresh((refresh) => refresh + 1);
  }
  const handleChange = async(event) => {

    const FindIndex = shoppingitems.findIndex(x => x.MEMO_ID == event.target.value);

    const MEMO_ID = event.target.value;

    if (FindIndex != -1) {
      
      if (shoppingitems[FindIndex].CHECK == true) {
        shoppingitems[FindIndex].CHECK = false;

        const CHECK = false;

        await Update_memobymemoid({ CHECK, MEMO_ID });

      } else {
        shoppingitems[FindIndex].CHECK = true;   
        const CHECK = true;
        await Update_memobymemoid({ CHECK, MEMO_ID });
      }
    }
    console.log("handleChange", FindIndex, event.target.value, shoppingitems);
    setShoppingitems(shoppingitems);
    setRefresh((refresh) => refresh + 1);

  }




  const _handleconfig = async (memo) => {

    if (memo == '') {
      return;
    }

    const USERS_ID = user.USERS_ID;
    const MEMO = memo;
    const MEMOTYPE = menu;

    setMemo('');
    setRefresh((refresh) => refresh + 1);
    await CreateMemo({ MEMO, USERS_ID, MEMOTYPE });
    FetchData();
    
  
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {

    }
  };

  const _handleInstall = () => {
    window.location.href = "https://honglady.co.kr";
  }


  return (

    <>

      <Container style={containerStyle}>
        {
          loading == true ? (<LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
            width={"100px"} height={'100px'} />)
            : (
              <>
                
                <Row style={{ margin: "20px 0px" }} onClick={_handleInstall}>
                  <div>
                    <img src={imageDB.logo} style={{ width: 30 }} />
                  </div>
                  <div style={{marginLeft:10, fontSize: getFontSize(14)}}>동네에서 가장 일잘하는 <span style={{fontSize: () => getFontSize(18), fontFamily:"Pretendard-SemiBold", color:"#ff7e19"}}>구해줘 동네 알바</span></div>
                </Row>
                

                {
                  type == "shopping" && <Header>{'장바구니 메모'}</Header>
                }

                {
                  type == "birthday" && <Header>{'기념일 일정'}</Header>
                }

                {
                  type == 'shopping' && <MobileShoppingMemo items={shoppingitems} key={key} share={true} />
                }
                {
                  type == 'birthday' && <BirthCalendar items={birthdayitems} key={key} share={true} containerStyle={{ marginTop: 0 }} />
                }


       
              </>   
            )
        }
  


      </Container>

 
      </>

 

  );
}

export default MobileSmartMemoView;


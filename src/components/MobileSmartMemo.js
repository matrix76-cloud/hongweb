
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import { getFontSize, isIOS } from "../utility/fontsize";
import SharedHeader from "./SharedHeader";




const formatter = buildFormatter(koreanStrings); 


const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  flex-direction : column;
  justify-content: space-between;
  padding: 10px 6px;
`;


const HEADER_HEIGHT = 44;
const BOTTOM_HEIGHT = 70;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px; // ✅ 상태바 + 헤더 피함
  height: calc(100dvh - ${HEADER_HEIGHT + BOTTOM_HEIGHT }px);
  overflow-y: auto;
  
  overscroll-behavior: none;         /* ✅ bounce 방지 */
  -webkit-overflow-scrolling: auto;  /* ✅ iOS 스크롤 부드러움 OFF (기본값으로 돌림) */
  background-color: #fff;

`;





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
    width: 100%;
    margin: 0px auto 0px;
    padding-top:10px;
    color: rgb(255, 255, 255);
    line-height: 2;
    height: 70px;
    position: fixed;
    background: #fff;
    z-index: 5;


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

const Tapcontainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  font-size: ${() => getFontSize(14)}px;
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

const StyledTabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: ${() => getFontSize(14)}px;
  font-weight: 600;
  border: 2px solid #ddd;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background: ${({ active }) => (active ? '#ff7a00' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#555')};
  border-color: ${({ active }) => (active ? '#ff7a00' : '#ddd')};

  img {
    width: 20px;
    height: 20px;
    filter: ${({ active }) => (active ? 'brightness(0) invert(1)' : 'none')};
  }

  &:hover {
    background: #f8f8f8;
    border-color: #ff7a00;
    color: #ff7a00;
  }
`;


const Name = styled.div`
font-size: ${() => `${getFontSize(20)}px`} !important;
padding-left:10px;
`

const MobileSmartMemo =({containerStyle, type =null, id}) =>  {

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
  const isShared = !!searchParams.get("id");
  const USERS_ID = isShared ? searchParams.get("id") : user.USERS_ID;
  const MEMOTYPE = searchParams.get("type") || CurrentMenu.SHOPPING;



  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);


  async function FetchData() {
    let USERS_ID = '';
    if (type == null) {
      USERS_ID = user.USERS_ID;
    } else {
      USERS_ID = id;
    }

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
            style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
        })
      } else if (menu == CurrentMenu.BIRTHDAY) {
        toast.info("기념일내용이 저장되었습니다", {
          duration: 500,
          style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
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



  const MainData = () => {
    return (
      <>

        {isShared && <SharedHeader />}


        {!isShared ? (<HeaderWrapper>

          <style>{TabStyle}</style>

          <BetweenRow style={{ width: "90%", margin: "0 auto", zIndex: 10, padding:"10px" }}>
            <div style={{ display: "flex", fontSize: getFontSize(18), color: "#131313", alignItems: "center" }} onClick={_handleprev}>
              <img src={imageDB.ic_common_top_back_nor} style={{ height: 24, color: '#131313' }} />
              <Name>{'똑똑한 메모'}</Name>
            </div>

          </BetweenRow>

          <Tapcontainer>
            <StyledTabButton
              active={activeTab === CurrentMenu.SHOPPING}
              onClick={() => {
                setActiveTab(CurrentMenu.SHOPPING);
                _handleMenu(CurrentMenu.SHOPPING);
              }}
            >
              <RiShoppingBasketFill />
              장보기메모
            </StyledTabButton>

            <StyledTabButton
              active={activeTab === CurrentMenu.BIRTHDAY}
              onClick={() => {
                setActiveTab(CurrentMenu.SHOPPING);
                _handleMenu(CurrentMenu.BIRTHDAY);
              }}
            >
       
              📅 기념일관리
            </StyledTabButton>

      
          </Tapcontainer>


       


        </HeaderWrapper>) :("")}




        {
          addbirthday == true && <MobileBirthdayadd callback={_handleMemoClose} menu={menu} />
        }

        {
          CurrentMenu.SHOPPING == menu &&
          <>

            <MobileShoppingMemo items={shoppingitems} isShared = {isShared} key={key} callback={_handleconfig} />       
  
          </>
        }

        {
          CurrentMenu.BIRTHDAY === menu && isShared == false &&
          <>
            <BirthCalendar items={birthdayitems} key={key} />
            <PlusButton onClick={_handlePlus}>
              <PlusButtonData>+</PlusButtonData>
            </PlusButton>
          </>
        }
        <Toaster position="bottom-right" richColors />

      </>
    )
  }

  return (

    <>

      <Container style={containerStyle}>
        {
          loading == true ? (<LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
            width={"100px"} height={'100px'} />)
            : (
              <MainData />
            )
        }
      </Container>
      </>

 

  );
}

export default MobileSmartMemo;


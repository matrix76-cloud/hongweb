import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import styled from 'styled-components';
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css";
import { DataContext } from "../context/Data";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { DeleteFreezeFREEZE_ID, ReadFREEZE, UpdateFREEZECHECKid } from "../service/FreezeService";
import dayjs from "dayjs";
import { FreezeItems } from "../store/jotai";
import { useAtom } from "jotai";
import { Column, FlexstartColumn } from "../common/Column";
import { imageDB } from "../utility/imageData";
import { LIFEMENU } from "../utility/life";
import { useNavigate } from "react-router-dom";
import { GoBellFill } from "react-icons/go";

import { getFontSize } from '../utility/fontsize';
import MobileRecipeadjust from "../modal/MobileRecipeadjust";
import ButtonEx from "../common/ButtonEx";
import HongButton from "./HongButton";
import MobileRecipeadd from "../modal/MobileRecipeadd";
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';

const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 10px;

    scroll-behavior: smooth;
    flex-direction: column;



`
const Container2 = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 10px;
    scroll-behavior: smooth;
    margin-left:3%;



`
const style = {
  display: "flex"
};



const BoxLayer = styled.div`

`

const BoxItem = styled.div`


`
const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
`;
const HeaderText = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-family: 'Pretendard-SemiBold';
  color: #666;
  flex: 1;
  text-align: flex-start;
  margin-left: 12px; // ← 하트나 공유 버튼 고려 시 여백
`;

const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}
const MapbtnStyle={
  background: "#ff",
  padding: "0px 20px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '50px',
  color: '#333',
  border :" 1px solid #c3c3c3",
  height: '38px',
  fontSize:'16px',
  fontFamily:'Pretendard-SemiBold',
  width:'30%',
  margin :'20px auto 0px',
}



const RecommendTitle = styled.div`
  font-family: 'Pretendard-Bold';
  margin: 20px 0px;

`

const RecommendButton = styled.div`
  font-size: ${() => getFontSize(16)}px;
  color: #fff;
`


const Recipereview = styled.div`
font-size: ${() => getFontSize(12)}px;
font-family: 'Pretendard-Light';
margin-top:10px;
color :#66686F
`

const Tag1 = styled.div`
  font-size: ${() => getFontSize(12)}px;
  background: #FFF0E9;
  padding :5px 10px;
  color: #FE6625;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: 5px;
`
const Tag2= styled.div`

  font-size: ${() => getFontSize(12)}px;
  background: #fff;
  color: #96989C;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-left:5px;
`

const Recipename = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(14)}px;
  color: #1A1E28;
  margin-top:5px;
`

const Recipetip = styled.div`
  color: #96989C;
  font-family: 'Pretendard-Light';
  font-size: ${() => getFontSize(12)}px;
`



const CheckLayer = styled.div`
  display : flex;
  width :20px;
  height :15px;
`
const RecommendLayer = styled.div`

  width: 90%;
  height: 50px;
  background: #FE6625;
  margin: 20px auto;
  border-radius: 5px;
  display : flex;
  justify-content:center;
  align-items:center;

`
const TipMenu = styled.div`

  background: #FFF0E9;
  color: #FE6625;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px;
  display: flex;
  justify-content: space-around;
  align-items : center;
  width: 40px;
  height:20px;

`

const TipMenu2 = styled.div`
  background: #F5F6F9;
  color: #66686F;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom:5px;
  font-size: ${() => getFontSize(12)}px !important;
  display: flex;
  justify-content: center;
  align-items : center;
  width: 40px;
  height:20px;

`
const PictureStyle = `

  .hidden-scrollbar {
    overflow: auto;
    -ms-overflow-style: none; /* IE, Edge */
    scrollbar-width: none; /* Firefox */
  }

  .hidden-scrollbar:: -webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`
const FreezeItemStyle = `
.calendar-card {
  width: 60px;
  height: 70px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: Arial, sans-serif;
  margin-left:10px;
  position : relative;
  font-size: ${getFontSize(12)}px !important;
  font-weight: bold;
  line-height :1;
  color :#131313;
}

.calendar-selectcard {
  width: 60px;
  height: 70px;
  border-radius: 10px;
  background: #0079ff;
  white : #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: Arial, sans-serif;
  margin-left:10px;
  position : relative;
  font-size:${getFontSize(12)}px !important;
  font-weight: bold;
  line-height :1;
    color :#fff;
}



.content {
  margin-top: 15px;
  line-height: 2;
}




`
const TopBar = styled.div`

  width: 100%;
  height: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: absolute;
  top: 0;
  background-color: ${(props) => {
    switch (props.status) {
      case 0:
        return "lightgreen";
      case 1:
        return "lightgreen";
      case 2:
        return "#FFA82E";
      case 3:
        return "#FFA82E";
      case 4:
        return "#4BA0FF";
      case 5:
        return "#4BA0FF";
      default:
        return "#FF5959";
    }
  }};

`
const Rectangle = styled.div`
    width: 70px;
    border-radius: 70px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;

`

const FridgeGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 5px 24px;
`;

const GridItem = styled.div`
  background: ${({ selected, hasItem }) => selected ? '#FFF2DC' : hasItem ? '#fdf9f4' : '#fff'};
  border: 1px dashed ${({ selected }) => (selected ? '#FF912E' : '#ccc')};
  padding: 10px 4px;
  min-width: 60px;
  height: 60px;
  font-size: ${() => `${getFontSize(13)}px`} !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EmptySlot = styled.div`
  width: 70px;
  height: 70px;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);  // 약간 강한 입체감
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  color: #333;

  &:hover {
    background-color: #fff7f1;
    border-color: #f97316;
    transform: translateY(-2px);
    transition: all 0.2s ease-in-out;
  }
`;
const FridgeBox = styled.div`
  padding: 16px;
  background: #fefefe;
  border-radius: 20px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.04);
  margin: 10px 12px;
  
`;

const Freezecontent = styled.span`
  font-size: ${() => `${getFontSize(13)}px`} !important;

`


const RecipeGuideText = styled.div`
  width: 90%;
  margin: 0 auto;
  text-align: flex-start;
  font-size: ${() => getFontSize(13)}px !important;
  color: #666;
  padding: 8px 0 12px;
  line-height: 1.4;
  white-space: normal;
  word-break: keep-all;
`;

const transformFreezeData = (freezeitemsFromDB = []) => {


  return freezeitemsFromDB.map((item) => ({
    id: item.FREEZE_ID,
    name: item.NAME,
    startDate: item.STARTDATE,
    endDate: item.ENDDATE,
    alarm: item.ALARM,
    selected: false, // 초기 선택값 false
  }));
};


const MobileFreezeDisplayBoard =({containerStyle, callback}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const [fridgeItems, setFridgeItems] = useState([]);

  const [refresh, setRefresh] = useState(1);
  const [freezeitem, setFreezeitem] = useState({});
  const [freezemenu, setFreezemenu] = useAtom(FreezeItems);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [recipeaddpopup, setRecipeaddpopup] = useState(false);
  const [recipeadjustpopup, setRecipeadjustpopup] = useState(false);
  const [adjustitem, setAdjustitem] = useState({});

  const totalSlots = 12;
  const filledItems = fridgeItems.slice(0, totalSlots);
  const emptySlots = totalSlots - filledItems.length;

  const getDday = (endDate) => {
    const today = dayjs().startOf("day");
    const target = dayjs(endDate).startOf("day");
    const diff = target.diff(today, 'day');
    if (diff > 0) return `${diff}일남음`;
    if (diff < 0) return `❗${Math.abs(diff)}일지남`;
    return '오늘';
  };

  const fetchData = async () => {
    if (!user?.USERS_ID) return;
    const data = await ReadFREEZE({ USERS_ID: user.USERS_ID });

    console.log("freeze data", data);

    if (data == -1) {
      return;
    }
    const transformed = transformFreezeData(data);
    setFridgeItems(transformed);
  };

  useEffect(() => {

    fetchData();
  }, [user]);


  const _handlePrev = () => {
    navigate(-1);
  }

  const navigate = useNavigate();

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setFreezeitem(freezeitem);
  },[refresh])


  useEffect(()=>{
    FetchData();
  }, [])


  const _handlemenu = (menu) => {
    navigate("/Mobilecommunitycontent", { state: { name: menu, search: "" } });
  }


  async function FetchData(type){

    const USERS_ID = user.USERS_ID;

    console.log("Freeze FetchData", USERS_ID);
    const freezeitemsTmp = await ReadFREEZE({ USERS_ID });

    console.log("freezeitems", freezeitemsTmp);

    if (freezeitemsTmp != -1) {
      setFreezemenu(freezeitemsTmp);
    } else {
      setFreezemenu([]);
    }
  }

  function calculateDDay(targetDate){
    const today = dayjs().startOf("day");
    const eventDate = dayjs(targetDate).startOf("day");
    const diff = eventDate.diff(today, "day");

    if (diff > 0) return `${diff}일남음`;
    if (diff < 0) return `${Math.abs(diff)}일지남`;
    return "오늘";
  };

  const _handleSelect = (data) => {
    setFreezeitem(data);
    callback(data);
    setRefresh((refresh) => refresh + 1);
  }


  const _handlerecipeadd = () => {
    setRecipeaddpopup(true);
    setRefresh((refresh) => refresh + 1);
  }

  const _handlerecipeadjust = async() => {
    const selectedItems = fridgeItems.filter(item => item.selected);

    if (selectedItems.length !== 1) {
      toast.error("삭제할 재료를 하나만 선택해주세요");
      return;
    }

    const targetId = selectedItems[0].id;

    try {
      await DeleteFreezeFREEZE_ID({ FREEZE_ID: targetId });
      toast.success("삭제되었습니다");
      fetchData();
    } catch (e) {
      toast.error("삭제 중 오류 발생");
      console.error(e);
    }
  }
  
  const _handleRecipeSearch = () => {
    const selectedItems = fridgeItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      toast.error("냉장고에서 재료를 클릭하여 선택하세요", {
        duration: 1000,
        style: {
          background: "#FFF",
          color: "#131313",
          fontSize: () => getFontSize(16),
          border: "none"
        },
      });
      return;
    }

    if (selectedItems.length > 2) {
      toast.error("재료 선택은 최대 두 개까지만 선택하세요", {
        duration: 1000,
        style: {
          background: "#FFF",
          color: "#131313",
          fontSize: () => getFontSize(16),
          border: "none"
        },
      });
      return;
    }

    const selectedNames = selectedItems.map(item => item.name);

    console.log("선택된 재료들:", selectedNames);


    navigate("/Mobilefreezerecipe", {
      state: {
        filterary: selectedNames,
        name: "나의 냉장고 레시피"
      }
    });

    setRefresh(r => r + 1);
  };
    

  const MobileRecipeAddCallback = (data) => {
    // 식재료가 추가 되었습니다

    if (data == 'add') {
      toast.error("식재료가 추가 되었습니다", {
        duration: 1000,
        style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
      })

      fetchData(); // ✅ 추가 후 다시 데이터 가져오기
    }


    setRecipeaddpopup(false);


  }
  
  const MobileRecipeAdjustCallback = (type) => {

    if (type === 'delete') {
      toast.info("식재료가 삭제되었습니다", {
        duration: 1000,
        style: {
          background: "#FFF",
          color: "#131313",
          fontSize: () => getFontSize(16),
          border: "none"
        },
      });
    } else if (type === 'adjust') {
      toast.info("식재료가 수정되었습니다", {
        duration: 1000,
        style: {
          background: "#FFF",
          color: "#131313",
          fontSize: () => getFontSize(16),
          border: "none"
        },
      });
    }

    // ✅ 핵심: 삭제 후 다시 불러오기
    fetchData();

    // ✅ 상태 초기화
    setAdjustitem({});
    setRecipeadjustpopup(false);


  }
  
  const selectedCount = fridgeItems.filter(item => item.selected).length;

  return (
    <>
      <style>{PictureStyle}</style>
  
      {
        recipeaddpopup == true && <MobileRecipeadd callback={MobileRecipeAddCallback} />
      }

  
      
      <HeaderWrapper>
        <img
          src={imageDB.ic_common_top_back_nor}
          onClick={_handlePrev}
          style={{ width: 24 }}
        />
        <HeaderText>냉장고 관리</HeaderText>
 
      </HeaderWrapper>

      <Container style={containerStyle} className="hidden-scrollbar">
        <style>{FreezeItemStyle}</style>
        <FridgeGridWrapper>
          {filledItems.map((item, i) => (
            <motion.div
              key={item.id || i}
              animate={{
                scale: item.selected ? 1.08 : 1,
                boxShadow: item.selected
                  ? "0 0 8px rgba(255, 145, 46, 0.5)"
                  : "0 0 4px rgba(0, 0, 0, 0.08)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <GridItem
                selected={item.selected}
                hasItem={true}
                onClick={() => {
                  const updated = [...fridgeItems];
                  updated[i].selected = !updated[i].selected;
                  setFridgeItems(updated);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {item.alarm && <img src={imageDB.bell} alt="알람" style={{ width: 14, marginRight: 4 }} />}
                  {item.name}
                </div>
                <Freezecontent>
                  {getDday(item.endDate)}
                </Freezecontent>
              </GridItem>
            </motion.div>
          ))}

          {Array.from({ length: emptySlots }).map((_, i) => (
            <GridItem key={`empty-${i}`} selected={false} hasItem={false}>
              <img src={imageDB.emptyfood} alt="빈칸" style={{ width: 36, height: 36 }} />
            </GridItem>
          ))}
        </FridgeGridWrapper>

        <BetweenRow style={{ width: "90%", margin: "0 auto 20px", justifyContent: "space-between" }}>
          <ButtonEx
            containerStyle={{ fontSize: getFontSize(14), height: "40px", border: "1px dotted #FE6625" }}
            onPress={_handlerecipeadd}
            width={'48'}
            radius={'4px'}
            bgcolor={'#fff'}
            color={'#FFA95E'}
            text={' 추가하기'}
          />

          <ButtonEx
            containerStyle={{
              fontSize: getFontSize(14),
              height: "40px",
              border: "1px dotted #FE6625",
              opacity: selectedCount === 1 ? 1 : 0.5,
              pointerEvents: selectedCount === 1 ? "auto" : "none",
            }}
            onPress={_handlerecipeadjust}
            width={'45'}
            radius={'4px'}
            bgcolor={'#f38d13'}
            color={'#FFF'}
            text={'삭제하기'}
          />
        </BetweenRow>

        <RecipeGuideText>
          식재료 하나만 선택하면, 해당 재료로 만들 수 있는 요리를 보여드려요.<br />
          두 개를 선택하면 두 재료를 조합한 요리 레시피를 추천해드려요.
        </RecipeGuideText>
        <div style={{width:"80%", margin:"0 auto"}}>
        
            <HongButton
              style={{
                marginTop: 20,
                opacity: 1,
                pointerEvents: 'auto',
                backgroundColor: '#f38d13',
                color: '#FFF',
                border: 'none',
              }}
              variant="primary"
              fullWidth
              onClick={_handleRecipeSearch}
            >
              레시피 찾기
            </HongButton>

        
          </div>

        <Toaster position="bottom-right" richColors />

      </Container>
    </>


  );

}

export default MobileFreezeDisplayBoard;


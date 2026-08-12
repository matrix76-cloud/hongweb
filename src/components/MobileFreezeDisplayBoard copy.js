import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import styled from 'styled-components';
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css";
import { DataContext } from "../context/Data";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { ReadFREEZE, UpdateFREEZECHECKid } from "../service/FreezeService";
import dayjs from "dayjs";
import { FreezeItems } from "../store/jotai";
import { useAtom } from "jotai";
import { Column, FlexstartColumn } from "../common/Column";
import { imageDB } from "../utility/imageData";
import { LIFEMENU } from "../utility/life";
import { useNavigate } from "react-router-dom";
import { GoBellFill } from "react-icons/go";

import { getFontSize } from '../utility/fontsize';
const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 10px;
    padding: 10px 0px;
    scroll-behavior: smooth;



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
  font-size: ${() => getFontSize(12)}px;
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
  font-size: ${getFontSize(12)}px;
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
  font-size:${getFontSize(12)}px;
  font-weight: bold;
  line-height :1;
    color :#fff;
}



.content {
  margin-top: 15px;
  line-height: 2;
}

.title {
  font-size: ${getFontSize(12)}px;
} 

.countdown {
  font-size: ${getFontSize(10)}px;


}

.countplusdown {
  font-size: ${getFontSize(10)}px;

  padding-left:3px;
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
  gap: 8px;
  padding: 5px 12px;
`;

const GridItem = styled.div`
  background: ${({ selected }) => (selected ? '#FFF2DC' : '#fff')};
  border: 1px dashed ${({ selected }) => (selected ? '#FF912E' : '#ccc')};
  border-radius: 12px;
  padding: 10px 4px;
  min-width: 80px;
  height: 60px;
  font-size: ${() => getFontSize(13)}px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EmptySlot = styled.div`
  border-radius: 12px;
  height: 70px;
  width: 100%;
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
`;




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

  const [refresh, setRefresh] = useState(1);
  const [freezeitem, setFreezeitem] = useState({});
  const [freezemenu, setFreezemenu] = useAtom(FreezeItems);
  const [selectedIndex, setSelectedIndex] = useState(null);
  console.log("MATRIX LOG : MobileFreezeDisplayBoard : freezemenu:", freezemenu);


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

  function getDday(endDate) {
    const today = dayjs().startOf("day");
    const eventDate = dayjs(endDate).startOf("day");
    return eventDate.diff(today, "day"); // 음수면 경과됨
  }


  return (
    <>
      <style>{PictureStyle}</style>
  
      {
        freezemenu.length != 0 &&
        <Container style={containerStyle} className="hidden-scrollbar">
            <style>{FreezeItemStyle}</style>

            <FridgeGridWrapper>
  
              {Array.from({ length: 12 }).map((_, i) => {
               
                const item = freezemenu[i];
                const dday = item ? getDday(item.ENDDATE) : null;
                const isExpired = dday !== null && dday < 0;

                return (
                  <GridItem
                    key={i}
                    style={{
                      border: `1px dashed ${isExpired ? '#ff4d4f' : '#ccc'}`,
                      color: isExpired ? '#ff4d4f' : '#131313'
                    }}
                    selected={selectedIndex === i}
                    onClick={() => {
                      setSelectedIndex(i);
                      item && _handleSelect(item);
                    }}
                  >
                    {item ? (
                      <>
                        <Row>
                          {item.ALARM && <img src={imageDB.bell} style={{ width: 12, marginRight }} />}
                          <span>{item.NAME}</span>
                        </Row>
                    
                        <span style={{ color: isExpired ? '#ff4d4f' : '#131313' }}>
                          {isExpired ? `❗${Math.abs(dday)}일지남` : dday === 0 ? '오늘' : `${dday}일남음`}
                        </span>
                      </>
                    ) : (
                      <EmptySlot>
                        <img src={imageDB.emptyfood} style={{ width: 36, height: 36, opacity: 0.5 }} />
                      </EmptySlot>
                    )}
                  </GridItem>
                );
              })}
  

            </FridgeGridWrapper>

      
        </Container>
      }
    </>


  );

}

export default MobileFreezeDisplayBoard;


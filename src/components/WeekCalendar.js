// ✅ 수정된 WeekCalendar – 상태별 액션 버튼: 완료 / 삭제

import React, { useContext, useEffect, useState } from "react";
import { startOfWeek, addDays, format, startOfMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { Column } from "../common/Column";
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { HomeWorkItems } from "../store/jotai";
import { useAtom } from "jotai";
import moment from "moment";
import styled from "styled-components";
import { UserContext } from "../context/User";
import { DeleteHomeWorkHOMEWORK_ID, ReadHomeWork, UpdateHOMEWORKid } from "../service/HomeWorkService";
import { getFontSize } from "../utility/fontsize";
import MobileWorkadd from "../modal/MobileWorkadd";

const ActionButton = styled.div`
  background: #f4f4f4;
  color: #FE6625;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: ${() => getFontSize(12)}px;
  margin-left: 6px;
  cursor: pointer;
  &:hover {
    background: #FFECE2;
  }
`;

const WorkLayer = styled.div`
  width: 90%;
  min-height: 35px;
  background: ${({ complete }) => (complete ? "#ededed" : "#fff")};
  padding: 10px 16px;
  margin: 8px auto 0;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ complete }) => (complete ? "none" : "0 1px 3px rgba(0,0,0,0.05)")};
  transition: all 0.2s;

  &:hover {
    background: ${({ complete }) => (complete ? "#ededed" : "#FFF7F1")};
  }
`;

const WorkContent = styled.div`
  color: #1a1e28;
  font-size: ${() => getFontSize(14)}px;
`;

const WorkNoCompleteContent = styled.div`
  background: #FFF7F1;
  color: #131313;
  border: 1px solid #FFA95E;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: ${() => getFontSize(14)}px !important;

  &:hover {
    background: #FFEFE5;
  }
`;


const WorkCompleteContent = styled.div`
  background: #F4F4F4;
  color: #9A9A9A;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: ${() => getFontSize(14)}px !important;
`;

const WorkCompleteName = styled.div`
  padding: 5px 10px;
  color: #9a9a9a;
  font-size: ${() => getFontSize(14)}px;
  border-radius: 5px;
`;

const WorkName = styled.div`
  background: #fff0e9;
  padding: 5px 10px;
  color: #fe6625;
  font-size: ${() => getFontSize(14)}px;
  border-radius: 5px;
`;

const WorkAssignee = styled.div`
  background: #EDEDED;
  color: #333;
  font-size: ${() => getFontSize(12)}px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
`;

const AlarmBadge = styled.div`
  background-color: #FFA95E;
  color: #fff;
  font-size: ${() => getFontSize(11)}px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
`;

const WeekCalendar = () => {
    const { dispatch, user } = useContext(UserContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [homeworkmenu, setHomeworkmenu] = useAtom(HomeWorkItems);
    const [workitems, setWorkitems] = useState([]);
    const [selectDate, setSelectDate] = useState(new Date());
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
    const startOfCurrentMonth = startOfMonth(currentDate);
    const Month = format(startOfCurrentMonth, "MM월");
    const Year = format(startOfCurrentMonth, "yyyy");

    const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

    function DayDelete(day) {
        return day.slice(0, 1);
    }

    function DateCheck(day) {
        return homeworkmenu.findIndex((x) => moment(x.STARTDATE).isSame(moment(day)));
    }

    function SelectCheck(day) {
        return moment(selectDate).isSame(moment(day)) ? 0 : -1;
    }

    async function FetchData() {
        const USERS_ID = user.USERS_ID;
        const homeworkitemsTmp = await ReadHomeWork({ USERS_ID });
        if (homeworkitemsTmp !== -1) setHomeworkmenu(homeworkitemsTmp);
    }

    const _handleSelectData = (day) => {
        setSelectDate(day);
        const homeworkitemsTmp = homeworkmenu.filter((data) => moment(data.STARTDATE).isSame(moment(day)));
        setWorkitems(homeworkitemsTmp);
        setRefresh((refresh) => refresh + 1);
    };

    const _handleworkadd = () => {
        if (workitems.length >= 3) {
            alert("하루에 최대 3개까지만 등록할 수 있어요.");
            return;
        }
        setShowPopup(true);
    };

    const _handleClosePopup = () => {
        setShowPopup(false);
        setRefresh((refresh) => refresh + 1);
    };

    const handleComplete = async (item, complete) => {
        await UpdateHOMEWORKid({ HOMEWORK_ID: item.HOMEWORK_ID, complete: complete });
        setRefresh((r) => r + 1);
    };

    const handleDelete = async (item) => {
        const confirm = window.confirm("정말 삭제할까요?");
        if (confirm) {
            await DeleteHomeWorkHOMEWORK_ID({ HOMEWORK_ID: item.HOMEWORK_ID });
            setRefresh((r) => r + 1);
        }
    };

    useEffect(() => {
        setSelectDate(selectDate);
        setWorkitems(workitems);
    }, [refresh]);

    useEffect(() => {
        currentDate.setHours(0, 0, 0, 0);
        setSelectDate(currentDate);
        setRefresh((refresh) => refresh + 1);
        FetchData();
        _handleSelectData(currentDate);
        setLoading(false);
    }, []);

    return (
        <>
            <div style={{ textAlign: "center", padding: "10px" }}>
                <FlexstartRow style={{ width: "50%", color: "#131313", paddingTop: 3 }}>
                    <Row style={{ paddingTop: 5, justifyContent: "space-evenly", width: "50%" }}>
                        <div style={{ fontSize: () => getFontSize(16), color: "#131313", fontFamily: "Pretendard-SemiBold" }}>{Year}년 {Month}</div>
                    </Row>
                    <Row style={{ paddingTop: 5, justifyContent: "space-evenly", width: "50%" }}>
                        <div onClick={handlePrevWeek}>◀</div>
                        <div onClick={handleNextWeek}>▶</div>
                    </Row>
                </FlexstartRow>

                <Column>
                    <div style={{ display: "flex", justifyContent: "center", fontSize: () => getFontSize(16), color: "#131313", width: "100%" }}>
                        {weekDays.map((day, index) => (
                            <div onClick={() => _handleSelectData(day)} key={index} style={{ margin: "3px", textAlign: "center", width: "14%", position: "relative", lineHeight: 2 }}>
                                {DateCheck(day) !== -1 && <div style={{ position: 'absolute', background: '#ff0000', height: 5, width: 5, top: 10, left: '50%', borderRadius: 5, transform: 'translateX(-50%)' }} />}
                                <div style={{ color: SelectCheck(day) === 0 ? "#FE6625" : "#131313" }}>{format(day, "EEE", { locale: ko })[0]}</div>
                                <div
                                    style={{
                                        borderRadius: 30,
                                        backgroundColor: SelectCheck(day) === 0 ? "#FE6625" : "transparent",
                                        color: SelectCheck(day) === 0 ? "#fff" : "#131313"
                                    }}
                                >
                                    {format(day, "dd")}
                                </div>
                            </div>
                        ))}
                    </div>
                </Column>

                <Column style={{ fontSize: () => getFontSize(12), color: "#96989C", lineHeight: 1.5 }}>
                    {Array.from({ length: Math.max(workitems.length, 3) }).map((_, index) => {
                        const item = workitems[index];
                        return (
                            <WorkLayer key={index} complete={item?.complete || false}>
                                {item ? (
                                    <>
                                        {item.complete ? (
                                            <WorkCompleteContent onClick={() => handleComplete(item, false)} style={{ cursor: 'pointer' }}>
                                                <Row style={{ gap: 8 }}>
                                                
                                                        <WorkAssignee>{item.NAME}</WorkAssignee>
                                                        {item.ALARM && <AlarmBadge>알림</AlarmBadge>}
                                                
                                             
                                                    {item.MEMO} 
                                                </Row>
                                        
                                            </WorkCompleteContent>
                                        ) : (
                                            <WorkNoCompleteContent onClick={() => handleComplete(item, true)} style={{ cursor: 'pointer' }}>
                                                <Row style={{ gap: 8 }}>
                                                     
                                                            <WorkAssignee>{item.NAME}</WorkAssignee>
                                                            {item.ALARM && <AlarmBadge>알림</AlarmBadge>}
                                                  
                                        
                                                    {item.MEMO} 
                                                </Row>
                                           
                                            </WorkNoCompleteContent>
                                        )}
                                        <Row>
                                            <ActionButton onClick={() => handleDelete(item)}>삭제</ActionButton>
                                        </Row>
                               </>
                                ) : (
                                    <WorkContent style={{ opacity: 0.3, cursor: "pointer" }} onClick={_handleworkadd}>
                                        + 가사분담을 추가해보세요
                                    </WorkContent>
                                )}
                            </WorkLayer>
                        );
                    })}
                </Column>
            </div>

            {showPopup && <MobileWorkadd date={selectDate}  callback={_handleClosePopup} />}
        </>
    );
};

export default WeekCalendar;

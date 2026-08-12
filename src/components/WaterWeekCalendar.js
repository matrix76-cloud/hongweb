import React, { useContext, useEffect, useState } from "react";
import { startOfWeek, addDays, format, startOfMonth } from "date-fns";

import { ko } from "date-fns/locale"; // 한국어 로캘 impor
import { Column } from "../common/Column";
import { BetweenRow, Row } from "../common/Row";

import { AiOutlineRight } from "react-icons/ai";
import { AiOutlineLeft } from "react-icons/ai";
import { HomeWorkItems } from "../store/jotai";
import { useAtom } from "jotai";
import moment from "moment";
import styled from 'styled-components';
import { GoBellFill } from "react-icons/go";
import { UserContext } from "../context/User";
import { ReadHomeWork } from "../service/HomeWorkService";
import { imageDB } from "../utility/imageData";

const CheckDate = styled.div`
    position: absolute;
    background: #ff0000;
    height: 5px;
    width: 5px;
    top: 10px;
    left: 25px;
    border-radius: 5px;

`

const SelectDate1 = styled.div`


    color: ${(props) => {
        switch (props.status) {
            case 0:
                return "#2589fe";
            default:
                return "";

        }
    }};


`

const SelectDate2 = styled.div`

    border-radius : 10px;
    background-color: ${(props) => {
        switch (props.status) {
            case 0:
                return "#2589fe";
            default:
                return "transparent";
         
        }
    }};
    color: ${(props) => {
        switch (props.status) {
            case 0:
                return "#fff";
            default:
                return "#131313";

        }
    }};


`
const WorkLayer = styled.div`
    width: 80%;
    height: 40px;
    background: ${({complete}) => complete == true ? ('#ededed'):('#fff')};
    padding: 0px 20px;
    margin: 10px 0px 0px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

`
const WorkContent = styled.div`
    color :#1A1E28;
    font-size: ${() => getFontSize(14)}px;

`
const WorkCompleteContent = styled.div`
    color :##9a9a9a;
    font-size: ${() => getFontSize(14)}px;


`

const WorkCompleteName = styled.div`

    padding: 5px 10px;
    color: #9a9a9a;
    font-size: ${() => getFontSize(14)}px;
    border-radius: 5px;

`
const WorkName = styled.div`
    background: #FFF0E9;
    padding: 5px 10px;
    color: #FE6625;
    font-size: ${() => getFontSize(14)}px;
    border-radius: 5px;

`
const NaviButton = styled.div`
    background: #EDEDED;
    padding: 5px;
    color: #131313;
    font-size: ${() => getFontSize(14)}px;
    border-radius: 5px;


`

const WaterWeekCalendar = () => {
    const { dispatch, user } = useContext(UserContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [homeworkmenu, setHomeworkmenu] = useAtom(HomeWorkItems);
    const [workitems, setWorkitems] = useState([]);
    const [selectDate, setSelectDate] = useState(new Date());
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true)


    // 현재 주의 시작 날짜 계산 (일요일 기준)
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
    const startOfCurrentMonth = startOfMonth(currentDate);

    const Month = format(startOfCurrentMonth, 'MM월');
    const Year = format(startOfCurrentMonth, 'yyyy');

 

    // 이전 주 & 다음 주 이동
    const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

    // 한 주의 날짜 리스트 생성
    const weekDays = Array.from({ length: 7 }, (_, i) =>
        addDays(startOfCurrentWeek, i)
    );

    function DayDelete(day) {
        return day.slice(0, 1);
    }

    function DateCheck(day) {
        const FindIndex = homeworkmenu.findIndex(x => moment(x.STARTDATE).isSame(moment(day)));
        if (FindIndex != -1) {
            return FindIndex;
        } else {
            return FindIndex;
        }
    }

    function SelectCheck(day) {
        if (moment(selectDate).isSame(moment(day))) {
            return 0;
        } else {
            return -1;
        }
    }

    async function FetchData(){
        const USERS_ID = user.USERS_ID;
        const homeworkitemsTmp = await ReadHomeWork({ USERS_ID });

        console.log("homeworkitems", homeworkitemsTmp);

        if (homeworkitemsTmp != -1) {
            setHomeworkmenu(homeworkitemsTmp);
        }

    }

    const _handleSelectData = (day) => {

        console.log("_handleSelectDate", day);
        setSelectDate(day);
        let homeworkitemsTmp = [];
        homeworkmenu.map((data, index) => {
            if (moment(data.STARTDATE).isSame(moment(day))) {
                homeworkitemsTmp.push(homeworkmenu[index]);
            }
        })
        console.log("homeworkitemsTmp", homeworkitemsTmp);
        setWorkitems(homeworkitemsTmp);
        setRefresh((refresh) => refresh + 1);
    }

    useEffect(() => {
        setSelectDate(selectDate);
        setWorkitems(workitems);
    }, [refresh])


    useEffect(() => {

        FetchData();

        currentDate.setHours(0, 0, 0, 0);

        console.log("useEffect select day", currentDate);
        setSelectDate(currentDate);
        _handleSelectData(currentDate);

        setLoading(false);
        setRefresh((refresh) => refresh + 1);


    }, [])

    return (
        <>
            {loading == false &&
                <div style={{ textAlign: "center", padding: "10px" }}>



                    <Row>
                        <Column style={{ width: "20%", color: "#66686F", paddingTop: 3 }}>
                            <Row>
                                {/* <img src={imageDB.calendar} style={{ width: 20 }} /> */}
                                <div style={{ fontSize: () => getFontSize(16), color: "#66686F", fontFamily: "Pretendard-SemiBold" }}>{Month}</div>
                            </Row>
                        
                            <Row style={{ paddingTop: 5, justifyContent:"space-evenly", width:"100%" }}>
                                {/* <AiOutlineLeft onClick={handlePrevWeek} /> */}
                                <NaviButton onClick={handlePrevWeek} >◀</NaviButton>
                                <NaviButton onClick={handleNextWeek} >▶</NaviButton>
                                {/* <AiOutlineRight onClick={handleNextWeek} style={{ paddingLeft: 5 }} /> */}
                            </Row>
                        </Column>
                        <div style={{ display: "flex", justifyContent: "center", fontSize: () => getFontSize(16), color: "#B8B9BC", width: "80%" }}>

                            {weekDays.map((day, index) => (
                                <div onClick={() => { _handleSelectData(day) }} key={index} style={{ margin: "3px", textAlign: "center", width: "30px", position: "relative", lineHeight: 2 }}>
                                    {/* {
                                        DateCheck(day) != -1 && <CheckDate></CheckDate>
                                    } */}
                                    <SelectDate1 status={SelectCheck(day)}>{DayDelete(format(day, "EEEE", { locale: ko }))}</SelectDate1>
                                    <SelectDate2 status={SelectCheck(day)}>{format(day, "dd")}</SelectDate2>
                                </div>
                            ))}
                        </div>
                    </Row>

                    {/* <Column style={{ fontSize: () => getFontSize(14), color: '#96989C', lineHeight: 1.5 }}>
                        {
                            workitems.length != 0 ? (<>
                                {
                                    workitems.map((data) => (
                                        <WorkLayer complete={data.complete}>

                                            {
                                                data.complete == false ? (<WorkContent>
                                                    {data.MEMO}
                                                    <span>{'[미완료]'}</span>
                                                </WorkContent>) : (<WorkCompleteContent>
                                                    {data.MEMO}
                                                    <span>{'[완료]'}</span>
                                                </WorkCompleteContent>)
                                            }

                                            
                                            {
                                                data.ALARM == true && <GoBellFill size={14} color={'#FE6625'} />
                                            }
                                            {
                                                data.complete == false ? (<WorkName>{data.NAME}</WorkName>)
                                                    : (<WorkCompleteName>{data.NAME}</WorkCompleteName>)
                                            }

                                      
                                        </WorkLayer>
                                    ))
                                }
                            </>) : (<div style={{ paddingTop: 10 }}>
                                <div>해당 날짜에</div>
                                <div>물 관리입니다</div>
                            </div>)
                        }

                    </Column> */}
                </div>
            }    
        
        </>

    );
};

export default WaterWeekCalendar;

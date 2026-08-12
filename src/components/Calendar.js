import { memo } from "react";
import { getFontSize } from "../utility/fontsize";


const CalendarNavigator = memo(({ selectedDate, onDateChange }) => {
     

    console.log("CalendarNavigator", selectedDate);

    const handlePrevious = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 7);
        onDateChange(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 7);
        onDateChange(newDate);
    };

    const formatDate = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startMonth = startOfWeek.getMonth() + 1;
        const startDay = startOfWeek.getDate();
        const endMonth = endOfWeek.getMonth() + 1;
        const endDay = endOfWeek.getDate();

        return `${startMonth}월 ${startDay}일 ~ ${endMonth}월 ${endDay}일`;
    };

    const navigatorStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        marginBottom: '20px',
        fontSize: '18px',
        width:'90%'
    };

    const arrowStyle = {
        cursor: 'pointer',
        fontSize: '16px',
        color: '#777',
        fontFamily:'Pretendard',
        background: 'none',
        border: 'none'
    };

    return (
        <div style={navigatorStyle}>
            <div style={arrowStyle} onClick={handlePrevious}>이전 주</div>
            <div style={{fontSize: () => getFontSize(14),color:"#777"}}>{formatDate(selectedDate)}</div>
            <div style={arrowStyle} onClick={handleNext}>다음 주</div>
        </div>
    );
 });

export default CalendarNavigator;

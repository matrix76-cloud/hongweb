import React, { useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MobileSchedulePopup.css";

/**
 * 일정 등록 (대화방 첨부 옆 달력 버튼). (형 지시 2026-08-12)
 *
 * 날짜를 고르고 시간과 내용을 적어 보내면, 대화에 일정 카드로 남는다.
 * 서로 확인만 하는 용도다 — 확정/변경은 대화로 이어가면 된다.
 */
const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
`;

const Sheet = styled.div`
  width: 100%;
  box-sizing: border-box;
  max-height: 92vh;
  overflow-y: auto;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 18px 16px calc(16px + env(safe-area-inset-bottom, 0px));
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.b`
  flex: 1;
  font-size: 17px;
  color: #131313;
`;

const Close = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  line-height: 1;
  color: #71717a;
  cursor: pointer;
  padding: 2px 4px;
`;

const Label = styled.div`
  margin: 16px 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: #131313;
`;

const Times = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TimeChip = styled.button`
  box-sizing: border-box;
  flex: 0 1 auto;
  min-width: 72px;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  border: ${({ $on }) => ($on ? "1.5px solid #FF4E19" : "1px solid #E3E3E3")};
  background: ${({ $on }) => ($on ? "#FFF5F0" : "#fff")};
  color: ${({ $on }) => ($on ? "#FF4E19" : "#131313")};
  font-weight: ${({ $on }) => ($on ? 700 : 500)};
`;

const Memo = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 76px;
  padding: 12px;
  border: 1px solid #E3E3E3;
  border-radius: 10px;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
  resize: none;
  outline: none;
  &:focus { border-color: #FF4E19; }
`;

const Send = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 16px;
  border: none;
  border-radius: 12px;
  background: #FF4E19;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: .5; cursor: default; }
`;

// 30분 단위는 너무 잘아서 자주 쓰는 시간대만
const TIMES = ["오전 9:00", "오전 10:00", "오전 11:00", "오후 12:00", "오후 1:00",
  "오후 2:00", "오후 3:00", "오후 4:00", "오후 5:00", "오후 6:00", "오후 7:00", "시간 미정"];

const fmtDate = (d) =>
  `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${"일월화수목금토"[d.getDay()]})`;

const MobileSchedulePopup = ({ onClose, onSubmit }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [memo, setMemo] = useState("");

  const submit = () => {
    if (!date) return;
    onSubmit?.({
      at: date.getTime(),
      label: fmtDate(date),
      time,
      memo: memo.trim(),
    });
  };

  return createPortal(
    <Dim onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Head>
          <Title>일정 잡기</Title>
          <Close onClick={onClose} aria-label="닫기">×</Close>
        </Head>

        <div className="chatCalendar">
          <Calendar
            onChange={setDate}
            value={date}
            calendarType="gregory"
            locale="ko-KR"
            minDate={new Date()}
            formatDay={(locale, d) => d.getDate()}
          />
        </div>

        <Label>시간</Label>
        <Times>
          {TIMES.map((t) => (
            <TimeChip key={t} $on={time === t} onClick={() => setTime(time === t ? "" : t)}>
              {t}
            </TimeChip>
          ))}
        </Times>

        <Label>내용</Label>
        <Memo
          value={memo}
          placeholder="어떤 일정인지 적어주세요 (예: 집 청소 방문)"
          onChange={(e) => setMemo(e.target.value)}
        />

        <Send disabled={!date} onClick={submit}>일정 보내기</Send>
      </Sheet>
    </Dim>,
    document.body
  );
};

export default MobileSchedulePopup;

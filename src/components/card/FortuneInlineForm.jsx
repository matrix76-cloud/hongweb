import React, { useState } from "react";
import styled from "styled-components";

/**
 * Props:
 * - initial?: { dob, time, cal }
 * - onSubmit?: (profile) => void
 */
const FortuneInlineForm = ({ initial = {}, onSubmit }) => {
    const [dob, setDob] = useState(initial.dob || "");
    const [time, setTime] = useState(initial.time || "12:00");
    const [cal, setCal] = useState(initial.cal || "solar"); // 'solar' | 'lunar'
    const TZ = "Asia/Seoul"; // 🔒 고정

    const canSubmit = /^\d{4}-\d{2}-\d{2}$/.test(dob);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit?.({
            birth: dob,
            time,                     // ← 항상 시간 입력 사용 (모름 제거)
            lunar: cal === "lunar",
            tz: TZ,
        });
    };

    return (
        <Card as="form" onSubmit={handleSubmit} aria-label="운세 기본정보 입력 폼">
            <Head>운세 보려면 기본 정보를 입력해 주세요 🔮</Head>

            <Row>
                <Label>생년월일</Label>
                <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                />
            </Row>

            <Row>
                <Label>출생시간</Label>
                <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </Row>

            <Row>
                <Label>양/음력</Label>
                <Segmented role="tablist" aria-label="calendar type">
                    <SegBtn
                        type="button"
                        $active={cal === "solar"}
                        aria-pressed={cal === "solar"}
                        onClick={() => setCal("solar")}
                    >
                        양력
                    </SegBtn>
                    <SegBtn
                        type="button"
                        $active={cal === "lunar"}
                        aria-pressed={cal === "lunar"}
                        onClick={() => setCal("lunar")}
                    >
                        음력
                    </SegBtn>
                </Segmented>
            </Row>

            <Actions>
                <Primary type="submit" disabled={!canSubmit}>
                    저장하고 운세 보기
                </Primary>
            </Actions>
        </Card>
    );
};

export default FortuneInlineForm;

/* ---------- styles ---------- */
const Card = styled.div`
  width: min(680px, 100%);
  margin: 8px auto;
  background: #fff;
  border: 1px solid #e9ecf2;
  border-radius: 12px;
  padding: 14px 14px 16px;      /* 상하 여백 업 */
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  box-sizing: border-box;
`;

const Head = styled.div`
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 10px;
  line-height: 1.4;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 10px;
  align-items: center;
  & + & { margin-top: 12px; }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;   /* 모바일에서 라벨 위, 입력 아래 */
    gap: 6px;
  }
`;

const Label = styled.div`
  font-size: 13px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;                 /* 🔑 오버플로 방지 */
  height: 40px;
  padding: 8px 10px;
  border: 1px solid #e3e6ec;
  border-radius: 10px;
  font-size: 14px;
  box-sizing: border-box;
  background: #fff;
`;

const Segmented = styled.div`
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SegBtn = styled.button`
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${p => (p.$active ? "#4f7cff" : "#e3e6ec")};
  background: ${p => (p.$active ? "#eaf1ff" : "#fff")};
  color: ${p => (p.$active ? "#2e5fff" : "#333")};
  font-size: 13px;
`;

const Actions = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 420px) {
    justify-content: stretch;
  }
`;

const Primary = styled.button`
  width: auto;
  @media (max-width: 420px) { width: 100%; }  /* 모바일은 풀폭 */
  padding: 10px 12px;
  border-radius: 10px;
  border: 0;
  background: #2e5fff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  opacity: ${p => (p.disabled ? 0.6 : 1)};
`;

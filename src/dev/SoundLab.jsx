import React, { useRef, useState } from "react";
import styled from "styled-components";

/**
 * 알림음 시안 랩 — /soundlab (개발용, 어디에도 링크 안 함)
 * "홍여사" 목소리 후보를 번호로 나란히 놓고 형이 골라준다. (형 지시 2026-08-22 "홍여사 이렇게 귀엽게 나오는")
 * 파일은 public/sounds/noti/cand/ — 고르면 그걸 honglady.mp3 로 쓴다.
 */
const CANDS = [
  { n: 1, file: '1_yuna_normal.mp3',        desc: '유나 목소리 "홍여사~" 그대로' },
  { n: 2, file: '2_yuna_cute.mp3',          desc: '같은 말, 음을 조금 올려 귀엽게' },
  { n: 3, file: '3_yuna_cuter.mp3',         desc: '음을 더 올려 더 귀엽게' },
  { n: 4, file: '4_yuna_twice_cute.mp3',    desc: '"홍여사, 홍여사!" 두 번, 귀엽게' },
  { n: 5, file: '5_yuna_alrim_cute.mp3',    desc: '"홍여사 알림이에요", 귀엽게' },
  { n: 6, file: '6_yuna_ddingdong_cute.mp3',desc: '"띵동, 홍여사!" 말로 띵동' },
  { n: 7, file: '7_ding_yuna_cute.mp3',     desc: '종소리 한 번 + "홍여사~" 귀엽게' },
  { n: 8, file: '8_ding_yuna_cuter.mp3',    desc: '종소리 한 번 + "홍여사~" 더 귀엽게' },
  { n: 9, file: '9_yuna_cute_veryslow.mp3', desc: '2번을 조금 더 천천히' },
];

const Wrap = styled.div`
  padding: 32px 40px 60px;
  max-width: 760px;
  color: #1b1f27;
`;
const Title = styled.h1`
  font-size: 23px;
  font-weight: 700;
  margin: 0 0 6px;
`;
const Sub = styled.div`
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 24px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid ${({ $on }) => ($on ? '#1b1f27' : '#dcdfe4')};
  background: ${({ $on }) => ($on ? '#f1f4f8' : '#fff')};
  margin-bottom: 10px;
  cursor: pointer;
`;
const Num = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1b1f27;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
`;
const Desc = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: 600;
`;
const File = styled.div`
  font-size: 13px;
  color: #555;
`;
const Btn = styled.button`
  flex-shrink: 0;
  height: 40px;
  padding: 0 18px;
  border: 1px solid #1b1f27;
  background: ${({ $on }) => ($on ? '#1b1f27' : '#fff')};
  color: ${({ $on }) => ($on ? '#fff' : '#1b1f27')};
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
`;

const SoundLab = () => {
  const [playing, setPlaying] = useState(0);
  const ref = useRef(null);

  const play = (c) => {
    ref.current?.pause();
    const a = new Audio(`/sounds/noti/cand/${c.file}`);
    ref.current = a;
    setPlaying(c.n);
    const done = () => setPlaying((n) => (n === c.n ? 0 : n));
    a.onended = done; a.onerror = done;
    a.play().catch(done);
  };

  return (
    <Wrap>
      <Title>알림음 시안 — "홍여사" 목소리</Title>
      <Sub>
        번호를 눌러 들어보고 번호로 골라주세요. 처음 것은 2배속으로 잘못 나간 거라 전부 정상 속도로 다시 뽑았고, 9번만 조금 더 느립니다. 섞어서도 됩니다(예: "4번 말에 7번 종소리").<br />
        맥 내장 한국어 음성(유나)으로 만든 것이라 진짜 성우보다는 기계 느낌이 조금 있습니다 — 더 귀여운 목소리가 필요하면 TTS 서비스(네이버 클로바 등)로 뽑을 수 있습니다.
      </Sub>
      {CANDS.map((c) => (
        <Row key={c.n} $on={playing === c.n} onClick={() => play(c)}>
          <Num>{c.n}</Num>
          <div style={{ flex: 1 }}>
            <Desc>{c.desc}</Desc>
            <File>{c.file}</File>
          </div>
          <Btn $on={playing === c.n}>{playing === c.n ? '재생 중' : '들어보기'}</Btn>
        </Row>
      ))}
    </Wrap>
  );
};

export default SoundLab;

// 약관 동의 화면 시안 (형 지시 2026-08-23 "동의 화면 시안 보여줄래? 시안랩으로 가자")
//
// 0번이 지금 나가는 화면 그대로(기준)고, 1~7번이 시안이다.
// 폭은 /Mobileagree 실측 390px. 체크박스는 실제로 눌러볼 수 있게 해뒀다(버튼 활성도 같이 바뀐다).
// 번호로 골라주시면 그대로 /Mobileagree 에 넣는다. 섞어 고르셔도 된다("3번 배치에 6번 버튼").
import React, { useState } from "react";
import styled from "styled-components";
import { RiArrowRightSLine } from "react-icons/ri";

const ORANGE = "#FF4E19";
const INK = "#1b1f27";
const TEXT = "#131313";
const FONT = "'Pretendard Variable', Pretendard, -apple-system, 'Malgun Gothic', sans-serif";

const ITEMS = [
  { key: "use", label: "이용약관", required: true, view: true },
  { key: "privacy", label: "개인정보 처리지침", required: true, view: true },
  { key: "gps", label: "위치기반 서비스 이용약관", required: true, view: true },
  { key: "marketing", label: "마케팅 정보 수신", required: false, view: false },
];
const REQUIRED = ITEMS.filter((x) => x.required).map((x) => x.key);

/* 케이스마다 독립된 체크 상태 */
const useAgree = () => {
  const [c, setC] = useState({});
  const all = ITEMS.every((x) => c[x.key]);
  const can = REQUIRED.every((k) => c[k]);
  const toggleAll = () => { const m = {}; ITEMS.forEach((x) => { m[x.key] = !all; }); setC(m); };
  const toggle = (k) => setC((p) => ({ ...p, [k]: !p[k] }));
  return { c, all, can, toggleAll, toggle };
};

/* ── 랩 틀 ─────────────────────────────────────────── */
const Page = styled.div`
  padding: 28px 24px 90px;
  background: #fff;
  color: ${INK};
  font-family: ${FONT};
`;
const H1 = styled.h1` margin: 0 0 6px; font-size: 23px; font-weight: 800; `;
const Lead = styled.p` margin: 0 0 28px; font-size: 15px; line-height: 1.65; color: #2b2f36; `;
const Cases = styled.div` display: flex; flex-wrap: wrap; gap: 26px; align-items: flex-start; `;
const Case = styled.section` width: 390px; `;
const CaseHead = styled.div` display: flex; align-items: baseline; gap: 8px; margin-bottom: 3px; `;
const CaseNo = styled.span` font-size: 17px; font-weight: 800; `;
const CaseName = styled.span` font-size: 15px; font-weight: 700; `;
const CaseNote = styled.div`
  font-size: 13px; line-height: 1.55; color: #2b2f36;
  margin-bottom: 10px; min-height: 42px;
`;
const Stage = styled.div`
  width: 390px; height: 720px; box-sizing: border-box;
  border: 1px solid #e6e6e6; overflow: hidden; position: relative;
  background: ${({ $bg }) => $bg || "#fff"};
  color: ${TEXT};
`;

/* ── 공용 조각 ─────────────────────────────────────── */
const CheckSvg = ({ color = "#fff", size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8.5l3.2 3L13 4.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* 네모 체크 — 먹색 */
const Sq = styled.button`
  flex: none; width: 24px; height: 24px; box-sizing: border-box; padding: 0;
  border: 1.5px solid ${({ $on }) => ($on ? INK : "#C9C9CC")};
  border-radius: ${({ $r }) => $r ?? "4px"};
  background: ${({ $on }) => ($on ? INK : "#fff")};
  display: flex; align-items: center; justify-content: center; cursor: pointer;
`;
/* 원형 체크 */
const Circ = styled(Sq)` border-radius: 50%; width: 26px; height: 26px; `;

const SqCheck = ({ on, onClick, r }) => <Sq $on={on} $r={r} onClick={onClick} aria-pressed={on}>{on && <CheckSvg />}</Sq>;
const CircCheck = ({ on, onClick }) => <Circ $on={on} onClick={onClick} aria-pressed={on}>{on && <CheckSvg />}</Circ>;

const Btn = styled.button`
  width: 100%; height: 54px; border: none; cursor: pointer;
  font-size: 17px; font-weight: 700; font-family: inherit; color: #fff;
  background: ${({ $bg }) => $bg || INK};
  border-radius: ${({ $r }) => $r ?? "0"};
  &:disabled { opacity: .35; cursor: default; }
`;
const View = styled.button`
  flex: none; display: flex; align-items: center; gap: 2px;
  background: none; border: none; font-family: inherit; cursor: pointer;
  font-size: 14px; color: ${({ $c }) => $c || "#71717a"}; padding: 4px 0 4px 4px; white-space: nowrap;
`;
const Req = styled.b` font-weight: 700; color: ${({ $c }) => $c || "#71717a"}; `;

/* ═══════════════════════════════════════════════════════════
   0. 현재 화면 (기준) — 지금 /Mobileagree 모양을 그대로 옮겨둠
   ═══════════════════════════════════════════════════════════ */
const S0 = styled.div`
  padding: 40px 20px 32px;
  h1 { margin: 0 0 24px; font-size: 26px; font-weight: 800; text-align: center; color: ${TEXT}; }
  p.lead { margin: -8px 0 24px; font-size: 16px; line-height: 1.6; color: #71717a; text-align: center; }
  .card { background: #fff; border-radius: 16px; padding: 24px 20px; }
  .all { display: flex; align-items: center; gap: 12px; padding: 6px 2px 18px; border-bottom: 1px solid #EFEFEF; font-size: 17px; font-weight: 700; }
  .row { display: flex; align-items: center; gap: 8px; padding: 14px 2px; }
  .lab { flex: 1; display: flex; align-items: center; gap: 10px; font-size: 15px; }
  .lab b { color: #71717a; }
  input { width: 22px; height: 22px; accent-color: ${ORANGE}; margin: 0; flex: none; cursor: pointer; }
  .note { margin-top: 18px; font-size: 14px; line-height: 1.6; color: #A3A3A3; }
`;
const Case0 = () => {
  const a = useAgree();
  return (
    <Stage $bg="#F7F7F8">
      <S0>
        <h1>약관에 동의해주세요</h1>
        <p className="lead">가입하기 전에 한 번만 확인합니다.<br />필수 항목에 동의해야 시작할 수 있습니다.</p>
        <div className="card">
          <label className="all"><input type="checkbox" checked={a.all} onChange={a.toggleAll} />모두 동의합니다</label>
          {ITEMS.map((it) => (
            <div className="row" key={it.key}>
              <label className="lab"><input type="checkbox" checked={!!a.c[it.key]} onChange={() => a.toggle(it.key)} /><span><b>{it.required ? "(필수) " : "(선택) "}</b>{it.label}</span></label>
              {it.view && <View $c="#A3A3A3">보기 <RiArrowRightSLine size={16} /></View>}
            </div>
          ))}
          <Btn $bg={ORANGE} $r="10px" style={{ marginTop: 22 }} disabled={!a.can}>동의하고 계속하기</Btn>
          <div className="note">마케팅 정보 수신은 동의하지 않아도 서비스를 쓸 수 있습니다.</div>
        </div>
      </S0>
    </Stage>
  );
};

/* ═══════════════════════════════════════════════════════════
   1. 먹색 정돈 — 배치는 그대로, 주황·라운드 카드만 걷어냄
   ═══════════════════════════════════════════════════════════ */
const S1 = styled.div`
  padding: 44px 20px 32px;
  h1 { margin: 0 0 10px; font-size: 26px; font-weight: 800; }
  p.lead { margin: 0 0 28px; font-size: 16px; line-height: 1.6; color: #2b2f36; }
  .card { border: 1px solid #DADADA; padding: 4px 18px 22px; }
  .all { display: flex; align-items: center; gap: 12px; padding: 18px 0; border-bottom: 1px solid #DADADA; font-size: 18px; font-weight: 800; cursor: pointer; }
  .row { display: flex; align-items: center; gap: 12px; padding: 15px 0; }
  .lab { flex: 1; display: flex; align-items: center; gap: 12px; font-size: 16px; cursor: pointer; }
  .note { margin-top: 14px; font-size: 14px; line-height: 1.6; color: #2b2f36; }
`;
const Case1 = () => {
  const a = useAgree();
  return (
    <Stage>
      <S1>
        <h1>약관에 동의해주세요</h1>
        <p className="lead">가입하기 전에 한 번만 확인합니다.<br />필수 항목에 동의해야 시작할 수 있습니다.</p>
        <div className="card">
          <div className="all" onClick={a.toggleAll}><SqCheck on={a.all} r="0" />모두 동의합니다</div>
          {ITEMS.map((it) => (
            <div className="row" key={it.key}>
              <div className="lab" onClick={() => a.toggle(it.key)}><SqCheck on={!!a.c[it.key]} r="0" /><span><Req>{it.required ? "(필수) " : "(선택) "}</Req>{it.label}</span></div>
              {it.view && <View>보기 <RiArrowRightSLine size={16} /></View>}
            </div>
          ))}
          <Btn style={{ marginTop: 16 }} disabled={!a.can}>동의하고 계속하기</Btn>
          <div className="note">마케팅 정보 수신은 동의하지 않아도 서비스를 쓸 수 있습니다.</div>
        </div>
      </S1>
    </Stage>
  );
};

/* ═══════════════════════════════════════════════════════════
   2. 카드 없는 목록 + 하단 고정 버튼 — 가장 앱다운 기본형
   ═══════════════════════════════════════════════════════════ */
const S2 = styled.div`
  position: absolute; inset: 0; display: flex; flex-direction: column;
  .body { flex: 1; padding: 56px 22px 0; }
  h1 { margin: 0 0 8px; font-size: 26px; font-weight: 800; line-height: 1.3; }
  p.lead { margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #2b2f36; }
  .all { display: flex; align-items: center; gap: 14px; padding: 18px 0; border-top: 1px solid ${INK}; border-bottom: 1px solid ${INK}; font-size: 18px; font-weight: 800; cursor: pointer; }
  .row { display: flex; align-items: center; gap: 14px; padding: 17px 0; border-bottom: 1px solid #EBEBEB; }
  .lab { flex: 1; display: flex; align-items: center; gap: 14px; font-size: 16px; cursor: pointer; }
  .foot { padding: 12px 22px 28px; }
  .foot .note { margin-bottom: 12px; font-size: 14px; line-height: 1.6; color: #2b2f36; }
`;
const Case2 = () => {
  const a = useAgree();
  return (
    <Stage>
      <S2>
        <div className="body">
          <h1>홍여사를 시작하려면<br />약관 동의가 필요해요</h1>
          <p className="lead">가입하기 전에 한 번만 확인합니다.</p>
          <div className="all" onClick={a.toggleAll}><CircCheck on={a.all} />전체 동의</div>
          {ITEMS.map((it) => (
            <div className="row" key={it.key}>
              <div className="lab" onClick={() => a.toggle(it.key)}><CircCheck on={!!a.c[it.key]} /><span><Req $c={INK}>{it.required ? "[필수] " : "[선택] "}</Req>{it.label}</span></div>
              {it.view && <View $c="#A3A3A3"><RiArrowRightSLine size={22} /></View>}
            </div>
          ))}
        </div>
        <div className="foot">
          <div className="note">마케팅 정보 수신은 동의하지 않아도 서비스를 쓸 수 있습니다.</div>
          <Btn disabled={!a.can}>동의하고 시작하기</Btn>
        </div>
      </S2>
    </Stage>
  );
};

/* ═══════════════════════════════════════════════════════════
   3. 전체 동의를 먹색 띠로 — 한 번에 끝내는 사람을 위한 배치
   ═══════════════════════════════════════════════════════════ */
const S3 = styled.div`
  position: absolute; inset: 0; display: flex; flex-direction: column;
  .body { flex: 1; padding: 56px 22px 0; }
  h1 { margin: 0 0 26px; font-size: 26px; font-weight: 800; line-height: 1.3; }
  .all { display: flex; align-items: center; gap: 14px; padding: 0 18px; height: 62px; cursor: pointer;
    background: ${({ $on }) => ($on ? INK : "#F1F4F8")}; color: ${({ $on }) => ($on ? "#fff" : TEXT)};
    border: 1px solid ${({ $on }) => ($on ? INK : "#DADADA")}; }
  .all b { font-size: 17px; font-weight: 800; }
  .all small { display: block; font-size: 13px; font-weight: 500; margin-top: 2px; opacity: .8; }
  .list { padding: 6px 4px 0; }
  .row { display: flex; align-items: center; gap: 14px; padding: 16px 0; border-bottom: 1px solid #EBEBEB; }
  .lab { flex: 1; display: flex; align-items: center; gap: 14px; font-size: 16px; cursor: pointer; }
  .foot { padding: 12px 22px 28px; }
`;
const Case3 = () => {
  const a = useAgree();
  return (
    <Stage>
      <S3 $on={a.all}>
        <div className="body">
          <h1>약관에 동의해주세요</h1>
          <div className="all" onClick={a.toggleAll}>
            <Sq $on={a.all} $r="0" style={{ borderColor: a.all ? "#fff" : "#C9C9CC", background: a.all ? "#fff" : "#fff" }}>{a.all && <CheckSvg color={INK} />}</Sq>
            <div><b>모두 동의합니다</b><small>필수 3개와 선택 1개를 한 번에 켭니다</small></div>
          </div>
          <div className="list">
            {ITEMS.map((it) => (
              <div className="row" key={it.key}>
                <div className="lab" onClick={() => a.toggle(it.key)}><SqCheck on={!!a.c[it.key]} r="0" /><span><Req $c={it.required ? INK : "#71717a"}>{it.required ? "필수 " : "선택 "}</Req>{it.label}</span></div>
                {it.view && <View>전문 보기</View>}
              </div>
            ))}
          </div>
        </div>
        <div className="foot"><Btn disabled={!a.can}>동의하고 계속하기</Btn></div>
      </S3>
    </Stage>
  );
};

/* ═══════════════════════════════════════════════════════════
   4. 글씨 큰 판 — 가운데 정렬 없이 왼쪽 정렬, 행 높이 넉넉하게 (어르신 사용자 기준)
   ═══════════════════════════════════════════════════════════ */
const S4 = styled.div`
  position: absolute; inset: 0; display: flex; flex-direction: column;
  .body { flex: 1; padding: 52px 22px 0; }
  h1 { margin: 0 0 10px; font-size: 28px; font-weight: 800; line-height: 1.3; }
  p.lead { margin: 0 0 24px; font-size: 17px; line-height: 1.6; color: #2b2f36; }
  .all { display: flex; align-items: center; gap: 14px; padding: 20px 0; border-bottom: 2px solid ${INK}; font-size: 20px; font-weight: 800; cursor: pointer; }
  .row { display: flex; align-items: center; gap: 14px; padding: 19px 0; border-bottom: 1px solid #E3E3E3; }
  .lab { flex: 1; display: flex; align-items: center; gap: 14px; font-size: 18px; cursor: pointer; line-height: 1.3; }
  .lab small { display: block; font-size: 14px; color: #2b2f36; font-weight: 500; margin-top: 2px; }
  .foot { padding: 12px 22px 28px; }
`;
const BigSq = styled(Sq)` width: 30px; height: 30px; `;
const Case4 = () => {
  const a = useAgree();
  const sub = { use: "서비스를 이용하는 기본 규칙", privacy: "내 정보를 어떻게 다루는지", gps: "일감 거리를 계산하기 위해 위치를 씁니다", marketing: "새 일감·혜택 소식을 받습니다" };
  return (
    <Stage>
      <S4>
        <div className="body">
          <h1>약관에 동의해주세요</h1>
          <p className="lead">필수 항목에 동의해야 시작할 수 있습니다.</p>
          <div className="all" onClick={a.toggleAll}><BigSq $on={a.all} $r="0">{a.all && <CheckSvg size={18} />}</BigSq>모두 동의합니다</div>
          {ITEMS.map((it) => (
            <div className="row" key={it.key}>
              <div className="lab" onClick={() => a.toggle(it.key)}><BigSq $on={!!a.c[it.key]} $r="0">{a.c[it.key] && <CheckSvg size={18} />}</BigSq>
                <span><Req $c={it.required ? INK : "#71717a"}>{it.required ? "(필수) " : "(선택) "}</Req>{it.label}<small>{sub[it.key]}</small></span></div>
              {it.view && <View $c="#A3A3A3"><RiArrowRightSLine size={24} /></View>}
            </div>
          ))}
        </div>
        <div className="foot"><Btn style={{ height: 58, fontSize: 18 }} disabled={!a.can}>동의하고 계속하기</Btn></div>
      </S4>
    </Stage>
  );
};

/* ═══════════════════════════════════════════════════════════
   5. 항목 카드 선택형 — 각 약관이 누르는 카드. 고르면 먹색 테두리
   ═══════════════════════════════════════════════════════════ */
const S5 = styled.div`
  position: absolute; inset: 0; display: flex; flex-direction: column;
  .body { flex: 1; padding: 52px 22px 0; }
  h1 { margin: 0 0 8px; font-size: 26px; font-weight: 800; }
  p.lead { margin: 0 0 22px; font-size: 16px; line-height: 1.6; color: #2b2f36; }
  .allbtn { width: 100%; height: 50px; margin-bottom: 14px; border: 1px solid ${INK}; background: #fff; color: ${INK};
    font-size: 16px; font-weight: 700; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .allbtn.on { background: ${INK}; color: #fff; }
  .item { display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 60px; margin-bottom: 8px; cursor: pointer;
    border: 1px solid #DADADA; background: #fff; }
  .item.on { border: 1.5px solid ${INK}; background: #F1F4F8; }
  .item .t { flex: 1; font-size: 16px; font-weight: 600; }
  .item .t b { font-weight: 700; color: #71717a; margin-right: 4px; }
  .foot { padding: 12px 22px 28px; }
`;
const Case5 = () => {
  const a = useAgree();
  return (
    <Stage>
      <S5>
        <div className="body">
          <h1>약관에 동의해주세요</h1>
          <p className="lead">항목을 눌러 하나씩 확인하거나, 한 번에 동의할 수 있습니다.</p>
          <button className={"allbtn" + (a.all ? " on" : "")} onClick={a.toggleAll}>{a.all ? <CheckSvg /> : null}{a.all ? "모두 동의했습니다" : "모두 동의하기"}</button>
          {ITEMS.map((it) => (
            <div className={"item" + (a.c[it.key] ? " on" : "")} key={it.key} onClick={() => a.toggle(it.key)}>
              <SqCheck on={!!a.c[it.key]} r="0" />
              <div className="t"><b>{it.required ? "필수" : "선택"}</b>{it.label}</div>
              {it.view && <View onClick={(e) => e.stopPropagation()}>보기 <RiArrowRightSLine size={16} /></View>}
            </div>
          ))}
        </div>
        <div className="foot"><Btn disabled={!a.can}>동의하고 계속하기</Btn></div>
      </S5>
    </Stage>
  );
};

/* ═══════════════════════════════════════════════════════════
   6. 주황은 버튼 하나에만 — 브랜드색 살리되 나머지는 먹색·각진 정돈
   ═══════════════════════════════════════════════════════════ */
const S6 = styled.div`
  position: absolute; inset: 0; display: flex; flex-direction: column;
  .body { flex: 1; padding: 56px 22px 0; }
  h1 { margin: 0 0 8px; font-size: 26px; font-weight: 800; line-height: 1.3; }
  p.lead { margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #2b2f36; }
  .all { display: flex; align-items: center; gap: 14px; padding: 18px 0; border-bottom: 1px solid ${INK}; font-size: 18px; font-weight: 800; cursor: pointer; }
  .row { display: flex; align-items: center; gap: 14px; padding: 17px 0; border-bottom: 1px solid #EBEBEB; }
  .lab { flex: 1; display: flex; align-items: center; gap: 14px; font-size: 16px; cursor: pointer; }
  .foot { padding: 12px 22px 28px; }
  .foot .note { margin-bottom: 12px; font-size: 14px; line-height: 1.6; color: #2b2f36; }
`;
const Case6 = () => {
  const a = useAgree();
  return (
    <Stage>
      <S6>
        <div className="body">
          <h1>약관에 동의해주세요</h1>
          <p className="lead">가입하기 전에 한 번만 확인합니다.<br />필수 항목에 동의해야 시작할 수 있습니다.</p>
          <div className="all" onClick={a.toggleAll}><SqCheck on={a.all} r="0" />모두 동의합니다</div>
          {ITEMS.map((it) => (
            <div className="row" key={it.key}>
              <div className="lab" onClick={() => a.toggle(it.key)}><SqCheck on={!!a.c[it.key]} r="0" /><span><Req>{it.required ? "(필수) " : "(선택) "}</Req>{it.label}</span></div>
              {it.view && <View>보기 <RiArrowRightSLine size={16} /></View>}
            </div>
          ))}
        </div>
        <div className="foot">
          <div className="note">마케팅 정보 수신은 동의하지 않아도 서비스를 쓸 수 있습니다.</div>
          <Btn $bg={ORANGE} disabled={!a.can}>동의하고 계속하기</Btn>
        </div>
      </S6>
    </Stage>
  );
};

/* ═══════════════════════════════════════════════════════════
   7. 바텀시트형 — 로그인 화면 위로 올라오는 시트. 화면 이동 없이 동의
   ═══════════════════════════════════════════════════════════ */
const S7 = styled.div`
  position: absolute; inset: 0; background: #F7F7F8;
  .behind { padding: 70px 22px; opacity: .55; filter: blur(0); }
  .behind h2 { margin: 0 0 10px; font-size: 26px; font-weight: 800; text-align: center; }
  .behind .fake { height: 54px; border: 1px solid #DADADA; background: #fff; margin-top: 10px; }
  .dim { position: absolute; inset: 0; background: rgba(0,0,0,.45); }
  .sheet { position: absolute; left: 0; right: 0; bottom: 0; background: #fff; padding: 22px 22px 28px; }
  .grip { width: 40px; height: 4px; background: #D6D6D6; margin: -6px auto 18px; }
  h1 { margin: 0 0 6px; font-size: 22px; font-weight: 800; }
  p.lead { margin: 0 0 14px; font-size: 15px; line-height: 1.6; color: #2b2f36; }
  .all { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-top: 1px solid ${INK}; border-bottom: 1px solid ${INK}; font-size: 17px; font-weight: 800; cursor: pointer; }
  .row { display: flex; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 1px solid #EBEBEB; }
  .lab { flex: 1; display: flex; align-items: center; gap: 12px; font-size: 16px; cursor: pointer; }
`;
const Case7 = () => {
  const a = useAgree();
  return (
    <Stage>
      <S7>
        <div className="behind">
          <h2>홍여사</h2>
          <div className="fake" /><div className="fake" /><div className="fake" style={{ background: "#FEE500", border: "none" }} />
        </div>
        <div className="dim" />
        <div className="sheet">
          <div className="grip" />
          <h1>약관에 동의해주세요</h1>
          <p className="lead">동의하면 누르던 로그인이 바로 이어집니다.</p>
          <div className="all" onClick={a.toggleAll}><SqCheck on={a.all} r="0" />모두 동의합니다</div>
          {ITEMS.map((it) => (
            <div className="row" key={it.key}>
              <div className="lab" onClick={() => a.toggle(it.key)}><SqCheck on={!!a.c[it.key]} r="0" /><span><Req>{it.required ? "(필수) " : "(선택) "}</Req>{it.label}</span></div>
              {it.view && <View>보기 <RiArrowRightSLine size={16} /></View>}
            </div>
          ))}
          <Btn style={{ marginTop: 16 }} disabled={!a.can}>동의하고 계속하기</Btn>
        </div>
      </S7>
    </Stage>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const CASES = [
  { no: 0, name: "현재 화면 (기준)", note: "지금 나가는 모양 그대로. 연회색 바탕 + 흰 라운드 카드, 체크·버튼이 주황.", C: Case0 },
  { no: 1, name: "먹색 정돈", note: "배치는 0번 그대로 두고 주황·라운드만 걷어냄. 흰 바탕 + 1px 각진 카드, 체크·버튼 먹색.", C: Case1 },
  { no: 2, name: "카드 없는 목록 + 하단 버튼", note: "카드를 버리고 행으로만. 전체 동의는 위아래 먹색 선, 원형 체크, 버튼은 화면 맨 아래 고정.", C: Case2 },
  { no: 3, name: "전체 동의 띠", note: "'모두 동의'를 눌렀을 때 먹색 띠로 바뀜. 한 번에 끝내는 사람이 많을 때 맞는 배치.", C: Case3 },
  { no: 4, name: "글씨 큰 판", note: "행 높이·체크 30px·글씨 18px. 항목마다 한 줄 설명이 붙어 뭘 동의하는지 보임.", C: Case4 },
  { no: 5, name: "항목 카드 선택형", note: "약관 하나하나가 누르는 카드. 고르면 먹색 테두리+옅은 면. 위에 '모두 동의하기' 버튼.", C: Case5 },
  { no: 6, name: "주황은 버튼에만", note: "2번 배치에 브랜드 주황을 버튼 하나에만 남김. 체크는 먹색. 주황을 아예 버리기 싫을 때.", C: Case6 },
  { no: 7, name: "바텀시트형", note: "별도 화면이 아니라 로그인 화면 위로 시트가 올라옴. 화면 이동이 줄어 흐름이 끊기지 않음.", C: Case7 },
];

export default function AgreeLab() {
  return (
    <Page>
      <H1>약관 동의 화면 시안</H1>
      <Lead>0번이 지금 화면, 1~7번이 시안. 폭 390px 실측. 체크박스는 눌러볼 수 있고, 필수 세 개가 켜지면 버튼이 살아난다. 번호로 골라주면 그대로 넣는다. 섞어도 된다.</Lead>
      <Cases>
        {CASES.map(({ no, name, note, C }) => (
          <Case key={no}>
            <CaseHead><CaseNo>{no}</CaseNo><CaseName>{name}</CaseName></CaseHead>
            <CaseNote>{note}</CaseNote>
            <C />
          </Case>
        ))}
      </Cases>
    </Page>
  );
}

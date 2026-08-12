import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import localforage from "localforage";

import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";
import { WORKNAME } from "../../utility/work";
import { FILTERITMETYPE } from "../../utility/screen";
import { shortRegion } from "../../utility/region";
import { ReadWork } from "../../service/WorkService";
import { readuser } from "../../service/UserService";
import MobileWorkItem from "../../components/MobileWorkItem";
import Empty from "../../components/Empty";
import LottieAnimation from "../../common/LottieAnimation";
import ChatprofileImage from "../../components/ChatprofileImage";

import { IoSearch, IoCloseCircle } from "react-icons/io5";
import { PiMapPinBold, PiBriefcaseBold, PiCoinsBold } from "react-icons/pi";

/**
 * 검색 (형 리뷰 2026-08-12 "seekone 검색 페이지 참조 · 지역 / 일감 / 견적가 / 사용자 로 구분").
 *
 * seekone 과 같은 뼈대다.
 *   · 입력이 비어 있으면  — 최근 검색어
 *   · 입력 중이면        — 네 갈래(지역/일감/견적가/사용자)로 나눠 후보를 보여준다
 *   · 후보를 고르면      — 그 조건으로 걸러낸 일감 목록
 *
 * 예전 화면은 검색어를 넣으면 AI 가 글을 써주는 것이었는데, 형이 원한 "찾기"가 아니라 뺐다.
 */

const RECENT_KEY = "hong.search.recent";

const Container = styled.div`
  padding: 56px 0 40px;
  background: var(--surface);
  min-height: 100vh;
  box-sizing: border-box;
`;

const SearchBarWrap = styled.div`
  position: sticky;
  top: 50px;
  z-index: 6;
  background: var(--surface);
  padding: 12px 16px 10px;
  border-bottom: 1px solid var(--border-soft);
`;
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 0 14px;
  border-radius: 12px;
  background: var(--bg-soft);
`;
const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  outline: none;
  font-size: 16px;
  font-family: inherit;
  color: var(--text);
  &::placeholder { color: #A9A9A9; }
`;

const Section = styled.div`
  padding: 18px 16px 4px;
`;
const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
`;
const SectionNone = styled.div`
  padding: 16px 0 4px;
  font-size: 15px;
  color: #A3A3A3;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-soft);
  &:active { background: var(--bg-soft); }
`;
const RowMain = styled.div`
  min-width: 0;
  flex: 1;
`;
const RowTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const RowSub = styled.div`
  font-size: 13px;
  color: #999;
  margin-top: 3px;
`;
const RowCount = styled.div`
  flex-shrink: 0;
  font-size: 14px;
  color: #FF4E19;
  font-weight: 700;
`;

const ChipWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 0 4px;
`;
const Chip = styled.div`
  padding: 9px 14px;
  border-radius: 100px;
  border: 1px solid #E6E6E6;
  background: var(--surface);
  font-size: 15px;
  color: var(--text);
  cursor: pointer;
  &:active { background: #F5F5F5; }
`;
const RecentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  &:active { background: var(--bg-soft); }
`;
const ClearAll = styled.div`
  font-size: 14px;
  color: #999;
  cursor: pointer;
`;

const ResultHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px;
`;
const ResultTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  b { color: #FF4E19; }
`;
const BackToSuggest = styled.div`
  font-size: 14px;
  color: #666;
  cursor: pointer;
  text-decoration: underline;
`;
const ResultList = styled.div`
  padding: 0 16px 24px;
  background: var(--surface);
`;

const LoadingAnimationStyle = {
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "40%",
};

/** 매칭된 글자만 색을 준다 */
const Hi = ({ text, q }) => {
  const s = String(text || "");
  const i = q ? s.indexOf(q) : -1;
  if (i < 0) return <>{s}</>;
  return (
    <>
      {s.slice(0, i)}
      <span style={{ color: "#FF4E19" }}>{s.slice(i, i + q.length)}</span>
      {s.slice(i + q.length)}
    </>
  );
};

const infoOf = (work, type) => {
  const list = work.WORK_INFO || [];
  const i = list.findIndex((x) => x && x.requesttype === type);
  return i === -1 ? null : list[i];
};
const priceOf = (work) => {
  const raw = infoOf(work, "금액")?.result;
  const num = Number(String(raw ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(num) ? num : null;
};
const regionOf = (work) => shortRegion(infoOf(work, "지역")?.result);

/** "5만" "5만원" "50000" 을 모두 원 단위 숫자로 */
const parseMoney = (kw) => {
  const m = String(kw).replace(/\s/g, "");
  const man = m.match(/^([0-9]+(?:\.[0-9]+)?)만/);
  if (man) return Math.round(parseFloat(man[1]) * 10000);
  const plain = m.match(/^([0-9]{3,})/);
  if (plain) return parseInt(plain[1], 10);
  return null;
};

const MobileSearchcontainer = ({ search }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const inputRef = useRef(null);

  const [kw, setKw] = useState(search || "");
  const [works, setWorks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  /* 고른 조건. {kind:'region'|'work'|'price'|'user', value, label} */
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [w, u, r] = await Promise.all([
        ReadWork({ latitude: user.latitude, longitude: user.longitude }),
        readuser(),
        localforage.getItem(RECENT_KEY),
      ]);
      if (!alive) return;
      const list = (w === -1 ? [] : w || []).map((d) => ({ ...d, TYPE: FILTERITMETYPE.HONG }));
      setWorks(list);
      setUsers(u === -1 ? [] : u || []);
      setRecent(Array.isArray(r) ? r : []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const saveRecent = (term) => {
    const t = (term || "").trim();
    if (!t) return;
    const next = [t, ...recent.filter((x) => x !== t)].slice(0, 10);
    setRecent(next);
    localforage.setItem(RECENT_KEY, next).catch(() => {});
  };
  const clearRecent = () => {
    setRecent([]);
    localforage.removeItem(RECENT_KEY).catch(() => {});
  };

  const q = kw.trim();

  /* ── 지역 ── 등록된 일감의 지역을 모아 중복 없이 */
  const regionHits = useMemo(() => {
    if (!q) return [];
    const bucket = new Map();
    works.forEach((w) => {
      const r = regionOf(w);
      if (!r || !r.includes(q)) return;
      bucket.set(r, (bucket.get(r) || 0) + 1);
    });
    return [...bucket.entries()].map(([label, count]) => ({ label, count })).slice(0, 8);
  }, [q, works]);

  /* ── 일감 ── 서비스 종류 이름 */
  const workHits = useMemo(() => {
    if (!q) return [];
    return Object.values(WORKNAME)
      .filter((n) => n && n !== WORKNAME.ALLWORK && n.includes(q))
      .map((name) => ({ name, count: works.filter((w) => w.WORKTYPE === name).length }))
      .slice(0, 8);
  }, [q, works]);

  /* ── 견적가 ── 숫자를 넣으면 그 금액 언저리(±30%)를 찾아준다 */
  const priceHit = useMemo(() => {
    if (!q) return null;
    const won = parseMoney(q);
    if (!won) return null;
    const lo = Math.round(won * 0.7);
    const hi = Math.round(won * 1.3);
    const count = works.filter((w) => {
      const p = priceOf(w);
      return p != null && p >= lo && p <= hi;
    }).length;
    return { won, lo, hi, count };
  }, [q, works]);

  /* ── 사용자 ── 대화명으로 */
  const userHits = useMemo(() => {
    if (!q) return [];
    return users
      .filter((u) => String(u?.USERINFO?.nickname || u?.nickname || "").includes(q))
      .map((u) => {
        const id = u.USERS_ID || u?.USERINFO?.users_id;
        return {
          id,
          nickname: u?.USERINFO?.nickname || u?.nickname || "이름 없음",
          userimg: u?.USERINFO?.userimg || u?.USERIMG || u?.userimg || "",
          count: works.filter((w) => w.USERS_ID === id).length,
        };
      })
      .slice(0, 8);
  }, [q, users, works]);

  /* 고른 조건으로 걸러낸 일감 */
  const results = useMemo(() => {
    if (!picked) return [];
    if (picked.kind === "region") return works.filter((w) => regionOf(w) === picked.value);
    if (picked.kind === "work") return works.filter((w) => w.WORKTYPE === picked.value);
    if (picked.kind === "user") return works.filter((w) => w.USERS_ID === picked.value);
    if (picked.kind === "price") {
      return works.filter((w) => {
        const p = priceOf(w);
        return p != null && p >= picked.value.lo && p <= picked.value.hi;
      });
    }
    return [];
  }, [picked, works]);

  const pick = (next, term) => {
    saveRecent(term || q);
    setPicked(next);
    window.scrollTo(0, 0);
  };

  const _handleSelectWork = (work) => {
    navigate("/Mobilework", { state: { WORK_ID: work.WORK_ID, TYPE: FILTERITMETYPE.HONG, WORKTYPE: work.WORKTYPE } });
  };

  if (loading) {
    return (
      <Container>
        <LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge} width={"100px"} height={"100px"} />
      </Container>
    );
  }

  return (
    <Container>
      <SearchBarWrap>
        <SearchBar>
          <IoSearch size={20} color="#9A9A9A" />
          <SearchInput
            ref={inputRef}
            value={kw}
            onChange={(e) => { setKw(e.target.value); setPicked(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.target.blur(); saveRecent(q); } }}
            enterKeyHint="search"
            placeholder="지역 · 일감 · 견적가 · 사용자로 찾기"
          />
          {kw !== "" && (
            <IoCloseCircle size={20} color="#C9C9C9" onClick={() => { setKw(""); setPicked(null); }} style={{ cursor: "pointer", flexShrink: 0 }} />
          )}
        </SearchBar>
      </SearchBarWrap>

      {picked ? (
        <>
          <ResultHead>
            <ResultTitle><b>{picked.label}</b> 일감 {results.length}건</ResultTitle>
            <BackToSuggest onClick={() => setPicked(null)}>다시 찾기</BackToSuggest>
          </ResultHead>
          {results.length === 0 ? (
            <Empty content={"조건에 맞는 일감이 없습니다"} height={150} />
          ) : (
            <ResultList>
              {results.map((w, i) => (
                <MobileWorkItem key={w.WORK_ID || i} index={i} width={"100%"} workdata={w} onPress={() => _handleSelectWork(w)} />
              ))}
            </ResultList>
          )}
        </>
      ) : q === "" ? (
        <>
          <Section>
            <SectionTitle>최근 검색어{recent.length > 0 && <ClearAll style={{ marginLeft: "auto" }} onClick={clearRecent}>전체 삭제</ClearAll>}</SectionTitle>
          </Section>
          {recent.length === 0 ? (
            <SectionNone style={{ padding: "12px 16px 4px" }}>최근 검색어가 없습니다</SectionNone>
          ) : (
            recent.map((t) => (
              <RecentRow key={t} onClick={() => setKw(t)}>
                <RowTitle style={{ fontWeight: 500 }}>{t}</RowTitle>
                <IoCloseCircle size={18} color="#D5D5D5" onClick={(e) => {
                  e.stopPropagation();
                  const next = recent.filter((x) => x !== t);
                  setRecent(next);
                  localforage.setItem(RECENT_KEY, next).catch(() => {});
                }} />
              </RecentRow>
            ))
          )}

        </>
      ) : (
        <>
          <Section><SectionTitle>지역</SectionTitle></Section>
          {regionHits.length === 0 ? <SectionNone style={{ padding: "8px 16px 12px" }}>맞는 지역이 없습니다</SectionNone> : regionHits.map((r) => (
            <Row key={r.label} onClick={() => pick({ kind: "region", value: r.label, label: r.label }, r.label)}>
              <PiMapPinBold size={20} color="#B0B0B0" />
              <RowMain><RowTitle><Hi text={r.label} q={q} /></RowTitle></RowMain>
              <RowCount>{r.count}건</RowCount>
            </Row>
          ))}

          <Section><SectionTitle>일감</SectionTitle></Section>
          {workHits.length === 0 ? <SectionNone style={{ padding: "8px 16px 12px" }}>맞는 일감 종류가 없습니다</SectionNone> : workHits.map((w) => (
            <Row key={w.name} onClick={() => pick({ kind: "work", value: w.name, label: w.name }, w.name)}>
              <PiBriefcaseBold size={20} color="#B0B0B0" />
              <RowMain><RowTitle><Hi text={w.name} q={q} /></RowTitle></RowMain>
              <RowCount>{w.count}건</RowCount>
            </Row>
          ))}

          <Section><SectionTitle>견적가</SectionTitle></Section>
          {!priceHit ? (
            <SectionNone style={{ padding: "8px 16px 12px" }}>맞는 견적가가 없습니다</SectionNone>
          ) : (
            <Row onClick={() => pick({ kind: "price", value: priceHit, label: `${priceHit.won.toLocaleString("ko-KR")}원 근처` }, q)}>
              <PiCoinsBold size={20} color="#B0B0B0" />
              <RowMain>
                <RowTitle>{priceHit.won.toLocaleString("ko-KR")}원 근처</RowTitle>
                <RowSub>{priceHit.lo.toLocaleString("ko-KR")}원 ~ {priceHit.hi.toLocaleString("ko-KR")}원</RowSub>
              </RowMain>
              <RowCount>{priceHit.count}건</RowCount>
            </Row>
          )}

          <Section><SectionTitle>사용자</SectionTitle></Section>
          {userHits.length === 0 ? <SectionNone style={{ padding: "8px 16px 24px" }}>맞는 사용자가 없습니다</SectionNone> : userHits.map((u) => (
            <Row key={u.id} onClick={() => pick({ kind: "user", value: u.id, label: u.nickname }, u.nickname)}>
              {/* 아이콘 대신 그 사람 프로필 사진 (없으면 홍여사 기본 아바타) — 형 리뷰 2026-08-12 */}
              <ChatprofileImage source={u.userimg} size={38} />
              {/* 대화명은 검은 글자 그대로 둔다 (주황 하이라이트 빼기) */}
              <RowMain><RowTitle>{u.nickname}</RowTitle></RowMain>
            </Row>
          ))}
        </>
      )}
    </Container>
  );
};

export default MobileSearchcontainer;

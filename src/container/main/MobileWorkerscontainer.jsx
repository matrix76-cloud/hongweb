import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import { UserContext } from "../../context/User";
import { getNearbyWorkers } from "../../service/WorkerService";
import { ReadWorkByUSERS_ID } from "../../service/WorkService";
import { CreateChat, ReadChat, ReadChatByCHATID, CreateMessage } from "../../service/ChatService";
import { Readuserbyusersid } from "../../service/UserService";
import { WORKSTATUS } from "../../utility/status";
import { CHATCONTENTTYPE } from "../../utility/screen";
import { workOf } from "../../utility/chat";
import { distanceLabel, shortRegion } from "../../utility/region";
import { getSearchRange } from "../../utility/searchRange";
import HongAvatar from "../../components/HongAvatar";
import MobileConfirmPopup from "../../modal/MobileConfirmPopup/MobileConfirmPopup";
import MobileServiceFilter from "../../modal/MobileServiceFilterPopup/MobileServiceFilter";
import MobileDistanceFilter from "../../modal/MobileDistanceFilterPopup/MobileDistanceFilter";
import MobileAgeFilter from "../../modal/MobileAgeFilterPopup/MobileAgeFilter";
import { imageDB } from "../../utility/imageData";

/**
 * 활동 중인 홍여사 — 내 범위 안에서 실제로 일하는 홍여사 목록 (형 지시 2026-08-23)
 *
 * 홈의 [활동 중인 홍여사] 칸을 누르면 여기로 온다. 예전에는 소개 화면으로 갔는데,
 * 숫자를 보고 눌렀으면 그 사람들이 나와야 맞다. 소개는 홈 위 띠배너로 옮겼다.
 *
 * 여기서 일 맡기는 사람이 직접 고른다 — CORE 의 ③ "맡기는 사람이 픽한다" 를
 * 지원을 기다리지 않고 먼저 할 수 있게 한 것이다.
 *   홍여사를 누른다 → 상세 시트 → [이 홍여사에게 일 맡기기]
 *   → 내가 올린 일감 중 하나를 고른다 → 그 일감으로 대화방이 열린다 (지원한 것과 같은 방 구조)
 *   올린 일감이 없으면 일 올리기로 보낸다.
 */
const INK = "#1b1f27";

const Container = styled.div`
  min-height: 100dvh;
  box-sizing: border-box;
  background: var(--surface);
  padding: 55px 0 40px;   /* 위 50px 는 고정 헤더 자리 */
`;

/* ── 필터 — 홈 '내 주변에 올라온 일감'과 같은 칩 (형 리뷰 2026-08-23: 안내 문구 없애고 여기도 필터) ── */
const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 20px 10px;
`;
const FilterBox = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $on }) => ($on ? '#FF4E19' : 'var(--surface)')};
  border: 1px solid ${({ $on }) => ($on ? '#FF4E19' : 'var(--border)')};
  border-radius: 8px;
  height: 38px;
  cursor: pointer;
  flex: ${({ $fixed }) => ($fixed ? '0 0 38px' : '1 1 0')};
  min-width: 0;
  padding: 0 4px;
  color: ${({ $on }) => ($on ? '#fff' : 'var(--text)')};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-tap-highlight-color: transparent;
`;
const AppliedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 20px 10px;
  font-size: 14px;
  color: var(--text);
  b { color: #FF4E19; font-weight: 700; }
`;
const ClearFilters = styled.button`
  border: none;
  background: none;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  text-decoration: underline;
  cursor: pointer;
`;
const CountLabel = styled.div`
  padding: 4px 20px 10px;
  font-size: 17px;
  font-weight: 800;
  color: var(--text);
  b { color: #FF4E19; }
`;

const List = styled.div`
  padding: 0 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Card = styled.div`
  box-sizing: border-box;
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 14px 16px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

const Photo = styled.div`
  flex: none;
  width: 56px;
  height: 56px;
  overflow: hidden;
  background: #F1F4F8;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const NameRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

const Name = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  flex: none;
  font-size: 13px;
  color: var(--text-sub);
`;

const Tags = styled.div`
  margin-top: 4px;
  font-size: 15px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Intro = styled.div`
  margin-top: 4px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--text-sub);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Empty = styled.div`
  padding: 60px 20px;
  text-align: center;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
`;

/* ── 상세 시트 ── */
const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: flex-end;
`;
const Sheet = styled.div`
  width: 100%;
  box-sizing: border-box;
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;
const SheetBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 20px 10px;
`;
const SheetFoot = styled.div`
  flex: none;
  padding: 12px 20px calc(16px + var(--safe-bottom));
  border-top: 1px solid var(--border-soft);
`;
const PrimaryBtn = styled.button`
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 0;
  background: ${INK};
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  &:disabled { opacity: .35; cursor: default; }
`;
const ProfileTop = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
const BigPhoto = styled(Photo)`
  width: 76px;
  height: 76px;
`;
const ProfileName = styled.div`
  font-size: 21px;
  font-weight: 800;
  color: var(--text);
`;
const ProfileSub = styled.div`
  margin-top: 4px;
  font-size: 14px;
  color: var(--text-sub);
`;
const Section = styled.div`
  margin-top: 18px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-line;
  b { display: block; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
`;

/* ── 내 일감 고르기 시트 ── */
const PickTitle = styled.div`
  font-size: 19px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 4px;
`;
const PickLead = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-sub);
  margin-bottom: 12px;
`;
const PickRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 2px;
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;
const PickMain = styled.div`
  flex: 1;
  min-width: 0;
  div { font-size: 16px; font-weight: 700; color: var(--text); }
  small { display: block; margin-top: 2px; font-size: 13px; color: var(--text-sub); }
`;

const findInfo = (work, type) => (work?.WORK_INFO || []).find((x) => x && x.requesttype === type);
const priceOf = (work) => {
  const raw = findInfo(work, '금액')?.result;
  if (raw === undefined || raw === null || raw === '') return '';
  const str = String(raw).trim();
  // "6만원" · "협의" 처럼 숫자만이 아닌 값은 그대로 보여준다 (숫자만 뽑으면 "6원" 이 된다)
  if (/[^\d,.\s원]/.test(str)) return str;
  const num = Number(str.replace(/[^0-9.]/g, ''));
  return Number.isFinite(num) && num !== 0 ? `${num.toLocaleString('ko-KR')}원` : str;
};

const WorkerPhoto = ({ worker, big }) => {
  const [broken, setBroken] = useState(false);
  const src = worker.profileImg || worker.AI_NEWIMAGE_COMPRESSED || '';
  const Box = big ? BigPhoto : Photo;
  if (!src || broken) {
    return <Box><HongAvatar size={big ? 76 : 56} /></Box>;
  }
  return <Box><img src={src} alt="" onError={() => setBroken(true)} /></Box>;
};

const MobileWorkerscontainer = ({ containerStyle }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [picked, setPicked] = useState(null);      // 상세 시트에 띄운 홍여사
  const [myWorks, setMyWorks] = useState(null);    // 일감 고르기 시트 (null = 닫힘)
  const [popup, setPopup] = useState(null);        // 안내 팝업
  const [busy, setBusy] = useState(false);

  const range = getSearchRange();

  /* 필터 — 값은 일감 필터와 같은 문자열 배열. 서비스는 여러 개, 나이대·거리는 하나 */
  const [servicefilter, setServicefilter] = useState([]);
  const [agefilter, setAgefilter] = useState([]);
  const [distancefilter, setDistancefilter] = useState([]);
  const [popupKind, setPopupKind] = useState(null);   // 'service' | 'age' | 'distance'

  const filtered = workers.filter((w) => {
    if (servicefilter.length > 0) {
      const tags = Array.isArray(w.tags) ? w.tags : [];
      if (!servicefilter.some((t) => tags.includes(t))) return false;
    }
    if (agefilter.length > 0) {
      const age = String(w.age || '');
      const want = agefilter[0];
      if (want === '60대 이상' ? !/^(6|7|8|9)\d대/.test(age) : !age.startsWith(want)) return false;
    }
    if (distancefilter.length > 0) {
      const m = String(distancefilter[0]).match(/(\d+)\s*km/);
      const km = m ? parseInt(m[1], 10) : 0;
      if (km > 0 && !(w.distance <= km)) return false;
    }
    return true;
  });
  const filtercount = [servicefilter, agefilter, distancefilter].filter((x) => x.length > 0).length;
  const clearfilters = () => { setServicefilter([]); setAgefilter([]); setDistancefilter([]); };
  const chipLabel = (kind, base, arr) => {
    if (arr.length === 0) return base;
    return arr.length === 1 ? arr[0] : `${base} ${arr.length}`;
  };

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getNearbyWorkers({ latitude: user.latitude, longitude: user.longitude })
      .then((list) => { if (alive) setWorkers(list); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user.latitude, user.longitude]);

  /* [이 홍여사에게 일 맡기기] — 내가 올린 진행중 일감을 읽어 고르게 한다 */
  const _handleOffer = async () => {
    if (!user.users_id) {
      navigate("/Mobilelogin");
      return;
    }
    setBusy(true);
    const works = await ReadWorkByUSERS_ID({ USERS_ID: user.users_id, status: WORKSTATUS.OPEN });
    setBusy(false);
    if (!works.length) {
      setPopup({
        title: "아직 올린 일감이 없어요",
        message: "먼저 일을 올리면 이 홍여사에게 바로 맡길 수 있어요.",
        confirmText: "일 올리기",
        onConfirm: () => { setPopup(null); navigate("/Mobileworkregister"); },
      });
      return;
    }
    setMyWorks(works);
  };

  /* 고른 일감으로 대화방을 연다 — 홍여사가 지원했을 때 생기는 방과 같은 구조라
     결제·일정·수수료 흐름이 그대로 이어진다 */
  const _handlePickWork = async (work) => {
    if (busy || !picked) return;
    setBusy(true);
    try {
      const SUPPORTER = await Readuserbyusersid({ USERS_ID: picked.users_id });
      if (SUPPORTER === -1) {
        setPopup({ title: "지금은 연락할 수 없어요", message: "이 홍여사의 계정 정보를 찾지 못했어요. 다른 홍여사를 골라주세요.", alertonly: true, onConfirm: () => setPopup(null) });
        return;
      }
      const OWNER = await Readuserbyusersid({ USERS_ID: user.users_id });
      if (OWNER === -1) { navigate("/Mobilelogin"); return; }

      // 같은 일감·같은 홍여사 방이 이미 있으면 그 방으로 간다
      let room = null;
      const rooms = await ReadChat({ USERS_ID: user.users_id });
      if (rooms !== -1) {
        room = rooms.find((r) => workOf(r).WORK_ID === work.WORK_ID && r.SUPPORTER_ID === picked.users_id) || null;
      }
      if (!room) {
        const CHAT_ID = await CreateChat({ OWNER, OWNER_ID: OWNER.USERS_ID, SUPPORTER, SUPPORTER_ID: SUPPORTER.USERS_ID, WORK_INFO: work });
        if (CHAT_ID === -1) return;
        // 방이 왜 열렸는지 첫 줄로 남긴다 — 홍여사 쪽에서 "지원한 적 없는데?" 하지 않게
        await CreateMessage({
          CHAT_ID,
          msg: `${work.WORKTYPE} 일을 맡기고 싶어 먼저 연락드렸어요. 가능하시면 답 주세요.`,
          users_id: user.users_id,
          read: [user.users_id],
          CHAT_CONTENT_TYPE: CHATCONTENTTYPE.TEXT,
        });
        room = await ReadChatByCHATID({ CHAT_ID });
        if (room === -1) return;
      }
      const info = SUPPORTER.USERINFO || {};
      setMyWorks(null);
      setPicked(null);
      navigate("/Mobilecontent", {
        state: {
          ITEM: room,
          OWNER: true,
          NAME: info.nickname || picked.chatName || '홍여사',
          LEFTIMAGE: info.userimg || '',
          LEFTNAME: info.nickname || picked.chatName || '홍여사',
        },
      });
    } finally {
      setBusy(false);
    }
  };

  /* 범위가 넓으면 수백 명이 된다 — 가까운 순 100명까지만 그린다 */
  const SHOW_MAX = 100;
  const shown = filtered.slice(0, SHOW_MAX);

  return (
    <Container style={containerStyle}>
      <FilterRow>
        <FilterBox $fixed onClick={clearfilters} $on={false}>
          <img className="mono-icon" src={imageDB.init} style={{ width: 16, height: 16 }} alt="" />
        </FilterBox>
        <FilterBox $on={servicefilter.length > 0} onClick={() => setPopupKind('service')}>{chipLabel('service', '서비스별', servicefilter)}</FilterBox>
        <FilterBox $on={agefilter.length > 0} onClick={() => setPopupKind('age')}>{chipLabel('age', '나이대', agefilter)}</FilterBox>
        <FilterBox $on={distancefilter.length > 0} onClick={() => setPopupKind('distance')}>{chipLabel('distance', '거리순', distancefilter)}</FilterBox>
      </FilterRow>

      {filtercount > 0 && (
        <AppliedRow>
          <span>조건 <b>{filtercount}</b>개 적용중</span>
          <ClearFilters onClick={clearfilters}>모두 해제</ClearFilters>
        </AppliedRow>
      )}

      <CountLabel>
        {loading ? '내 주변 홍여사를 찾고 있어요' : <>홍여사 <b>{filtered.length}명</b>{filtered.length > SHOW_MAX ? ` · 가까운 순 ${SHOW_MAX}명` : ''}</>}
      </CountLabel>

      {!loading && workers.length === 0 && (
        <Empty>아직 이 범위에서 활동 중인 홍여사가 없어요.{"\n"}내 정보 &gt; 나의 범위설정에서 범위를 넓혀보세요.</Empty>
      )}
      {!loading && workers.length > 0 && filtered.length === 0 && (
        <Empty>조건에 맞는 홍여사가 없어요.{"\n"}조건을 줄여보세요.</Empty>
      )}

      <List>
        {shown.map((w) => (
          <Card key={w.id} onClick={() => setPicked(w)}>
            <WorkerPhoto worker={w} />
            <Body>
              <NameRow>
                <Name>{w.chatName || '홍여사'}{w.age ? ` · ${w.age}` : ''}</Name>
                <Meta>{distanceLabel(w.distance) || ''}{w.address ? ` · ${shortRegion(w.address)}` : ''}</Meta>
              </NameRow>
              {Array.isArray(w.tags) && w.tags.length > 0 && <Tags>{w.tags.join(' · ')}</Tags>}
              {w.selfIntro && <Intro>{w.selfIntro}</Intro>}
            </Body>
          </Card>
        ))}
      </List>

      {picked && createPortal(
        <Dim onClick={() => setPicked(null)}>
          <Sheet onClick={(e) => e.stopPropagation()}>
            <SheetBody>
              <ProfileTop>
                <WorkerPhoto worker={picked} big />
                <div>
                  <ProfileName>{picked.chatName || '홍여사'}</ProfileName>
                  <ProfileSub>
                    {[picked.age, distanceLabel(picked.distance), shortRegion(picked.address)].filter(Boolean).join(' · ')}
                  </ProfileSub>
                </div>
              </ProfileTop>
              {Array.isArray(picked.tags) && picked.tags.length > 0 && <Section><b>할 수 있는 일</b>{picked.tags.join(' · ')}</Section>}
              {picked.availableTime && <Section><b>가능한 시간</b>{picked.availableTime}</Section>}
              {picked.rewardInfo && <Section><b>희망 보수</b>{picked.rewardInfo}</Section>}
              {picked.selfIntro && <Section><b>소개</b>{picked.selfIntro}</Section>}
              {picked.career && <Section><b>경력</b>{picked.career}</Section>}
            </SheetBody>
            <SheetFoot>
              <PrimaryBtn disabled={busy} onClick={_handleOffer}>이 홍여사에게 일 맡기기</PrimaryBtn>
            </SheetFoot>
          </Sheet>
        </Dim>,
        document.body
      )}

      {myWorks && createPortal(
        <Dim onClick={() => setMyWorks(null)}>
          <Sheet onClick={(e) => e.stopPropagation()}>
            <SheetBody>
              <PickTitle>어떤 일을 맡길까요?</PickTitle>
              <PickLead>내가 올린 일감 중에서 고르면 {picked?.chatName || '홍여사'}님과 그 일로 대화방이 열려요.</PickLead>
              {myWorks.map((w) => (
                <PickRow key={w.WORK_ID} onClick={() => _handlePickWork(w)}>
                  <PickMain>
                    <div>{w.WORKTYPE}</div>
                    <small>{[priceOf(w), shortRegion(findInfo(w, '지역')?.result)].filter(Boolean).join(' · ')}</small>
                  </PickMain>
                  <RiArrowRightSLine size={22} color="#A3A3A3" />
                </PickRow>
              ))}
            </SheetBody>
          </Sheet>
        </Dim>,
        document.body
      )}

      {popupKind === 'service' && <MobileServiceFilter filterhistory={servicefilter} callback={(arr) => { setServicefilter(arr); setPopupKind(null); }} />}
      {popupKind === 'age' && <MobileAgeFilter filterhistory={agefilter} callback={(arr) => { setAgefilter(arr); setPopupKind(null); }} />}
      {popupKind === 'distance' && <MobileDistanceFilter filterhistory={distancefilter} callback={(arr) => { setDistancefilter(arr); setPopupKind(null); }} />}

      {popup && (
        <MobileConfirmPopup
          title={popup.title}
          message={popup.message}
          confirmText={popup.confirmText}
          alertonly={!!popup.alertonly}
          onConfirm={popup.onConfirm}
          onCancel={() => setPopup(null)}
        />
      )}
    </Container>
  );
};

export default MobileWorkerscontainer;

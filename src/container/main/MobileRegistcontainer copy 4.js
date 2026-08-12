// 📄 MobileRegistcontainer.jsx — 단기알바 등록(메모+주소 한 화면) + 진행 오버레이 + 결과 팝업
// - 날짜/옵션 스텝 제거
// - 등록: 진행 오버레이(저장→TTS→이미지) → 완료 팝업

import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import { UserContext } from "../../context/User";
import { DataContext } from "../../context/Data";
import { BetweenRow, Row } from "../../common/Row";

import { imageDB } from "../../utility/imageData";
import { getFontSize } from "../../utility/fontsize";
import { COLORS } from "../../utility/colors";

import { CreateWork } from "../../service/WorkService";
import MobileWorkMapPopup from "../../modal/MobileWorkMapPopup/MobileWorkMapPopup";
import MobileCompletePopup from "../../modal/MobileCompletePopup/MobileCompletePopup";
import HongButton from "../../components/HongButton";
import VoiceDictateButton from "../../common/VoiceDictateButton";
import { Toaster, toast } from "sonner";

// 🔗 Firestore
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../api/config";

// ────────────────── Layout
const HEADER_HEIGHT = 48;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #fff;
  padding: 16px;
`;

const HeaderWrapper = styled.div`
  position: fixed; top: env(safe-area-inset-top, 0px); left: 0; right: 0; z-index: 999;
  background: #fff; padding: 8px 6px 0;
`;

const HeaderLayer = styled.div`
  display: flex; flex-direction: column; align-items: flex-start; width: 100%;
`;

const TitleText = styled.div`
  padding-left: 10px;
  font-size: ${() => getFontSize(20)}px !important;
  font-family: Pretendard-SemiBold;
  color: #1a1e28;
`;

const Title = styled.div`
  font-size: ${() => getFontSize(19)}px !important;
  color: #111;
  margin: 8px 0 10px;
  font-family: 'Pretendard-Bold', sans-serif !important;
  line-height: 1.5;
`;

const TextAreaWrap = styled.div`
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%; height: 320px;
  padding: 12px 56px 12px 12px; /* 우측 마이크 공간 */
  border-radius: 12px; border: 1px solid #E5E7EB;
  font-size: ${() => getFontSize(15)}px !important;
  resize: none; line-height: 1.6;
  font-family: "Pretendard-Regular", sans-serif;
  ::placeholder { color: #9CA3AF; }
`;

const MicFloat = styled.div`
  position: absolute; top: 12px; right: 12px; display: grid; place-items: center;
`;

const Counter = styled.div`
  text-align: right; font-size: 12px; color: ${({ over }) => (over ? "#EF4444" : "#6B7280")};
  margin-top: 6px;
`;

const AddressRow = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 12px 0;
  border-bottom: 1px dashed #eee;
`;

const AddressText = styled.div`
  font-size: 14px; font-weight: 500; color: #374151; flex: 1; 
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
`;

const LinkBtn = styled.button`
  background: transparent; border: 0; color: ${COLORS.primary}; font-size: 13px;
  cursor: pointer; padding: 6px 8px; margin-right: 4px;
`;

const StickyFooter = styled.div`
  position: sticky; bottom: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 30%);
  padding: 12px 6px calc(12px + env(safe-area-inset-bottom, 0px));
  margin-top: 12px;
`;

// ────────────────── Progress Overlay
const dimShow = keyframes`from {opacity:0} to {opacity:1}`;
const OverlayDim = styled.div`
  position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,.45);
  animation: ${dimShow} .18s ease both;
  display: ${({ open }) => (open ? "flex" : "none")};
  justify-content: center; align-items: center; padding: 16px;
`;
const OverlayCard = styled.div`
  width: 92%; max-width: 520px; background: #fff; border-radius: 16px; padding: 20px 18px;
  box-shadow: 0 10px 24px rgba(0,0,0,.2);
`;
const StepRow = styled.div`
  display: grid; grid-template-columns: 36px 1fr auto; gap: 12px; align-items: center;
  padding: 10px 6px; border-radius: 10px; background: ${({ active }) => active ? "#F8F5FF" : "transparent"};
`;
const StarBadge = styled.div`
  width: 28px; height: 28px; border-radius: 999px; background: #fff; display: grid; place-items: center;
  box-shadow: 0 0 0 2px #7C3AED; color: #7C3AED; font-weight: 900; font-size: 12px;
`;
const ProgressBarWrap = styled.div`width:100%; height:10px; background:#EEE; border-radius:999px; overflow:hidden; margin-top:8px;`;
const ProgressBar = styled.div`height:100%; background:linear-gradient(90deg,#7C3AED,#A78BFA); width:${({ pct }) => pct}%; transition:width .4s ease;`;




// ── Preview UI (AI 이미지 + TTS)
const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 12px;
  margin: 12px 0 8px;
  align-items: center;
`;

const ImgBox = styled.div`
  width: 112px; height: 112px;
  border: 1px solid #EEE; border-radius: 12px; overflow: hidden;
  background: #FAFAFA; position: relative; display: grid; place-items: center;
`;

const ImgThumb = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`;

const ImgBadge = styled.div`
  position: absolute; left: 8px; bottom: 8px;
  font-size: 11px; padding: 4px 8px; border-radius: 999px;
  background: #F3E8FF; color: ${COLORS.primary};
  border: 1px solid rgba(124,58,237,.25);
`;

const TTSCol = styled.div`
  display: flex; flex-direction: column; gap: 8px;
`;

const TTSTitle = styled.div`
  font-weight: 700; font-size: 14px; color: #111;
`;

const TTSNote = styled.div`
  font-size: 12px; color: #6B7280;
`;



function ProgressOverlay({ open, progress, onBackground }) {
  const { save = "done", tts = "pending", image = "pending", status = "running", pct = 10 } = progress || {};
  const done = (x) => x === "done"; const err = (x) => x === "error";
  const StepIcon = ({ state }) => (<StarBadge>{state === "done" ? "✔" : state === "error" ? "!" : "★"}</StarBadge>);
  return (
    <OverlayDim open={open}>
      <OverlayCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: getFontSize(18), fontWeight: 700 }}>등록 처리 중이에요</div>
          <button onClick={onBackground} style={{ background: "transparent", border: 0, color: "#6B7280", fontSize: 13, cursor: "pointer" }}>뒤로 가도 계속 처리돼요</button>
        </div>
        <div style={{ marginTop: 12 }}>
          <StepRow active={true}>
            <StepIcon state={save} />
            <div>
              <div style={{ fontWeight: 700, fontSize: getFontSize(15) }}>요청 저장</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{done(save) ? "저장 완료" : err(save) ? "저장 실패" : "요청을 저장하고 있어요"}</div>
            </div>
            <div style={{ fontSize: 12, color: done(save) ? "#10B981" : err(save) ? "#EF4444" : "#6B7280" }}>{save}</div>
          </StepRow>
          <StepRow active={!done(image)}>
            <StepIcon state={tts} />
            <div>
              <div style={{ fontWeight: 700, fontSize: getFontSize(15) }}>요약 음성 만들고 있어요</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{done(tts) ? "생성 완료" : err(tts) ? "생성 실패" : "AI가 8초 내외 안내 음성을 만들고 있어요"}</div>
            </div>
            <div style={{ fontSize: 12, color: done(tts) ? "#10B981" : err(tts) ? "#EF4444" : "#6B7280" }}>{tts}</div>
          </StepRow>
          <StepRow active={status !== "done"}>
            <StepIcon state={image} />
            <div>
              <div style={{ fontWeight: 700, fontSize: getFontSize(15) }}>대표 이미지 준비 중</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{done(image) ? "생성 완료" : err(image) ? "생성 실패" : "카테고리/메모를 바탕으로 이미지를 준비 중"}</div>
            </div>
            <div style={{ fontSize: 12, color: done(image) ? "#10B981" : err(image) ? "#EF4444" : "#6B7280" }}>{image}</div>
          </StepRow>
        </div>
        <ProgressBarWrap><ProgressBar pct={pct || 10} /></ProgressBarWrap>
      </OverlayCard>
    </OverlayDim>
  );
}

// ────────────────── Result Sheet
const SheetDim = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 2100;
  display: ${({ open }) => open ? "block" : "none"};
`;
const SheetWrap = styled.div`
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 2200; background: #fff;
  border-radius: 16px 16px 0 0; padding: 16px; box-shadow: 0 -10px 24px rgba(0,0,0,.2);
  transform: translateY(${({ open }) => open ? "0%" : "100%"}); transition: transform .2s ease;
`;
function ResultSheet({ open, docData, onClose, onShare, onMap }) {
  const img = docData?.imageUrl || imageDB.hirecharacter;
  const tts = docData?.ttsUrl;
  const summary = docData?.summaryText || "요청 요약이 준비되었습니다.";
  const info = docData?.WORK_INFO || [];
  const getVal = (k) => info.find((x) => x?.requesttype === k)?.value || "";
  const region = getVal("지역");
  const memo = getVal("요청메모");
  return (
    <>
      <SheetDim open={open} onClick={onClose} />
      <SheetWrap open={open}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: getFontSize(18) }}>등록이 완료됐어요</div>
          <button onClick={onClose} style={{ background: "transparent", border: 0, fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 12, marginTop: 12 }}>
          <img src={img} alt="thumb" style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 12, border: "1px solid #eee" }} />
          <div>
            <div style={{ fontSize: getFontSize(15), fontWeight: 700, marginBottom: 6 }}>{summary}</div>
            {tts ? <audio controls src={tts} style={{ width: "100%" }} /> : <div style={{ fontSize: 12, color: "#6B7280" }}>음성 생성에 잠시 문제가 있어 텍스트로 안내드려요.</div>}
          </div>
        </div>
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: "#6B7280" }}>카테고리 / 지역 / 메모</div>
          <div style={{ marginTop: 6, display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 600 }}>지역</div>
            <div style={{ fontSize: 14 }}>{region}</div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>요청 메모</div>
            <div style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{memo}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
          <HongButton variant="secondary" onClick={onMap}>지도로 보기</HongButton>
          <HongButton variant="secondary" onClick={onShare}>공유하기</HongButton>
        </div>
        <HongButton style={{ marginTop: 10 }} variant="primary" onClick={onClose}>닫기</HongButton>
      </SheetWrap>
    </>
  );
}

// ────────────────── Component
const { kakao } = window;

const MobileRegistcontainer = ({ containerStyle, type }) => {
  const { user } = useContext(UserContext);
  const { data } = useContext(DataContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [comment, setComment] = useState("");
  const [addrpopup, setAddrpopup] = useState(false);
  const [address, setAddress] = useState("");
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressState, setProgressState] = useState({ status: "idle", save: "done", tts: "pending", image: "pending", pct: 10 });
  const [resultOpen, setResultOpen] = useState(false);
  const [resultDoc, setResultDoc] = useState(null);
  const [currentWorkId, setCurrentWorkId] = useState(null);
  const unsubRef = useRef(null);

  const commentRef = useRef(null);
  const MAX_LEN = 300;

  // 커서 위치에 텍스트 삽입
  const insertAtCursor = (text, { addSpace = true } = {}) => {
    const ta = commentRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? comment.length;
    const end = ta.selectionEnd ?? comment.length;
    const before = comment.slice(0, start);
    const after = comment.slice(end);
    const spacer = before && !/\s$/.test(before) && addSpace ? " " : "";
    const nextRaw = before + spacer + text + after;
    const next = nextRaw.slice(0, MAX_LEN);
    setComment(next);
    const caret = Math.min((before + spacer + text).length, next.length);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(caret, caret); });
  };
  const onPartialSpeak = (t) => insertAtCursor(t, { addSpace: false });
  const onFinalSpeak = (t) => insertAtCursor(t.trim(), { addSpace: true });

  // messages 초기화 + 기본 주소를 지역 응답에 넣어둠
  const _handleReset = () => {
    const base = [
      { type: "requestregion", show: true, selected: true },
      { type: "response", requesttype: "지역", show: true, result: user?.USERINFO?.address_name || "", latitude: null, longitude: null },
      { type: "requestcomment", show: true, selected: false },
      { type: "response", requesttype: "요청메모", show: false, result: "" },
      { type: "requestcomplete", show: false, selected: false, info: "작성하신 내용을 확인해 주세요" },
    ];
    setMessages(base);
    setComment("");
    setAddress(user?.USERINFO?.address_name || "");
  };

  useEffect(() => { _handleReset(); /* eslint-disable-line */ }, []);

  // 새 주소 선택
  const workmapPopupcallback = (addr) => {
    setAddrpopup(false);
    if (!addr) return;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(addr, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        const latitude = coords.getLat();
        const longitude = coords.getLng();
        setMessages((prev) => {
          const next = [...prev];
          const idxRes = next.findIndex((m) => m.type === "response" && m.requesttype === "지역");
          if (idxRes !== -1) {
            next[idxRes] = { ...next[idxRes], show: true, result: addr, latitude, longitude };
          }
          return next;
        });
        setAddress(addr);
      }
    });
  };

  // 기본 주소를 좌표와 함께 세팅(Promise)
  const geocodeAddr = (addr) =>
    new Promise((resolve) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(addr, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          resolve({ lat: coords.getLat(), lng: coords.getLng() });
        } else {
          resolve({ lat: null, lng: null });
        }
      });
    });

  // 메모 완료 → 요약 시트
  const _handleComment = () => {
    setMessages((prev) => {
      const next = [...prev];
      const idxRes = next.findIndex((m) => m.type === "response" && m.requesttype === "요청메모");
      const idxComment = next.findIndex((m) => m.type === "requestcomment");
      const idxComplete = next.findIndex((m) => m.type === "requestcomplete");
      if (idxComment !== -1) next[idxComment] = { ...next[idxComment], selected: true };
      if (idxRes !== -1) next[idxRes] = { ...next[idxRes], show: true, result: comment };
      if (idxComplete !== -1) next[idxComplete] = { ...next[idxComplete], show: true, info: `${user?.USERINFO?.nickname || ""}님이 작성하신 요구사항입니다` };
      return next;
    });
  };

  // 등록 실행
  const _handleReqComplete = async () => {
    const region = messages.find((m) => m.type === "response" && m.requesttype === "지역");
    const memo = messages.find((m) => m.type === "response" && m.requesttype === "요청메모");
    if (!address || !(memo?.result || "").trim()) {
      toast.info("주소와 요청 메모를 입력해 주세요.");
      return;
    }

    // 지역 응답 보정(좌표 없으면 지오코딩)
    let regionPayload = { ...region, result: address };
    if (!regionPayload?.latitude || !regionPayload?.longitude) {
      const { lat, lng } = await geocodeAddr(address);
      regionPayload.latitude = lat; regionPayload.longitude = lng;
    }

    try {
      const USERS_ID = user.USERS_ID;
      const workinfo = [regionPayload, memo];
      workinfo.push({ type: "response", requesttype: "희망일", result: "협의", value: "협의" });
      workinfo.push({ type: "response", requesttype: "금액", result: "협의", value: "협의" });

      const USERIMG = user.USERINFO.userimg;
      const WORKTYPE = type;
      const NICKNAME = user.USERINFO.nickname;
      const WORK_STATUS = "OPEN";

      const work = await CreateWork({ USERS_ID, USERIMG, USERIMG, WORKTYPE, WORK_INFO: workinfo, NICKNAME, WORK_STATUS });
      const workId = work?.id || work?.docId;
      if (!workId) { toast.error("등록 실패: 작업 ID가 없습니다"); return; }

      setCurrentWorkId(workId);
      setProgressOpen(true);
      setProgressState({ status: "running", save: "done", tts: "pending", image: "pending", pct: 15 });

      if (unsubRef.current) try { unsubRef.current(); } catch { }
      const ref = doc(db, "WORK", workId);
      unsubRef.current = onSnapshot(ref, (snap) => {
        const d = snap.data() || {};
        const p = d.processing || {};
        const pct = typeof p.progressPct === "number" ? p.progressPct : (() => {
          let v = 15;
          if (p.tts === "done") v = Math.max(v, 60);
          if (p.image === "done") v = Math.max(v, 90);
          if (p.status === "done") v = 100;
          return v;
        })();
        setProgressState({ status: p.status || "running", save: "done", tts: p.tts || "pending", image: p.image || "pending", pct });

        if ((p.status === "done") || d.ttsUrl || d.imageUrl) {
          setProgressOpen(false);
          setResultDoc({ id: snap.id, ...d });
          setResultOpen(true);
          if (unsubRef.current) { try { unsubRef.current(); } catch { } unsubRef.current = null; }
        }
      });
    } catch (e) {
      console.log("❌ 등록 에러:", e);
      toast.error("등록 처리 중 오류가 발생했습니다.");
    }
  };

  // 오버레이 백그라운드 전환
  const handleBackground = () => setProgressOpen(false);

  // 결과 시트 액션
  const handleCloseResult = () => { setResultOpen(false); setResultDoc(null); _handleReset(); };
  const handleShare = async () => {
    try {
      const url = `${window?.location?.origin || ""}/w/${currentWorkId || resultDoc?.id || ""}`;
      await navigator.clipboard.writeText(url);
      toast.success("링크가 복사되었어요");
    } catch { toast.info("복사에 실패했어요"); }
  };
  const handleMap = () => navigate("/MobileResultMap", { state: { source: "WorkRegister", workId: currentWorkId || resultDoc?.id } });

  // 입력/버튼 상태
  const len = comment.length;
  const over = len > MAX_LEN;
  const canSubmitMemo = (len >= 10) && !!address;

  return (
    <>
      <HeaderWrapper>
        <HeaderLayer>
          <BetweenRow style={{ width: "100%", margin: "0 auto", zIndex: 2, paddingLeft: 8 }} onClick={() => navigate(-1)}>
            <div style={{ display: "flex", fontSize: `${getFontSize(18)}px`, color: "#131313", alignItems: "center" }}>
              <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} />
              <TitleText>{type}</TitleText>
            </div>
          </BetweenRow>
        </HeaderLayer>
      </HeaderWrapper>

      <Container style={containerStyle}>
        <Title>알바가 필요한 일에 대해 상세 기입해 주세요</Title>
        <TextAreaWrap>
          <TextArea
            ref={commentRef}
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, MAX_LEN))}
            placeholder="예) 오전 10~12시, 반려견 있음, 주차 가능, 2~3시간 예상, 도구 구비"
          />
          {/* <MicFloat>
            <VoiceDictateButton
              mode="toggle" size={44} color={COLORS.primary}
              onPartial={onPartialSpeak} onFinal={onFinalSpeak}
            />
          </MicFloat> */}
        </TextAreaWrap>
        <Counter over={over}>{len}/{MAX_LEN}</Counter>

        <Title style={{ marginTop: 18 }}>주소 선택</Title>
        <AddressRow>
          <AddressText>{address || "주소를 선택해 주세요"}</AddressText>
          <LinkBtn type="button" onClick={() => setAddrpopup(true)}>지역 변경</LinkBtn>
        </AddressRow>

        {addrpopup && <MobileWorkMapPopup callback={workmapPopupcallback} />}

        <StickyFooter>
          <HongButton
            variant="primary" fullWidth
            disabled={!canSubmitMemo}
            onClick={() => {
              if (!address) return toast.info("주소를 선택해 주세요");
              if (len < 10) return toast.info("짧게라도 상황을 적어주세요");
              _handleComment();
            }}
          >
            다음
          </HongButton>
        </StickyFooter>

        {/* 요약/등록 바텀시트 */}
        {
          (comment != '' && address != '') &&
          <MobileCompletePopup
            callback={() => { }}
            data={{ info: messages.find((m) => m.type === "requestcomplete")?.info }}
            messages={messages}
            requestcallback={_handleReqComplete}
            open={messages.find((m) => m.type === "requestcomplete")?.show === true}
          />
        }

        <Toaster position="bottom-right" richColors />
      </Container>

      {/* 진행 오버레이 */}
      <ProgressOverlay open={progressOpen} progress={progressState} onBackground={handleBackground} />

      {/* 결과 팝업 */}
      <ResultSheet open={resultOpen} docData={resultDoc} onClose={handleCloseResult} onShare={handleShare} onMap={handleMap} />
    </>
  );
};

export default MobileRegistcontainer;

// 📄 MobileWorkerListcontainer.jsx — 탭 2개 구조 (구직자 / 일자리)
import React, { useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { UserContext } from "../../context/User";
import { getFontSize } from "../../utility/fontsize";
import MobileWorkerCard from "../../components/MobileWorkerCard";
import MobileWorkItem from "../../components/MobileWorkItem";
import { imageDB } from "../../utility/imageData";
import IconButton from "../../common/IconButton";
import { getWorkerByUserId } from "../../service/WorkerService";
import { ReadWork } from "../../service/WorkService";
import Spinner from "../../components/DotSpinner";
import { HiOutlinePencilSquare, HiXMark } from "react-icons/hi2";
import { distanceFunc } from "../../utility/region";
import { Seekimage } from "../../utility/imageData";
import TimeAgo from "react-timeago";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const timeFormatter = buildFormatter(koreanStrings);


const BRAND = "rgb(30, 136, 229)";
const BRAND_RGB = "30,136,229";


const HEADER_HEIGHT = 47;
const FOOT_HEIGHT = 65;

// ✅ Android만 미세 보정(필요하면 2~6 사이로 조절)
const isAndroid = /Android/i.test(navigator.userAgent);
const ANDROID_FIX = isAndroid ? 4 : 0;

// ✅ safe-area + 헤더높이 반영
const TOP_OFFSET = `calc(env(safe-area-inset-top, 0px) + ${HEADER_HEIGHT + ANDROID_FIX}px)`;

const Container = styled.div`
  margin-top: ${TOP_OFFSET};
  height: calc(100dvh - (${TOP_OFFSET}) - ${FOOT_HEIGHT}px);
  overflow-y: auto;
  background-color: #fff;
  padding: 0 16px;
`;
const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;
const EmptySubTitle = styled.div`
  margin: 5px 0px;
  font-size: ${() => getFontSize(16)}px !important;
  font-family: Pretendard-SemiBold;
`;

const FilterEx2 = styled.div`
  position: fixed;
  z-index: 2;
  right: 10px;
  display: flex;
  flex-direction: row;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 70px);
  transition: opacity .18s ease, transform .18s ease, box-shadow .18s ease, background .18s ease;
  &:active { transform: scale(.97); }
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? '12px' : '0')}, 0);
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
  will-change: transform, opacity;
`;

const FloatingActionButton = styled.button`
  position: fixed;
  right: 12px;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 135px);
  z-index: 2;

  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: ${() => getFontSize(15)}px !important;
  border: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity .18s ease, transform .18s ease, box-shadow .18s ease, background .18s ease;
  &:active { transform: scale(.97); }
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? '12px' : '0')}, 0);
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
  will-change: transform, opacity;
  transition-timing-function: cubic-bezier(.22,.61,.36,1);

  ${({ $variant }) => {
    switch ($variant) {
      case 'solid':
        return css`background: ${BRAND}; color: #fff; box-shadow: 0 6px 16px rgba(${BRAND_RGB}, .28);`;
      case 'outline':
        return css`background: #fff; color: ${BRAND}; border: 1.5px solid rgba(${BRAND_RGB}, .45); box-shadow: 0 6px 16px rgba(0,0,0,.08);`;
      case 'glass':
        return css`background: rgba(255,255,255,.78); color: ${BRAND}; border: 1px solid rgba(255,255,255,.9); backdrop-filter: blur(10px) saturate(140%); box-shadow: 0 10px 24px rgba(0,0,0,.10);`;
      default:
        return css`background: rgba(${BRAND_RGB}, .12); color: ${BRAND}; border: 1px solid rgba(${BRAND_RGB}, .28); box-shadow: 0 6px 16px rgba(0,0,0,.08);`;
    }
  }}
`;

const FabIcon = styled.img`
  width: 32x;
  height: 32px;
  display: block;
  object-fit: contain;
  pointer-events: none;
`;

const WorkerCountBadge = styled.div`
  opacity: 0;
  animation: fadeInBadge .8s ease-in-out forwards;
  background: rgba(255,255,255,.85);
  color: #222;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,.1);
  margin: 16px auto 8px auto;
  text-align: center;
  width: fit-content;
  @keyframes fadeInBadge { from { transform: translateY(4px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;


const LoadMoreButton = styled.button`
  width: 100%;
  padding: 14px 0;
  margin: 8px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: #fafafa;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(14)}px !important;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;
  &:active {
    background: #f0f0f0;
  }
`;

const BottomSpacer = styled.div`
  height: 110px;
`;

/* ───────── 탭 UI ───────── */
const TabBar = styled.div`
  display: flex;
  margin: 12px 0 0;
  border-radius: 10px;
  background: #f2f2f2;
  padding: 3px;
`;
const TabItem = styled.button`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-size: ${() => getFontSize(14)}px !important;
  font-family: Pretendard-SemiBold;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? '#fff' : '#888')};
  background: ${({ $active }) => ($active ? BRAND : 'transparent')};
  cursor: pointer;
  transition: all .2s ease;
  -webkit-tap-highlight-color: transparent;
`;


/* 전화번호 안내 배너 */
const PhoneTipBanner = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin: 12px 0 4px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #fff8e1, #fff3cd);
  border: 1px solid #ffe082;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.7;
  }
`;

const PhoneTipText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #795600;
  line-height: 1.5;
  flex: 1;

  strong {
    color: #e65100;
  }
`;

const PhoneTipClose = styled.span`
  font-size: 16px;
  color: #bba050;
  flex-shrink: 0;
  padding: 0 2px;
`;

/* ───────── 일자리 상세 팝업 ───────── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;
const DetailSheet = styled.div`
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 24px 20px calc(env(safe-area-inset-bottom, 0px) + 24px);
`;
const SheetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const SheetTitle = styled.div`
  font-size: ${() => getFontSize(20)}px !important;
  font-weight: 700;
  color: #131313;
`;
const SheetCloseBtn = styled.button`
  border: none;
  background: #f2f2f2;
  border-radius: 999px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  cursor: pointer;
`;
const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: ${() => getFontSize(14)}px !important;
`;
const DetailLabel = styled.span`
  color: #888;
  font-weight: 500;
`;
const DetailValue = styled.span`
  color: #222;
  font-weight: 600;
  text-align: right;
  max-width: 60%;
`;
const SheetApplyBtn = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background: ${BRAND};
  color: #fff;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 700;
  cursor: pointer;
  &:active { opacity: .85; }
`;

const MobileWorkerListcontainer = ({ containerStyle }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  // ✅ 탭 상태: "worker" | "work"
  const [activeTab, setActiveTab] = useState("worker");

  // ✅ 리스트 지연 표시(A 옵션)
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  const [showPhoneTip, setShowPhoneTip] = useState(true);
  const [showWorkPhoneTip, setShowWorkPhoneTip] = useState(true);

  const workeritems = user.workeritems || [];
  const isLoadingInitial = user?.USERINFO?.latitude == null || workeritems.length === 0;

  /* ───────── 일자리(WORK) 탭 데이터 ───────── */
  const [workItems, setWorkItems] = useState([]);
  const [workLoading, setWorkLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "work") return;
    const lat = user?.USERINFO?.latitude;
    const lng = user?.USERINFO?.longitude;
    if (typeof lat !== "number" || typeof lng !== "number") return;

    let cancelled = false;
    setWorkLoading(true);
    ReadWork({ latitude: lat, longitude: lng, checkdistance: 4 })
      .then((items) => {
        if (!cancelled) setWorkItems(Array.isArray(items) ? items : []);
      })
      .catch(() => { if (!cancelled) setWorkItems([]); })
      .finally(() => { if (!cancelled) setWorkLoading(false); });
    return () => { cancelled = true; };
  }, [activeTab, user?.USERINFO?.latitude, user?.USERINFO?.longitude]);

  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let last = el.scrollTop;
    let showTimer;
    const onScroll = () => {
      const st = el.scrollTop;
      if (st > last && st - last > 4) setHidden(true);
      else if (st < last) setHidden(false);
      last = st;
      clearTimeout(showTimer);
      showTimer = setTimeout(() => setHidden(false), 150);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(showTimer);
    };
  }, []);

  // ✅ 추천 정렬(영상 ▶ 전문가 ▶ 거리)
  const sortedWorkerItems = useMemo(() => {
    const base = [...workeritems];
    base.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });
    return base;
  }, [workeritems]);


  /* ───────── 페이지네이션 (15개씩) ───────── */
  const PAGE_SIZE = 15;
  const [workerDisplayCount, setWorkerDisplayCount] = useState(PAGE_SIZE);
  const [workDisplayCount, setWorkDisplayCount] = useState(PAGE_SIZE);

  // 탭 전환 시 각각 초기화
  useEffect(() => {
    if (activeTab === "worker") setWorkerDisplayCount(PAGE_SIZE);
    else setWorkDisplayCount(PAGE_SIZE);
  }, [activeTab]);

  const _handlemap = () => navigate("/Mobileworkermap");
  const _handleWorkerRegister = async () => {
    const workers = await getWorkerByUserId(user.USERS_ID);
    if (Array.isArray(workers) && workers.length > 0) {
      navigate("/Mobileworkeredit", { state: { worker: workers[0] } });
    } else {
      navigate('/Mobileworkerregist');
    }
  };
  const _handleWorkRegister = () => navigate("/Mobileworkregister");

  // 일자리 상세 팝업
  const [selectedWork, setSelectedWork] = useState(null);
  const _handleWorkSelect = (index) => {
    const item = workItems[index];
    if (item) setSelectedWork(item);
  };
  const _closeWorkDetail = () => setSelectedWork(null);

  const getWorkField = (data, type) => {
    const info = Array.isArray(data?.WORK_INFO) ? data.WORK_INFO : [];
    const row = info.find((x) => x?.requesttype === type);
    return row || null;
  };

  // A 옵션: 상단 스피너 표시 조건
  const showTopSpinner = activeTab === "worker" && (!visible || isLoadingInitial);

  return (
    <Container style={containerStyle} ref={scrollRef}>
      <div style={{ display: "flex", flexDirection: "column", margin: "0px auto", width: "100%" }}>

        {/* ───────── 탭 바 ───────── */}
        <TabBar>
          <TabItem $active={activeTab === "worker"} onClick={() => setActiveTab("worker")}>
            구직자
          </TabItem>
          <TabItem $active={activeTab === "work"} onClick={() => setActiveTab("work")}>
            일자리
          </TabItem>
        </TabBar>


        {/* ═══════════ 구직자 탭 ═══════════ */}
        {activeTab === "worker" && (
          <>
            {/* 전화번호 등록 안내 배너 */}
            {showPhoneTip && (
              <PhoneTipBanner onClick={() => setShowPhoneTip(false)}>
                <PhoneTipText>
                  📞 <strong>전화번호를 등록하면</strong> 구인자가 바로 연락할 수 있어요!<br />
                  지원서에 전화번호를 입력해보세요 — 매칭 확률이 높아집니다
                </PhoneTipText>
                <PhoneTipClose>✕</PhoneTipClose>
              </PhoneTipBanner>
            )}

            {/* 상단 스피너 */}
            {showTopSpinner && (
              <div style={{ padding: "30px 0" }}>
                <Spinner size={32} dotSize={4} color="rgba(0,0,0,.6)" dotCount={12} duration={1.2} />
              </div>
            )}

            {/* 구직자 리스트 */}
            {visible && !isLoadingInitial ? (
              sortedWorkerItems.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 80 }}>
                  <EmptyImage src={imageDB.hongarbeit} loading="eager" />
                  <EmptySubTitle style={{ marginTop: 20 }}>아르바이트가 등록되면</EmptySubTitle>
                  <EmptySubTitle>여기에 등록되요</EmptySubTitle>
                  <EmptySubTitle>여기서 일할사람을 구할수 있어요.</EmptySubTitle>
                </div>
              ) : (
                <div style={{ marginBottom: 120 }}>
                  <WorkerCountBadge>
                    {`총 ${sortedWorkerItems.length}명의 일할 사람이 근처에 있어요`}
                  </WorkerCountBadge>

                  <div style={{ display: "flex", flexDirection: "column", marginTop: 12 }}>
                    {sortedWorkerItems.slice(0, workerDisplayCount).map((item) => (
                      <MobileWorkerCard key={item.id || item.users_id} data={{ ...item, type: "personal" }} />
                    ))}
                  </div>

                  {workerDisplayCount < sortedWorkerItems.length && (
                    <LoadMoreButton onClick={() => setWorkerDisplayCount((prev) => prev + PAGE_SIZE)}>
                      더보기 ({workerDisplayCount} / {sortedWorkerItems.length})
                    </LoadMoreButton>
                  )}
                  <BottomSpacer />
                </div>
              )
            ) : null}

            {/* 알바지원 FAB */}
            <FloatingActionButton
              $hidden={hidden}
              $variant="outline"
              aria-label="알바지원"
              onClick={_handleWorkerRegister}
            >
              <FabIcon src={imageDB.seekcharacter} alt="" />
              알바지원
            </FloatingActionButton>

            {/* 지도 보기 버튼 */}
            <FilterEx2 $hidden={hidden} style={{ height: "60px" }}>
              <IconButton
                onPress={_handlemap}
                icon={"map"}
                iconcolor={"#fff"}
                width={"100%"}
                radius={"5px"}
                bgcolor={"#fff"}
                color={"#fff"}
                text={"지도로보기"}
                containerStyle={{
                  fontSize: getFontSize(16),
                  padding: "8px 5px",
                  background: "#000000b0",
                  borderRadius: "20px",
                  boxShadow: "none",
                  border: "1px solid #ededed",
                  width: "110px",
                  height: "30px",
                }}
              />
            </FilterEx2>

          </>
        )}

        {/* ═══════════ 일자리 탭 ═══════════ */}
        {activeTab === "work" && (
          <>
            {/* 전화번호 등록 안내 배너 */}
            {showWorkPhoneTip && (
              <PhoneTipBanner onClick={() => setShowWorkPhoneTip(false)}>
                <PhoneTipText>
                  📞 <strong>전화번호를 등록하면</strong> 매칭이 잘 돼요!<br />
                  일자리 등록 시 전화번호를 입력하면 지원자와 빠르게 연결됩니다
                </PhoneTipText>
                <PhoneTipClose>✕</PhoneTipClose>
              </PhoneTipBanner>
            )}

            {workLoading ? (
              <div style={{ padding: "30px 0" }}>
                <Spinner size={32} dotSize={4} color="rgba(0,0,0,.6)" dotCount={12} duration={1.2} />
              </div>
            ) : workItems.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 80 }}>
                <EmptyImage src={imageDB.hongarbeit} loading="eager" />
                <EmptySubTitle style={{ marginTop: 20 }}>등록된 일자리가 없어요</EmptySubTitle>
                <EmptySubTitle>일자리를 등록해보세요!</EmptySubTitle>
              </div>
            ) : (
              <div style={{ marginBottom: 120 }}>
                <WorkerCountBadge>
                  {`근처에 ${workItems.length}건의 일자리가 있어요`}
                </WorkerCountBadge>
                <div style={{ display: "flex", flexDirection: "column", marginTop: 12 }}>
                  {workItems.slice(0, workDisplayCount).map((item, idx) => (
                    <MobileWorkItem
                      key={item.WORK_ID || item.id}
                      workdata={item}
                      index={idx}
                      onPress={_handleWorkSelect}
                    />
                  ))}
                </div>

                {workDisplayCount < workItems.length && (
                  <LoadMoreButton onClick={() => setWorkDisplayCount((prev) => prev + PAGE_SIZE)}>
                    더보기 ({workDisplayCount} / {workItems.length})
                  </LoadMoreButton>
                )}
                <BottomSpacer />
              </div>
            )}

            {/* 일자리 등록 FAB */}
            <FloatingActionButton
              $hidden={hidden}
              $variant="solid"
              aria-label="일자리 등록"
              onClick={_handleWorkRegister}
            >
              <HiOutlinePencilSquare size={22} />
              일자리 등록
            </FloatingActionButton>

            {/* 지도 보기 버튼 */}
            <FilterEx2 $hidden={hidden} style={{ height: "60px" }}>
              <IconButton
                onPress={_handlemap}
                icon={"map"}
                iconcolor={"#fff"}
                width={"100%"}
                radius={"5px"}
                bgcolor={"#fff"}
                color={"#fff"}
                text={"지도로보기"}
                containerStyle={{
                  fontSize: getFontSize(16),
                  padding: "8px 5px",
                  background: "#000000b0",
                  borderRadius: "20px",
                  boxShadow: "none",
                  border: "1px solid #ededed",
                  width: "110px",
                  height: "30px",
                }}
              />
            </FilterEx2>
          </>
        )}

      </div>

      {/* ═══════════ 일자리 상세 팝업 ═══════════ */}
      {selectedWork && (() => {
        const priceRow = getWorkField(selectedWork, "금액");
        const regionRow = getWorkField(selectedWork, "지역");
        const memoRow = getWorkField(selectedWork, "요청메모");
        const dateRow = getWorkField(selectedWork, "희망일");
        const regionText = regionRow?.result || "지역 정보 없음";
        const lat = regionRow?.latitude;
        const lng = regionRow?.longitude;
        let dist = null;
        if (typeof lat === "number" && typeof lng === "number" && user?.USERINFO?.latitude) {
          dist = distanceFunc(user.USERINFO.latitude, user.USERINFO.longitude, lat, lng).toFixed(1);
        }
        return (
          <Overlay onClick={_closeWorkDetail}>
            <DetailSheet onClick={(e) => e.stopPropagation()}>
              <SheetHeader>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={Seekimage(selectedWork.WORKTYPE)} alt="" style={{ width: 40, height: 40 }} />
                  <SheetTitle>{selectedWork.WORKTYPE}을 도와주세요</SheetTitle>
                </div>
                <SheetCloseBtn onClick={_closeWorkDetail}><HiXMark size={20} /></SheetCloseBtn>
              </SheetHeader>

              {selectedWork.imageUrl && (
                <img src={selectedWork.imageUrl} alt="" style={{ width: "100%", borderRadius: 12, marginBottom: 16, objectFit: "cover", maxHeight: 200 }} />
              )}

              {selectedWork.summaryText && (
                <div style={{ padding: "10px 14px", background: "#f8f8f8", borderRadius: 10, marginBottom: 12, fontSize: getFontSize(13), color: "#444", lineHeight: 1.6 }}>
                  {selectedWork.summaryText}
                </div>
              )}

              <DetailRow>
                <DetailLabel>금액</DetailLabel>
                <DetailValue>{priceRow?.result ? `${Number(priceRow.result).toLocaleString()}원` : "협의"}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>지역</DetailLabel>
                <DetailValue>{regionText}{dist && ` (${dist}km)`}</DetailValue>
              </DetailRow>
              {dateRow && (
                <DetailRow>
                  <DetailLabel>희망일</DetailLabel>
                  <DetailValue>{dateRow.result || "협의"}</DetailValue>
                </DetailRow>
              )}
              {memoRow?.result && (
                <DetailRow style={{ flexDirection: "column", gap: 6 }}>
                  <DetailLabel>요청 메모</DetailLabel>
                  <div style={{ color: "#333", fontSize: getFontSize(13), lineHeight: 1.5 }}>{memoRow.result}</div>
                </DetailRow>
              )}
              <DetailRow style={{ border: "none" }}>
                <DetailLabel>등록</DetailLabel>
                <DetailValue>
                  {selectedWork.NICKNAME || "익명"} · <TimeAgo date={selectedWork.CREATEDT} formatter={timeFormatter} />
                </DetailValue>
              </DetailRow>

              <SheetApplyBtn onClick={() => {
                _closeWorkDetail();
                navigate("/Mobilechat");
              }}>
                채팅으로 문의하기
              </SheetApplyBtn>
            </DetailSheet>
          </Overlay>
        );
      })()}

    </Container>
  );
};

export default MobileWorkerListcontainer;

/* eslint-disable */
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Toaster } from "sonner";
import { MdOutlineLocalPolice, MdCampaign, MdOutlineThumbUp, MdInfoOutline, MdDirectionsCar } from "react-icons/md";

import { UserContext } from "../../context/User";
import { getFontSize } from "../../utility/fontsize";
import { listBoardPosts } from "../../service/BoardService";

const FOOT_HEIGHT = 65;
const HEADER_HEIGHT = 52;

const Container = styled.div`
  margin-top: var(--app-header-h, ${HEADER_HEIGHT}px);
  height: calc(100dvh - var(--app-header-h, ${HEADER_HEIGHT}px) - ${FOOT_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
  scrollbar-gutter: stable;
  padding: 0 16px;
`;


const PageTitle = styled.div`
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(18)}px !important;
  color: #111;
`;

const Card = styled.div`
  border-radius: 0;
  background: #fff;
  border: none;
  box-shadow: none;
  border-bottom: 6px solid #f2f3f5;
  margin-left: -16px;
  margin-right: -16px;
  padding: 14px 16px;
  box-sizing: border-box;

  cursor: pointer;
  user-select: none;

  display: flex;
  align-items: flex-start;
  gap: 12px;

  transition: transform 160ms ease, opacity 160ms ease;

  &:active{ transform: scale(0.992); opacity: 0.98; }
`;


const Body = styled.div`
  flex: 1;
  min-width: 0; /* ✅ 넘침 방지 */
`;

const Row1 = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
`;

const CTitle = styled.div`
  flex: 1;
  min-width: 0;

  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(14)}px !important;
  color: #111827;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DateText = styled.div`
  flex: 0 0 auto;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(11)}px !important;
  color: rgba(15,23,42,0.45);
  font-weight: 900;
  white-space: nowrap;
`;

const CDesc = styled.div`
  margin-top: 6px;

  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  color: rgba(17,24,39,0.62);
  line-height: 1.45;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  overflow-wrap: anywhere;
`;




const Desc = styled.div`
  margin-top: 12px;
  padding: 14px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(234,243,255,0.9) 0%, #fff 70%);
  border: 1px solid rgba(66,134,222,0.18);
  box-shadow: 0 10px 22px rgba(2,6,23,0.06);

  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  color: rgba(17,24,39,0.7);
  line-height: 1.5;

  b{ color:#111; font-family: Pretendard-Bold; }
`;

const FloatingWriteBtn = styled.div`
  position: fixed;
  right: 20px;
  bottom: ${FOOT_HEIGHT + 40}px;
  z-index: 90;

  height: 44px;
  padding: 0 20px;
  border-radius: 22px;

  background: #fff;
  color: #333;
  border: 1px solid rgba(15,23,42,0.12);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 900;

  cursor: pointer;
  user-select: none;

  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  transition: transform 140ms ease, opacity 140ms ease, box-shadow 140ms ease;

  &:active {
    transform: scale(0.95);
    opacity: 0.88;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
`;


const Box = styled.div`
  margin-top: 12px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(15,23,42,0.08);
  color: rgba(15,23,42,0.65);
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
`;

const List = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 0;
`;

/* ── 패트롤 설명 섹션 ── */
const PatrolBanner = styled.div`
  margin-top: 10px;
  padding: 18px 16px 14px;
  border-radius: 18px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -30px;
    right: -20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
`;

const PatrolTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(16)}px !important;
  color: #fff;
`;

const PatrolPoliceIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(250,204,21,0.2);
  color: #facc15;
  font-size: 18px;
`;

const PatrolSub = styled.div`
  margin-top: 6px;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(11.5)}px !important;
  color: rgba(255,255,255,0.6);
  line-height: 1.45;
`;

const PatrolItems = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PatrolItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
`;

const PatrolItemIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${(p) => p.$bg || "rgba(255,255,255,0.12)"};
  color: ${(p) => p.$color || "#fff"};
  font-size: 15px;
  flex: 0 0 auto;
`;

const PatrolItemText = styled.div`
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  color: rgba(255,255,255,0.88);
  line-height: 1.4;

  b {
    font-family: Pretendard-Bold;
    color: #fff;
  }
`;


const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
  background: #e5e7eb;
  border: 1px solid rgba(15,23,42,0.08);
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 900;
  color: rgba(15,23,42,0.55);
`;

const AuthorName = styled.div`
  margin-top: 4px;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 900;
  color: rgba(15,23,42,0.72);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatsRow = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(11)}px !important;
  color: rgba(15,23,42,0.45);
  font-weight: 900;
`;

const StatItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
`;



function fmtDate(v) {
    try {
        if (v?.toDate) {
            const d = v.toDate();
            return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
        }
        const d = new Date(v);
        if (!isNaN(d.getTime())) {
            return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
        }
        return "";
    } catch {
        return "";
    }
}


export default function MobileBoardcontainer({ containerStyle }) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

  
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const createdBy = useMemo(
        () => String(user?.USERS_ID || user?.users_id || user?.USER_ID || ""),
        [user]
    );



    const reload = async () => {
        try {
            setLoading(true);
            setErr("");
            const rows = await listBoardPosts({ pageSize: 50, category: "all" }); // ✅ 고정
            setItems(rows || []);
        } catch (e) {
            setItems([]);
            setErr("목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        reload();
    }, []);

    return (
        <>
            <Container style={containerStyle}>
                <PatrolBanner>
                    <PatrolTitle>
                        <PatrolPoliceIcon><MdOutlineLocalPolice /></PatrolPoliceIcon>
                        구해줘 순찰차
                    </PatrolTitle>
                    <PatrolSub>우리 동네를 지키는 시민 순찰대</PatrolSub>

                    <PatrolItems>
                        <PatrolItem>
                            <PatrolItemIcon $bg="rgba(250,204,21,0.2)" $color="#facc15">
                                <MdOutlineThumbUp />
                            </PatrolItemIcon>
                            <PatrolItemText><b>칭찬해요</b> — 좋은 일자리, 친절한 사장님을 알려주세요</PatrolItemText>
                        </PatrolItem>
                        <PatrolItem>
                            <PatrolItemIcon $bg="rgba(239,68,68,0.2)" $color="#f87171">
                                <MdCampaign />
                            </PatrolItemIcon>
                            <PatrolItemText><b>신고해요</b> — 부당 대우, 임금 체불 등을 제보해주세요</PatrolItemText>
                        </PatrolItem>
                        <PatrolItem>
                            <PatrolItemIcon $bg="rgba(96,165,250,0.2)" $color="#60a5fa">
                                <MdInfoOutline />
                            </PatrolItemIcon>
                            <PatrolItemText><b>정보공유</b> — 유용한 일자리 팁과 경험을 나눠주세요</PatrolItemText>
                        </PatrolItem>
                    </PatrolItems>
                </PatrolBanner>

                {loading ? (
                    <Box>불러오는 중…</Box>
                ) : err ? (
                    <Box>{err}</Box>
                ) : !items.length ? (
                    <Box>아직 글이 없어요.</Box>
                ) : (
                    <List>
                        {items.map((x) => {
                       
                            const date = fmtDate(x?.createdAt);
                            const name = String(x?.authorName || x?.USERINFO?.nickname || x?.createdBy || "익명");
                            const photo = String(x?.authorPhoto || "");
                            const initial = name ? name.slice(0, 1) : "U";

                            return (
                                <Card
                                    key={x.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => navigate("/Mobileboarddetail?postId=" + encodeURIComponent(x.id))}
                                    onKeyDown={(e) =>
                                        (e.key === "Enter" || e.key === " ") &&
                                        navigate("/Mobileboarddetail?postId=" + encodeURIComponent(x.id))
                                    }
                                >
                                    <Avatar>
                                        {photo ? <AvatarImg src={photo} alt="" /> : <AvatarFallback>{initial}</AvatarFallback>}
                                    </Avatar>

                                    <Body>
                                        <Row1>
                                            <CTitle title={x.title}>{x.title}</CTitle>
                                            {!!date && <DateText>{date}</DateText>}
                                        </Row1>

                                        <AuthorName>{name}</AuthorName>

                                        {!!x.content && <CDesc>{x.content}</CDesc>}

                                        <StatsRow>
                                            <StatItem>♥ {x.likeCount || 0}</StatItem>
                                            <StatItem>💬 {x.commentCount || 0}</StatItem>
                                            <StatItem>👁 {x.viewCount || 0}</StatItem>
                                        </StatsRow>
                                    </Body>
                                </Card>
                            );
                        })}
                    </List>

                )}
            </Container>

            <FloatingWriteBtn
                role="button"
                tabIndex={0}
                onClick={() => navigate("/Mobileboardwrite")}
                onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    navigate("/Mobileboardwrite")
                }
            >
                <MdDirectionsCar style={{ fontSize: 18 }} />
                글쓰기
            </FloatingWriteBtn>

            <Toaster position="bottom-right" richColors />
        </>
    );
}

/* eslint-disable */
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Toaster } from "sonner";

import { UserContext } from "../../context/User";
import { getFontSize } from "../../utility/fontsize";
import { readBoardPost, toggleBoardLike, incrementBoardView, addBoardComment, listBoardComments } from "../../service/BoardService";

const FOOT_HEIGHT = 65;
const HEADER_HEIGHT = 52;

/* =========================
   styles
========================= */

const Container = styled.div`
  margin-top: var(--app-header-h, ${HEADER_HEIGHT}px);
  height: calc(100dvh - var(--app-header-h, ${HEADER_HEIGHT}px) - ${FOOT_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
  background-color: #fcfbf7;
  scrollbar-gutter: stable;
  padding: 14px 16px 24px;

  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackBtn = styled.div`
  width: 42px;
  height: 38px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.10);
  display: grid;
  place-items: center;
  cursor: pointer;
  user-select: none;
  font-weight: 900;

  &:active{ transform: scale(0.99); opacity: 0.95; }
`;

const PageTitle = styled.div`
  flex: 1;
  min-width: 0;
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(16)}px !important;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Card = styled.div`
  margin-top: 12px;
  border-radius: 18px;
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 22px rgba(2, 6, 23, 0.05);
  padding: 14px;

  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

const Title = styled.div`
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(16)}px !important;
  color: #0f172a;
  letter-spacing: -0.2px;

  width: 100%;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AuthorRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BigAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  overflow: hidden;
  flex: 0 0 auto;
  background: #e5e7eb;
  border: 1px solid rgba(15,23,42,0.08);

  display: grid;
  place-items: center;
`;

const BigAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 900;
  color: rgba(15,23,42,0.55);
`;

const AuthorTexts = styled.div`
  flex: 1;
  min-width: 0;
`;

const AuthorTitle = styled.div`
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(13)}px !important;
  color: rgba(15,23,42,0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AuthorSub = styled.div`
  margin-top: 2px;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(11)}px !important;
  color: rgba(15,23,42,0.48);
  font-weight: 900;
`;

const Content = styled.div`
  margin-top: 12px;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 800;
  color: rgba(17,24,39,0.88);
  line-height: 1.65;

  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;

  width: 100%;
  max-width: 100%;
`;

const ImgGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  width: 100%;
  max-width: 100%;
`;

const ImgBox = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 14px;
  overflow: hidden;
  background: #f1f5f9;
  border: 1px solid rgba(15,23,42,0.08);
  cursor: pointer;
  user-select: none;

  &:active{ transform: scale(0.99); opacity: 0.95; }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoBox = styled.div`
  margin-top: 12px;
  padding: 14px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid rgba(15,23,42,0.08);
  color: rgba(15,23,42,0.65);
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
`;

const ActionRow = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(15,23,42,0.06);
`;

const LikeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  padding: 6px 2px;
  cursor: pointer;
  user-select: none;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 900;
  color: ${({ $liked }) => ($liked ? "#ef4444" : "rgba(15,23,42,0.5)")};
  transition: transform 140ms ease;

  &:active { transform: scale(0.92); }
`;

const ViewStat = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 900;
  color: rgba(15,23,42,0.45);
`;

/* ========================= comment styles ========================= */

const CommentSection = styled.div`
  margin-top: 16px;
`;

const CommentHeader = styled.div`
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(14)}px !important;
  color: #0f172a;
  margin-bottom: 12px;
`;

const CommentItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid rgba(15,23,42,0.06);
`;

const ReplyItem = styled(CommentItem)`
  margin-left: 32px;
  padding-left: 12px;
  border-left: 2px solid rgba(15,23,42,0.08);
`;

const CommentAuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  overflow: hidden;
  flex: 0 0 auto;
  background: #e5e7eb;
  display: grid;
  place-items: center;
`;

const CommentAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CommentAvatarFallback = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 900;
  color: rgba(15,23,42,0.55);
`;

const CommentName = styled.span`
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(12)}px !important;
  color: rgba(15,23,42,0.82);
`;

const CommentDate = styled.span`
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(10)}px !important;
  color: rgba(15,23,42,0.4);
  font-weight: 900;
`;

const CommentContent = styled.div`
  margin-top: 4px;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(13)}px !important;
  font-weight: 800;
  color: rgba(17,24,39,0.85);
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const ReplyBtn = styled.button`
  margin-top: 4px;
  background: none;
  border: none;
  padding: 2px 0;
  cursor: pointer;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(11)}px !important;
  font-weight: 900;
  color: rgba(15,23,42,0.45);

  &:active { opacity: 0.7; }
`;

const CommentInputWrap = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 14px;
  border-radius: 20px;
  border: 1px solid rgba(15,23,42,0.12);
  background: #f8fafc;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(13)}px !important;
  color: #111;
  outline: none;

  &::placeholder { color: rgba(15,23,42,0.35); }
  &:focus { border-color: rgba(15,23,42,0.25); }
`;

const CommentSendBtn = styled.button`
  flex: 0 0 auto;
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(15,23,42,0.15);
  background: #f8fafc;
  color: #333;
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(12)}px !important;
  cursor: pointer;
  user-select: none;

  &:disabled { opacity: 0.4; cursor: default; }
  &:active:not(:disabled) { transform: scale(0.96); }
`;

const ReplyingTag = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  color: rgba(15,23,42,0.55);
  font-weight: 900;
`;

const CancelReplyBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: ${() => getFontSize(12)}px !important;
  color: rgba(15,23,42,0.4);
  font-weight: 900;

  &:active { opacity: 0.7; }
`;

/* =========================
   utils
========================= */

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

function getInitial(name) {
    const n = String(name || "").trim();
    return n ? n.slice(0, 1) : "U";
}

/* =========================
   component
========================= */

export default function MobileBoardDetailcontainer({ containerStyle }) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const viewCounted = useRef(false);

    const currentUserId = useMemo(
        () => String(user?.USERS_ID || user?.DEVICEID || "").trim(),
        [user]
    );

    const postId = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get("postId") || "";
    }, [location.search]);

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [item, setItem] = useState(null);

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [likeBusy, setLikeBusy] = useState(false);

    // 댓글 상태
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [replyTo, setReplyTo] = useState(null); // { id, authorName }
    const [commentBusy, setCommentBusy] = useState(false);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setErr("");

                if (!postId) {
                    setErr("postId가 없습니다.");
                    setItem(null);
                    return;
                }

                const row = await readBoardPost(postId);
                if (!mounted) return;

                if (!row) {
                    setErr("글을 찾을 수 없습니다.");
                    setItem(null);
                    return;
                }

                setItem(row);

                // 좋아요/조회수 초기값
                const likedBy = Array.isArray(row.likedBy) ? row.likedBy : [];
                setLikeCount(row.likeCount || 0);
                setViewCount(row.viewCount || 0);
                setLiked(currentUserId ? likedBy.includes(currentUserId) : false);

                // 조회수 +1 (한 번만)
                if (!viewCounted.current) {
                    viewCounted.current = true;
                    incrementBoardView(postId).then(() => {
                        if (mounted) setViewCount((v) => v + 1);
                    }).catch(() => {});
                }
            } catch (e) {
                console.error("Board detail load ERROR:", e);
                if (!mounted) return;
                setErr(String(e?.message || "불러오지 못했습니다."));
                setItem(null);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [postId, currentUserId]);

    const imageUrls = useMemo(() => {
        const arr = item?.imageUrls;
        return Array.isArray(arr) ? arr.filter(Boolean) : [];
    }, [item]);

    // 댓글 로드
    useEffect(() => {
        if (!postId) return;
        listBoardComments(postId).then(setComments).catch(() => {});
    }, [postId]);

    // 댓글 트리 구성
    const commentTree = useMemo(() => {
        const roots = comments.filter((c) => !c.parentId);
        const replies = comments.filter((c) => !!c.parentId);
        return roots.map((r) => ({
            ...r,
            children: replies.filter((ch) => ch.parentId === r.id),
        }));
    }, [comments]);

    const handleCommentSubmit = async () => {
        const text = commentText.trim();
        if (!text || commentBusy) return;
        setCommentBusy(true);

        const authorId = currentUserId;
        const myName = String(user?.NICKNAME || user?.nickname || user?.USERS_NAME || "익명").trim();
        const myPhoto = String(user?.USERIMG || user?.userimg || "").trim();

        const optimistic = {
            id: `temp_${Date.now()}`,
            content: text,
            authorId,
            authorName: myName,
            authorPhoto: myPhoto,
            parentId: replyTo?.id || "",
            createdAt: { toDate: () => new Date() },
        };

        setComments((prev) => [...prev, optimistic]);
        setCommentText("");
        setReplyTo(null);

        try {
            const newId = await addBoardComment({
                postId,
                content: text,
                authorId,
                authorName: myName,
                authorPhoto: myPhoto,
                parentId: replyTo?.id || "",
            });
            // 서버 ID로 교체
            setComments((prev) =>
                prev.map((c) => (c.id === optimistic.id ? { ...c, id: newId } : c))
            );
        } catch {
            // 롤백
            setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
        } finally {
            setCommentBusy(false);
        }
    };

    // ✅ 작성자 스냅샷 필드 우선 사용 (없으면 기존 필드로 폴백)
    const authorName = useMemo(() => {
        return String(
            item?.authorName ||
            item?.USERINFO?.nickname ||
            item?.nickname ||
            item?.createdBy ||
            "익명"
        ).trim();
    }, [item]);

    const authorPhoto = useMemo(() => {
        return String(
            item?.authorPhoto ||
            item?.USERINFO?.userimg ||
            item?.userimg ||
            ""
        ).trim();
    }, [item]);

    const createdDate = useMemo(() => fmtDate(item?.createdAt), [item]);

    const handleLike = async () => {
        if (!currentUserId || likeBusy) return;
        setLikeBusy(true);

        // 낙관적 UI
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikeCount((c) => c + (wasLiked ? -1 : 1));

        try {
            await toggleBoardLike(postId, currentUserId);
        } catch {
            // 롤백
            setLiked(wasLiked);
            setLikeCount((c) => c + (wasLiked ? 1 : -1));
        } finally {
            setLikeBusy(false);
        }
    };

    return (
        <>
            <Container style={containerStyle}>
   

                {loading ? (
                    <InfoBox>불러오는 중…</InfoBox>
                ) : err ? (
                    <InfoBox>{err}</InfoBox>
                ) : (
                    <Card>
                        <Title title={item?.title}>{item?.title}</Title>

                        {/* ✅ 작성자 + 날짜 (프로필/대화명) */}
                        <AuthorRow>
                            <BigAvatar>
                                {authorPhoto ? (
                                    <BigAvatarImg src={authorPhoto} alt="" />
                                ) : (
                                    <AvatarFallback>{getInitial(authorName)}</AvatarFallback>
                                )}
                            </BigAvatar>

                            <AuthorTexts>
                                <AuthorTitle>{authorName}</AuthorTitle>
                                {!!createdDate && <AuthorSub>{createdDate}</AuthorSub>}
                            </AuthorTexts>
                        </AuthorRow>

                        {!!imageUrls.length && (
                            <ImgGrid>
                                {imageUrls.map((src, idx) => (
                                    <ImgBox
                                        key={`${src}_${idx}`}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => window.open(src, "_blank")}
                                        onKeyDown={(e) =>
                                            (e.key === "Enter" || e.key === " ") && window.open(src, "_blank")
                                        }
                                    >
                                        <Img src={src} alt="" />
                                    </ImgBox>
                                ))}
                            </ImgGrid>
                        )}

                        {!!item?.content && <Content>{item?.content}</Content>}

                        <ActionRow>
                            <LikeBtn $liked={liked} onClick={handleLike}>
                                {liked ? "❤️" : "🤍"} {likeCount}
                            </LikeBtn>
                            <ViewStat>👁 {viewCount}</ViewStat>
                        </ActionRow>
                    </Card>
                )}

                {/* 댓글 섹션 */}
                {!loading && !err && item && (
                    <CommentSection>
                        <CommentHeader>댓글 {comments.length > 0 ? comments.length : ""}</CommentHeader>

                        {commentTree.map((c) => (
                            <React.Fragment key={c.id}>
                                <CommentItem>
                                    <CommentAuthorRow>
                                        <CommentAvatar>
                                            {c.authorPhoto ? (
                                                <CommentAvatarImg src={c.authorPhoto} alt="" />
                                            ) : (
                                                <CommentAvatarFallback>{getInitial(c.authorName)}</CommentAvatarFallback>
                                            )}
                                        </CommentAvatar>
                                        <CommentName>{c.authorName || "익명"}</CommentName>
                                        <CommentDate>{fmtDate(c.createdAt)}</CommentDate>
                                    </CommentAuthorRow>
                                    <CommentContent>{c.content}</CommentContent>
                                    <ReplyBtn onClick={() => setReplyTo({ id: c.id, authorName: c.authorName || "익명" })}>
                                        답글
                                    </ReplyBtn>
                                </CommentItem>

                                {c.children.map((r) => (
                                    <ReplyItem key={r.id}>
                                        <CommentAuthorRow>
                                            <CommentAvatar>
                                                {r.authorPhoto ? (
                                                    <CommentAvatarImg src={r.authorPhoto} alt="" />
                                                ) : (
                                                    <CommentAvatarFallback>{getInitial(r.authorName)}</CommentAvatarFallback>
                                                )}
                                            </CommentAvatar>
                                            <CommentName>{r.authorName || "익명"}</CommentName>
                                            <CommentDate>{fmtDate(r.createdAt)}</CommentDate>
                                        </CommentAuthorRow>
                                        <CommentContent>{r.content}</CommentContent>
                                    </ReplyItem>
                                ))}
                            </React.Fragment>
                        ))}

                        {replyTo && (
                            <ReplyingTag>
                                @{replyTo.authorName}에게 답글 작성 중
                                <CancelReplyBtn onClick={() => setReplyTo(null)}>✕</CancelReplyBtn>
                            </ReplyingTag>
                        )}

                        <CommentInputWrap>
                            <CommentInput
                                placeholder={replyTo ? `@${replyTo.authorName}에게 답글…` : "댓글을 입력하세요"}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                            />
                            <CommentSendBtn
                                disabled={!commentText.trim() || commentBusy}
                                onClick={handleCommentSubmit}
                            >
                                등록
                            </CommentSendBtn>
                        </CommentInputWrap>
                    </CommentSection>
                )}
            </Container>

            <Toaster position="bottom-right" richColors />
        </>
    );
}

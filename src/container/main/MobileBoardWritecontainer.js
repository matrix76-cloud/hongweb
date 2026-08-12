/* eslint-disable */
import React, { useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Toaster } from "sonner";

import { UserContext } from "../../context/User";
import { getFontSize } from "../../utility/fontsize";
import { createBoardPost, uploadBoardImages, updateBoardPostImages } from "../../service/BoardService";


const FOOT_HEIGHT = 65;
const HEADER_HEIGHT = 52;

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

const Title = styled.div`
  flex: 1;
  min-width: 0;
  font-family: Pretendard-Bold;
  font-size: ${() => getFontSize(16)}px !important;
  color: #111;
`;

const SubmitBtn = styled.div`
  height: 38px;
  padding: 0 14px;
  border-radius: 16px;

  background: #f1f5f9;
  border: 1px solid rgba(15, 23, 42, 0.10);
  color: rgba(15, 23, 42, 0.82);

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 900;

  cursor: pointer;
  user-select: none;

  box-shadow: 0 6px 14px rgba(2, 6, 23, 0.05);
  transition: transform 140ms ease, opacity 140ms ease, box-shadow 140ms ease;

  &:active {
    transform: scale(0.99);
    opacity: 0.92;
    box-shadow: 0 4px 10px rgba(2, 6, 23, 0.04);
  }
`;

const Field = styled.div`
  margin-top: 14px;
`;

const Label = styled.div`
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 900;
  color: rgba(17,24,39,0.70);
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  height: 46px;
  border-radius: 16px;
  border: 1px solid rgba(15,23,42,0.12);
  background: rgba(255,255,255,0.95);
  padding: 0 12px;
  outline: none;

  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 900;
  color: #111;

  overflow: hidden;
  text-overflow: ellipsis;
`;

const Textarea = styled.textarea`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  min-height: 220px;
  border-radius: 16px;
  border: 1px solid rgba(15,23,42,0.12);
  background: rgba(255,255,255,0.95);
  padding: 12px;
  outline: none;
  resize: vertical;

  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 800;
  color: rgba(17,24,39,0.88);
  line-height: 1.55;

  overflow-wrap: anywhere;
`;

const PhotoCard = styled.div`
  margin-top: 10px;
  border-radius: 18px;
  padding: 12px;
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(15,23,42,0.08);
  box-shadow: 0 10px 22px rgba(2,6,23,0.05);

  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const PhotoTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const PhotoHint = styled.div`
  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 900;
  color: rgba(17,24,39,0.70);
`;

const AddBtn = styled.div`
  height: 36px;
  padding: 0 12px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.10);
  color: rgba(15,23,42,0.82);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 900;

  cursor: pointer;
  user-select: none;

  &:active{ transform: scale(0.99); opacity: 0.95; }
`;

const Grid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  width: 100%;
  max-width: 100%;
`;

const Thumb = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 14px;
  overflow: hidden;
  background: #f1f5f9;
  border: 1px solid rgba(15,23,42,0.08);
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Remove = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;

  width: 26px;
  height: 26px;
  border-radius: 999px;

  background: rgba(15,23,42,0.65);
  color: #fff;

  display: grid;
  place-items: center;

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;
  user-select: none;

  &:active{ transform: scale(0.98); opacity: 0.9; }
`;

const Notice = styled.div`
  margin-top: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid rgba(15,23,42,0.08);

  font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 800;
  color: rgba(15,23,42,0.62);
  line-height: 1.45;
`;

export default function MobileBoardWritecontainer({ containerStyle }) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const createdBy = useMemo(
        () => String(user?.USERS_ID || user?.users_id || user?.USER_ID || user?.deviceid || ""),
        [user]
    );

    const inputRef = useRef(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [files, setFiles] = useState([]);      // 실제 업로드 파일
    const [previews, setPreviews] = useState([]); // 미리보기(URL)

    const [saving, setSaving] = useState(false);

    const pickPhotos = () => {
        if (!inputRef.current) return;
        inputRef.current.click();
    };

    const onFiles = (e) => {
        const list = Array.from(e?.target?.files || []);
        if (!list.length) return;

        // ✅ 여러 번 추가 가능하게 누적
        setFiles((prev) => [...(prev || []), ...list]);

        const urls = list.map((f) => URL.createObjectURL(f));
        setPreviews((prev) => [...(prev || []), ...urls]);

        // 같은 파일 재선택 가능하게 초기화
        e.target.value = "";
    };

    const removeAt = (idx) => {
        setFiles((prev) => (prev || []).filter((_, i) => i !== idx));
        setPreviews((prev) => {
            const next = (prev || []).filter((_, i) => i !== idx);
            return next;
        });
    };


    const author = useMemo(() => {
        const authorId = String(user?.USERS_ID || "").trim();
        const authorDeviceId = String(user?.DEVICEID || user?.deviceid || "").trim();
        const authorName = String(user?.USERINFO?.nickname || "").trim();
        const authorPhoto = String(user?.USERINFO?.userimg || "").trim();

        return { authorId, authorDeviceId, authorName, authorPhoto };
    }, [user]);

    const submit = async () => {
        if (saving) return;

        try {
            setSaving(true);

            // 1) 글 먼저 생성
            const postId = await createBoardPost({
                title,
                content,
                category: "free",

                createdBy, // 기존 유지

                imageUrls: [],

                // ✅ 작성자 스냅샷 저장
                authorId: author.authorId,
                authorDeviceId: author.authorDeviceId,
                authorName: author.authorName,
                authorPhoto: author.authorPhoto,
            });


            if (!postId) throw new Error("create_failed");

            // 2) 이미지 업로드
            let imageUrls = [];
            if (files.length) {
                imageUrls = await uploadBoardImages({ files, postId });
            }

            // 3) Firestore 문서에 imageUrls 반영
            await updateBoardPostImages({ postId, imageUrls });

            // 4) 상세로 이동
            navigate("/Mobileboarddetail?postId=" + encodeURIComponent(postId));
        } catch (e) {
            console.error("BOARD_WRITE_ERROR:", e);
            console.error("BOARD_WRITE_ERROR_MESSAGE:", e?.message);
            console.error("BOARD_WRITE_ERROR_CODE:", e?.code);

            const m = String(e?.message || "");
            if (m === "title_required") return alert("제목을 입력해주세요.");
            if (m === "content_required") return alert("내용을 입력해주세요.");

            alert(`저장 실패: ${m || "unknown"}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Container style={containerStyle}>
       

                <Field>
                    <Label>제목</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" maxLength={80} />
                </Field>

                <Field>
                    <Label>내용</Label>
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력하세요" />
                </Field>

                <Field>
                    <Label>사진 (여러 장 가능)</Label>
                    <PhotoCard>
                        <PhotoTop>
                            <PhotoHint>최대 여러 장 업로드 가능</PhotoHint>
                            <AddBtn role="button" tabIndex={0} onClick={pickPhotos} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pickPhotos()}>
                                사진 추가
                            </AddBtn>
                        </PhotoTop>

                        {!!previews.length && (
                            <Grid>
                                {previews.map((src, idx) => (
                                    <Thumb key={`${src}_${idx}`}>
                                        <ThumbImg src={src} alt="" />
                                        <Remove role="button" tabIndex={0} onClick={() => removeAt(idx)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && removeAt(idx)}>
                                            ×
                                        </Remove>
                                    </Thumb>
                                ))}
                            </Grid>
                        )}

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={onFiles}
                        />
                    </PhotoCard>

           
                </Field>
            </Container>

            <Toaster position="bottom-right" richColors />
        </>
    );
}

import React, { useRef, useState } from "react";
import styled from "styled-components";
import { PiCameraBold, PiXBold } from "react-icons/pi";
import { fixOrientationAndCompress } from "../utility/image";
import { uploadImageFile } from "../service/UploadService";

/**
 * 일감 참고 사진 첨부 (형 리뷰 2026-08-12).
 *
 * 등록 마지막에 "참고할 사진이 있나요" 를 묻고 여러 장 받는다.
 * 올리기 전에 반드시 압축한다 — 요즘 폰 사진은 한 장에 4~8MB 라
 * 그대로 올리면 올리는 사람도 보는 사람도 느리다.
 * (fixOrientationAndCompress: 세로로 찍은 사진이 눕는 것도 같이 바로잡는다)
 */

const MAX = 6;

const Wrap = styled.div`
  width: 100%;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 10px;
`;
const Cell = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg);
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const Remove = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 22px;
  height: 22px;
  border-radius: 100px;
  background: rgba(19,19,19,.62);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const AddCell = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 10px;
  border: 1px dashed #D5D5D5;
  background: var(--bg-soft);
  cursor: pointer;
  &:active { background: #F2F2F2; }
`;
const AddInner = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #9A9A9A;
  font-size: 13px;
`;
const Hint = styled.div`
  font-size: 13px;
  color: #8A8A8A;
  margin-top: 8px;
  line-height: 1.5;
`;

const WorkPhotoPicker = ({ photos = [], onChange }) => {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";           // 같은 사진을 다시 고를 수 있게
    if (!files.length) return;

    const room = MAX - photos.length;
    if (room <= 0) return;

    setBusy(true);
    try {
      const urls = [];
      for (const f of files.slice(0, room)) {
        const small = await fixOrientationAndCompress(f);
        const url = await uploadImageFile({ file: small, folder: "workphotos" });
        if (url) urls.push(url);
      }
      onChange([...photos, ...urls]);
    } catch (err) {
      console.error("[workphoto] 올리기 실패", err);
      alert("사진을 올리지 못했습니다. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  };

  const remove = (url) => onChange(photos.filter((p) => p !== url));

  return (
    <Wrap>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={pick} style={{ display: "none" }} />
      <Grid>
        {photos.map((url) => (
          <Cell key={url}>
            <img src={url} alt="참고 사진" />
            <Remove onClick={() => remove(url)}><PiXBold size={12} /></Remove>
          </Cell>
        ))}
        {photos.length < MAX && (
          <AddCell onClick={() => { if (!busy) fileRef.current?.click(); }}>
            <AddInner>
              <PiCameraBold size={22} />
              {busy ? "올리는 중" : `${photos.length}/${MAX}`}
            </AddInner>
          </AddCell>
        )}
      </Grid>
      <Hint>사진은 자동으로 줄여서 올라갑니다. 최대 {MAX}장까지 넣을 수 있어요.</Hint>
    </Wrap>
  );
};

export default WorkPhotoPicker;

import React, { useRef, useState } from "react";
import styled from "styled-components";
import { IoPerson, IoCamera } from "react-icons/io5";
import imageCompression from "browser-image-compression";

/**
 * 프로필 사진 — 눌러서 교체, 업로드 중 상태 표시, 올리기 전에 압축.
 * (형 리뷰 2026-08-12)
 *
 * 예전에는 파일을 base64(dataURL) 그대로 Firestore 문서에 넣었다.
 * 압축이 없어 큰 사진은 문서 1MB 제한에 걸렸고, 목록마다 통째로 내려받았다.
 * 이제 압축 -> Storage 업로드 -> 받은 URL 만 저장한다.
 */

const Wrap = styled.div`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex: none;
  cursor: pointer;
`;

const Circle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #F1F1F3;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CamBadge = styled.div`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: #FF4E19;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dim = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, .45);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileAvatarEditor = ({ src, size = 92, onUploaded, uploader }) => {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [preview, setPreview] = useState(null);

  const shown = preview || src;
  const ok = !!shown && String(shown).trim() !== "" && !failed;

  const pick = () => { if (!busy) fileRef.current?.click(); };

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    try {
      // 미리보기를 먼저 띄워 기다리는 느낌을 줄인다
      setPreview(URL.createObjectURL(file));
      setFailed(false);

      const compressed = await imageCompression(file, {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 720,
        useWebWorker: true,
        fileType: 'image/jpeg',
      });

      const url = await uploader(compressed);
      if (url) onUploaded?.(url);
    } catch (err) {
      console.error('[profile] 업로드 실패', err);
      setPreview(null);
      alert('사진을 올리지 못했습니다. 다시 시도해주세요.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrap $size={size} onClick={pick}>
      <Circle>
        {ok
          ? <Img src={shown} alt="" onError={() => setFailed(true)} />
          : <IoPerson size={Math.round(size * 0.5)} color="#BDBDC2" />}
      </Circle>

      {busy && <Dim>올리는 중</Dim>}

      <CamBadge><IoCamera size={17} color="#fff" /></CamBadge>

      <input type="file" accept="image/*" ref={fileRef} onChange={onChange} style={{ display: 'none' }} />
    </Wrap>
  );
};

export default ProfileAvatarEditor;

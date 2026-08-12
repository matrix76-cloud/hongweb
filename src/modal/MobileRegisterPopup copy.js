// 작품 버전: 우리동네 가게 칭찬 등록폼 (수정 모드 반영)

import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { UserContext } from '../context/User';
import { getFontSize } from '../utility/fontsize';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../api/config';
import HongButton from '../components/HongButton';
import { createPost, updatePost } from '../service/PostService';
import imageCompression from 'browser-image-compression';

const TYPES = ['칭찬', '고발'];

export default function MobileRegisterPopup({ onClose, isEdit, postId, defaultData }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState(defaultData?.storename || '');
  const [latLng, setLatLng] = useState(defaultData ? { lat: defaultData.lat, lng: defaultData.lng } : null);
  const [type, setType] = useState(defaultData?.type || '칭찬');
  const [content, setContent] = useState(defaultData?.content || '');
  const [uploadedUrls, setUploadedUrls] = useState(defaultData?.images || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!window.kakao?.maps || !user.USERINFO.latitude || !user.USERINFO.longitude) return;
    const container = document.getElementById("registerMap");
    if (!container) return;

    const center = new window.kakao.maps.LatLng(
      defaultData?.lat || user.USERINFO.latitude,
      defaultData?.lng || user.USERINFO.longitude
    );

    const map = new window.kakao.maps.Map(container, {
      center,
      level: 4
    });

    const marker = new window.kakao.maps.Marker({
      map,
      position: center,
      draggable: true
    });

    setLatLng({ lat: center.getLat(), lng: center.getLng() });

    window.kakao.maps.event.addListener(marker, 'dragend', () => {
      const pos = marker.getPosition();
      setLatLng({ lat: pos.getLat(), lng: pos.getLng() });
    });
  }, [user.USERINFO.latitude, user.USERINFO.longitude, defaultData]);

  const handleDeleteImage = (index) => {
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (uploadedUrls.length + files.length > 4) {
      toast.error("이미지는 최대 4장까지 등록 가능합니다.");
      return;
    }
    setUploading(true);
    const newUrls = [];
    try {
      for (const file of files) {

        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 640,
          useWebWorker: true,
        };

        const compressed = await imageCompression(file, options); 

        const fileRef = ref(storage, `goodstore_photos/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, compressed);
        const downloadUrl = await getDownloadURL(fileRef);
        newUrls.push(downloadUrl);
      }
      setUploadedUrls(prev => [...prev, ...newUrls]);
    } catch (err) {
      console.error("업로드 실패", err);
      toast.error("이미지 업로드 중 오류 발생");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!storeName.trim() || !latLng || content.length < 40 || content.length > 140 || uploadedUrls.length <= 1) {
      toast.error("모든 항목을 정확히 입력해주세요. (내용은 40~140자, 사진 2장 이상 필수)");
      return;
    }
    const payload = {
      storename: storeName,
      type,
      content,
      region: '',
      lat: latLng.lat,
      lng: latLng.lng,
      writer: user.USERINFO.nickname || '익명',
      USERS_ID: user.USERS_ID,
      profileImg: user.USERINFO.userimg || '/default_profile.png',
      images: uploadedUrls,
    };
    try {
      if (isEdit) {
        await updatePost(postId, payload);
        toast.success("수정 완료!");
      } else {
        await createPost(payload);
        toast.success("등록 완료!");
      }
      onClose(true);
    } catch (err) {
      console.error("저장 실패", err);
      toast.error("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <FullScreenPopup>
      <CloseButton onClick={() => onClose(false)}>×</CloseButton>
      <Toaster richColors />
      <Label>가게 이름</Label>
      <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="예: 상점이름" />

      <Label>가게 위치</Label>
      <div id="registerMap" style={{ width: '100%', height: '150px', borderRadius: '12px', marginBottom: 12 }}></div>
      <RegionText>
        📍 마커를 움직여 위치를 조정하세요<br />
      </RegionText>

      <Label>어떤 내용인가요?</Label>
      <TextArea
        placeholder="칭찬을 입력해주세요 (40~140자)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={140}
      />
      <CharCount>{content.length} / 140자</CharCount>

      <Label>사진 등록 (2장 이상 필수)</Label>
      <UploadWrapper>
        <UploadButton as="button">사진 선택</UploadButton>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </UploadWrapper>

      <PreviewContainer>
        {uploadedUrls.map((url, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <PreviewImg src={url} alt={`preview-${idx}`} />
            <DeleteButton onClick={() => handleDeleteImage(idx)}>×</DeleteButton>
          </div>
        ))}
      </PreviewContainer>
      {uploading && <UploadingText>업로드 중...</UploadingText>}

      <div style={{ marginTop: 24,width:"90%", margin:"0 auto 50px" }}>
        <HongButton variant="primary" onClick={handleSubmit} style={{width:"100%", padding: '12px 0', fontSize: getFontSize(16) }}>
          {isEdit ? '수정하기' : '등록하기'}
        </HongButton>
      </div>
    </FullScreenPopup>
  );
}


const FullScreenPopup = styled.div`
position: fixed;
inset: 0;
height: 100vh;
background: white;
z-index: 9999;
overflow-y: auto;
padding: 24px;
`;

const CloseButton = styled.div`
position: absolute;
top: 18px;
right: 18px;
font-size: 24px !important;
font-weight: bold;
color: #555;
cursor: pointer;
z-index: 10001;
`;
const Label = styled.div`
  font-size: ${() => getFontSize(16)}px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: ${() => getFontSize(14)}px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 160px;
  padding: 10px;
  font-size: ${() => getFontSize(14)}px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: none;
  &::placeholder {
    font-size: ${() => getFontSize(16)}px;
    color: #999;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: ${() => getFontSize(12)}px;
  color: #666;
  margin-bottom: 10px;
`;

const RegionText = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #444;
  margin-bottom: 12px;
  line-height: 1.4;
`;

const UploadWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 4px;
  margin-bottom: 10px;
`;

const UploadButton = styled.button`
  padding: 8px 16px;
  background-color: #ddd;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  min-height: 40px;
`;

const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 8px;
`;

const PreviewImg = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 8px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  height: 24px;
  font-size: ${() => getFontSize(18)}px;
  cursor: pointer;
`;

const UploadingText = styled.div`
  font-size: ${() => getFontSize(13)}px;
  color: #888;
  margin-bottom: 10px;
`;

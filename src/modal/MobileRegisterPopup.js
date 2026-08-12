// 작품 버전: 우리동네 가게 칭찬 등록폼 (수정 모드 반영 + 자랑하기 확장 + UI 구분 라인 + 스위치 버튼 결합형 + 닫기 버튼 추가 + 이미지 썸네일 & 업로드 박스 리팩)

import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { UserContext } from '../context/User';
import { getFontSize } from '../utility/fontsize';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../api/config';
import { createPost, updatePost } from '../service/PostService';
import imageCompression from 'browser-image-compression';
import { COLORS } from '../utility/colors';
import { generateAndSaveAIImageForPost } from '../service/AIImageService';

const TYPES = ['칭찬하기', '자랑하기'];

export default function MobileRegisterPopup({ onClose, isEdit, postId, defaultData }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState(defaultData?.storename || '');
  const [latLng, setLatLng] = useState(defaultData ? { lat: defaultData.lat, lng: defaultData.lng } : null);
  const [type, setType] = useState(defaultData?.type || '칭찬하기');
  const [content, setContent] = useState(defaultData?.content || '');
  const [uploadedUrls, setUploadedUrls] = useState(defaultData?.images || []);
  const [uploading, setUploading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState("");
  const [ttsUrl, setTtsUrl] = useState("");


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
    if (!storeName.trim() || content.length < 40 || content.length > 140 || uploadedUrls.length <= 1) {
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
      ...(type === "자랑하기" && {
        aiImageUrl: aiImageUrl || "",
        ttsUrl: ttsUrl || "",
      }),
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

  const handleAIPraise = async () => {
    if (!storeName.trim() || content.length < 40) {
      toast.error("가게 이름과 내용은 필수입니다. 내용은 최소 40자 이상");
      return;
    }

    const payload = {
      storename: storeName,
      content,
      USERS_ID: user.USERS_ID,
    };

    let toastId;

    try {
      setLoadingAI(true);
      toastId = toast.loading("✨ AI 홍보 콘텐츠 생성 중입니다...");

      const { imageUrl, ttsUrl } = await generateAndSaveAIImageForPost({
        post: payload,
        users_id: user.USERS_ID,
      });

      toast.success("✅ AI 콘텐츠 생성 완료!", {
        id: toastId,  // 기존 토스트 덮어쓰기
      });


      setAiImageUrl(imageUrl);
      setTtsUrl(ttsUrl);


    } catch (err) {
      console.error("🔥 AI 콘텐츠 생성 실패:", err);
      toast.error("AI 콘텐츠 생성 실패",{id : toastId});

    } finally {
      setLoadingAI(false);
    }
  };
  

  const handleMakeVideo = async () => {
    try {
 

      const imageUrls = [
        "https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/test%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202025-08-06%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.10.22.png?alt=media&token=93f52160-bb1c-4722-8f7f-d04704abf96c",
        "https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/test%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202025-08-06%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.10.22.png?alt=media&token=93f52160-bb1c-4722-8f7f-d04704abf96c",
       
      ];
      const captions = [
        "우리 가게는 따뜻한 분위기의 작은 카페입니다.",

      ];

      toast.loading("📹 영상 생성 중입니다...");

      const res = await fetch("https://asia-northeast1-help-bbcb5.cloudfunctions.net/makePromoVideo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls, captions }),
      });

      const result = await res.json();
      toast.dismiss();

      if (res.ok && result.videoUrl) {
        toast.success("✅ 영상 생성 완료!");
        window.open(result.videoUrl, "_blank"); // 또는 저장 등 다른 처리
      } else {
        toast.error(result.error || "영상 생성 실패");
      }
    } catch (err) {
      toast.error("❌ 영상 생성 중 오류 발생");
      console.error(err);
    }
  };
  

  return (
    <FullScreenPopup>
      <Toaster richColors />
      <ItemLine>

      <ToggleContainer>
        {/* <ToggleTrack>
          {TYPES.map((t, idx) => (
            <ToggleButton
              key={t}
              selected={type === t}
              isLeft={idx === 0}
              onClick={() => setType(t)}
            >
              {t}
            </ToggleButton>
          ))}
          </ToggleTrack> */}
          <CloseButton onClick={() => onClose(false)}>닫기</CloseButton>
      </ToggleContainer>
      </ItemLine>

      <ItemLine>
        <Label>가게 이름</Label>
        <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="예: 상점이름" />
      </ItemLine>


      <ItemLine>
        <Label>가게 위치</Label>
        <div id="registerMap" style={{ width: '100%', height: '150px', borderRadius: '12px', marginBottom: 12 }}></div>
        <RegionText>
          📍 마커를 움직여 위치를 조정하세요<br />
        </RegionText>
        
      </ItemLine>


      
      <ItemLine>
      <Label>어떤 내용인가요?</Label>
      <TextArea
        placeholder="칭찬을 입력해주세요 (40~140자)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={140}
        style={{ fontFamily: 'Pretendard-Regular' }}
      />
      <CharCount>{content.length} / 140자</CharCount>
      </ItemLine>


      <ItemLine>
      <Label>사진 등록 (2장 이상 필수)</Label>
      <PreviewContainer>
        {uploadedUrls.map((url, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <PreviewImg src={url} alt={`preview-${idx}`} />
            <DeleteButton onClick={() => handleDeleteImage(idx)}>×</DeleteButton>
          </div>
        ))}

        {uploadedUrls.length < 4 && (
          <UploadBox>
            <UploadLabel htmlFor="upload-button">+</UploadLabel>
            <HiddenInput
              id="upload-button"
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
            />
          </UploadBox>
        )}
      </PreviewContainer>
      {uploading && <UploadingText>업로드 중...</UploadingText>}
      </ItemLine>  
        
      {type === '자랑하기' && (
        <>

        <ItemLine>  

   
            <CTAButton onClick={handleAIPraise}>
              ✨ AI 가게홍보
            </CTAButton>
         

        </ItemLine>
        </>
      )}

      {type === '자랑하기' && aiImageUrl && ttsUrl && (
        <ItemLine>
     
          <Label>✨ AI 생성 콘텐츠 미리보기</Label>
          <AIListenWrapper>
            <PreviewImg src={aiImageUrl} alt="AI 홍보 이미지" />

            <OverlayButton
              onClick={(e) => {
                e.stopPropagation();
                const audio = new Audio(ttsUrl);

                const toastId = toast.loading("🎧 음성 준비 중입니다...", {
                  duration: Infinity,
                  style: {
                    fontSize: '13px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: '#f4f4f5',
                    color: '#111',
                    boxShadow: 'none',
                  }
                });

                audio.onloadeddata = () => {
                  toast.dismiss(toastId);

                  const playToastId = toast("🎧 음성을 재생 중입니다...", {
                    duration: Infinity,
                    style: {
                      fontSize: '13px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: '#f4f4f5',
                      color: '#111',
                      boxShadow: 'none',
                    }
                  });

                  audio.play();

                  audio.onended = () => {
                    toast.dismiss(playToastId);
                  };
                };

                audio.onerror = () => {
                  toast.dismiss(toastId);
                  toast.error("음성 재생에 실패했습니다 😢");
                };
              }}
            >
              🎧 AI 요약 듣기
            </OverlayButton>
          </AIListenWrapper>

        </ItemLine>
      )}


  
      <ItemLine style={{width:"80%", margin:"0 auto"}}>
        <RegistButton onClick={handleSubmit}>
        {isEdit ? '수정하기' : '등록하기'}
        </RegistButton>
      </ItemLine>
  
    </FullScreenPopup>
  );
}

const UploadBox = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  color: #aaa;
  font-size: 32px;
  margin-top: 8px;
`;

const UploadLabel = styled.div`
  font-size: ${() => getFontSize(50)}px !important;

`;

const HiddenInput = styled.input`
  display: none;
`;
const FullScreenPopup = styled.div`
  position: fixed;
  inset: 0;
  background: white;
  z-index: 9999;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;  // ✅ iOS 자연스크롤
  height: 100vh;                       // ✅ 필수: 높이 고정

`;
const ItemLine = styled.div`
  padding: 0px 24px;

`;
const Label = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-family: 'Pretendard-SemiBold';
  margin: 24px 0 8px;
`;

const Label2 = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-family: 'Pretendard-SemiBold';

`;

const TypeSwitch = styled.div`
  display: flex;
  gap: 10px;
`;

const TypeButton = styled.div`
  flex: 1;
  padding: 10px 0;
  border-radius: 999px;
  text-align: center;
  font-weight: 600;
  background-color: ${({ selected }) => (selected ? '#FF7E19' : '#eee')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const DividerFull = styled.hr`
  margin: 24px 0;
  border: none;
  border-top: 3px solid #eee;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: ${() => getFontSize(14)}px !important;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 160px;
  padding: 12px;
  font-size: ${() => getFontSize(14)}px !important;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
  &::placeholder {
    color: #999;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: ${() => getFontSize(12)}px !important;
  color: #666;
  margin-top: 4px;
`;

const UploadWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 4px;
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

const DeleteButton = styled.div`
    position: absolute;
    top: 6px;
    right: 6px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    cursor: pointer;
    text-align: center;
`;

const UploadingText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #888;
  margin-top: 10px;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 4px 12px;
  border: none;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 600;
  background-color: #FF7e19;
  color: #FFF;
  border: 1.5px solid #FF7E19;
  cursor: pointer;
  margin-top: 12px;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  &:hover {
    background-color: #FF7e19;
  }
`;



const RegistButton = styled.button`
  width: 100%;
  margin: 12px auto;
  padding: 14px;
  border: none;
  border-radius: 9999px;
  font-size: ${() => getFontSize(16)}px !important;
  background-color: ${COLORS.primary};
  color: #FFF;
  border: 1.5px solid ${COLORS.primary};
  cursor: pointer;

  transition: all 0.2s ease;
  &:hover {
    background-color: ${COLORS.primary};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const ToggleTrack = styled.div`
  display: flex;
  border-radius: 999px;
  background: #f1f1f1;
  padding: 6px;
  gap: 2px;
`;

const ToggleButton = styled.div`
  flex: 1;
  padding: 5px 20px;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 600;
  text-align: center;
  border-radius: 999px;
  cursor: pointer;
  color: ${({ selected }) => (selected ? '#fff' : '#333')};
  background: ${({ selected }) => (selected ? '#FF7E19' : 'transparent')};
`;
const HeaderRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top:20px;
`;

const CloseButton = styled.div`
    background: #f2f2f2;
    color: #333;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 14px !important;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    height: 30px;
    margin-top: 5px;
`;

const RowBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const RegionText = styled.div`
  font-size: ${() => getFontSize(13)}px !important;
  color: #444;
  margin-bottom: 12px;
  line-height: 1.4;
`;

const ListenButton = styled.div`
  margin-top: 4px;
  padding: 4px 8px;
  font-size: ${() => getFontSize(12)}px !important;
  border-radius: 6px;
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
  width: fit-content;
  align-self: flex-start;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left:5px;

  &:hover {
    background-color: #e5e7eb;
  }
`;
const AIListenWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
`;

const OverlayButton = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.92);
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  font-size: ${() => getFontSize(14)}px !important;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  cursor: pointer;
  z-index: 5;

  &:hover {
    background: #f3f4f6;
  }
`;

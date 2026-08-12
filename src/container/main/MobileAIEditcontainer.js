// src/pages/mobile/MobileAIEditcontainer.jsx
import React, { useState, useContext, useRef } from "react";
import styled from "styled-components";
import { UserContext } from "../../context/User";
import { updateWorkerByUserId } from "../../service/WorkerService";
import { Toaster, toast } from "sonner";
import { getFontSize } from "../../utility/fontsize";
import { translatePrompt } from "../../service/TranslateService";
import {
  generateAiImageFromPrompt,
  generateAndSaveAIImageForWorker,
  generateAndSaveAIImageForPost
} from "../../service/AIImageService";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../api/config";
import { imageDB } from "../../utility/imageData";
import CharacterCTA from "../../common/CharacterCTA";
import { COLORS } from "../../utility/colors";
import VoiceDictateButton from "../../common/VoiceDictateButton";



const MobileAIEditcontainer = ({ workeritem = null, postitem = null, promptMode = "worker" }) => {
  const { user, dispatch } = useContext(UserContext);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState("");
  const [currentImage, setCurrentImage] = useState(user.USERINFO?.userimg || "");
  const [currentAIImage, setCurrentAIImage] = useState(workeritem?.AI_NEWIMAGE_COMPRESSED || "");

  // 🎙️ 프롬프트 입력 textarea ref
  const promptRef = useRef(null);

  // 말한 텍스트를 현재 커서(또는 선택 영역)에 삽입
  const insertAtCursor = (text, { addSpace = true } = {}) => {
    const ta = promptRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? prompt.length;
    const end = ta.selectionEnd ?? prompt.length;
    const before = prompt.slice(0, start);
    const after = prompt.slice(end);
    const insert = addSpace && before && !/\s$/.test(before) ? ` ${text}` : text;
    const next = before + insert + after;
    setPrompt(next);
    const caret = (before + insert).length;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(caret, caret);
    });
  };
  const onPartialSpeak = (t) => insertAtCursor(t, { addSpace: false });
  const onFinalSpeak = (t) => insertAtCursor(t.trim(), { addSpace: true });

  const compressImageFromUrl = async (url) => {
    return new Promise(async (resolve, reject) => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
        });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 350;
        canvas.height = 350;
        ctx.drawImage(img, 0, 0, 350, 350);
        let quality = 0.9;
        let blob = await new Promise((res) => canvas.toBlob(res, "image/webp", quality));
        while (blob.size > 180 * 1024 && quality > 0.4) {
          quality -= 0.05;
          blob = await new Promise((res) => canvas.toBlob(res, "image/webp", quality));
        }
        resolve(blob);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleGenerate = async () => {
    setGeneratedImgUrl("");
    setLoading(true);
    try {
      let finalUrl = "";
      if (promptMode === "manual") {
        const englishPrompt = await translatePrompt(prompt);
        finalUrl = await generateAiImageFromPrompt({ users_id: user.USERS_ID, prompt: englishPrompt });

        const compressedBlob = await compressImageFromUrl(finalUrl);
        const storageRef = ref(storage, `ai_compressed/${user.USERS_ID}.webp`);
        await uploadBytes(storageRef, compressedBlob);
        const downloadUrl = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "USERS", user.USERS_ID), {
          "USERINFO.userimg": downloadUrl,
          USED_AI_PROFILE_IMAGE: true,
          updatedAt: Date.now()
        });
        dispatch({ USERINFO: { userimg: downloadUrl } });
        setCurrentImage(downloadUrl);
        setGeneratedImgUrl(downloadUrl);
      } else if (promptMode === "worker") {
        const url = await generateAndSaveAIImageForWorker({ worker: workeritem, users_id: user.USERS_ID });
        await updateDoc(doc(db, "WORKERS", workeritem.WORKER_ID), { USED_AI_WORK_IMAGE: true });
        setCurrentAIImage(url);
        setGeneratedImgUrl(url);
      } else if (promptMode === "post") {
        const { imageUrl, ttsUrl } = await generateAndSaveAIImageForPost({
          post: postitem,
          users_id: user.USERS_ID
        });
        setGeneratedImgUrl(imageUrl);
        await updateDoc(doc(db, "POSTS", postitem.id), {
          AI_IMAGE_URL: imageUrl,
          TTS_URL: ttsUrl,
          updatedAt: Date.now()
        });
        toast.success("AI 이미지와 TTS가 성공적으로 생성되었습니다!");
      }
    } catch (e) {
      console.log("이미지 생성 실패", e);
      toast.error("AI 이미지 생성에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Toaster position="bottom-right" />

      <>
        {promptMode === "manual" ? (
          <></>
        ) : (
          <>
            <SectionTitle>현재 사용 중인 AI 이미지</SectionTitle>
            {currentAIImage ? (
              <TinyImage src={currentAIImage} alt="기존 이미지" />
            ) : (
              <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                아직 생성된 이미지가 없습니다.
              </div>
            )}
          </>
        )}
      </>

      <InfoBox>
        AI가 {promptMode !== "worker" ? "고객님이 입력한 내용을 기반으로 프로필" : "아르바이트 지원서를 분석하여 작업 분위기에 어울리는  AI "}, 이미지를 생성합니다.
      </InfoBox>

      {promptMode === "manual" && (
        <>
          <SectionTitle>프롬프트 입력</SectionTitle>
          <PromptWrap>
            <PromptInput
              ref={promptRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: 밝게 웃는 40대 여성, 부엌에서 일하는 모습"
            />
            {/* <MicFloat>
              <VoiceDictateButton
                mode="toggle"
                size={40}
                color={COLORS.primary}
                onPartial={onPartialSpeak}
                onFinal={onFinalSpeak}
              />
            </MicFloat> */}
          </PromptWrap>
        </>
      )}

      <GenerateButton onClick={handleGenerate} disabled={loading}>
        {loading ? "이미지 생성 중..." : "AI 이미지 생성하기"}
      </GenerateButton>

      {loading && (
        <LoadingBox>
          <BlurBackground />
          <LoadingText>✨ 이미지 생성 중입니다...</LoadingText>
        </LoadingBox>
      )}

      {!loading && generatedImgUrl && (
        <>
          <SectionTitle>생성된 이미지</SectionTitle>
          <PreviewImage src={generatedImgUrl} />
        </>
      )}
    </Container>
  );
};

export default MobileAIEditcontainer;

/* ====================== styles ====================== */

const Container = styled.div`
  height: calc(100dvh - 47px);
  overflow-y: auto;
  padding: 20px;
  margin-top: 50px;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const TinyImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 16px;
  border: 1px solid #eee;
`;

const PromptWrap = styled.div`
  position: relative;
`;

const PromptInput = styled.textarea`
  width: 100%;
  padding: 12px 56px 12px 12px; /* 우측 마이크 공간 확보 */
  font-size: ${() => getFontSize(15)}px !important;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  min-height: 140px;
  background-color: ${({ invalid }) => (invalid ? "#ffe5e5" : "#fff")};
`;

const MicFloat = styled.div`
  position: absolute;
  top: 10px;   /* 우상단 배치 */
  right: 10px;
  display: grid;
  place-items: center;
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  border-radius: 10px;
  margin-bottom: 24px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingBox = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  background: #e0e0e0;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.1);
`;

const BlurBackground = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #e0e0e0 0%, #f5f5f5 40%, #e0e0e0 80%);
  background-size: 200% 200%;
  animation: shimmer 2.5s linear infinite, pulse 2s ease-in-out infinite;
  filter: blur(10px);
  opacity: 0.9;
  position: absolute;
  top: 0;
  left: 0;

  @keyframes shimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
`;

const LoadingText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 17px;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.5px;
  white-space: nowrap;
  animation: flicker 2s infinite ease-in-out;
  text-shadow:
    0 0 4px rgba(255, 255, 255, 0.3),
    0 0 8px rgba(255, 255, 255, 0.2),
    0 0 16px rgba(255, 255, 255, 0.1);

  @keyframes flicker {
    0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
    50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.05); }
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
`;

const SetMainButton = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  background-color: #ff7e19;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

const InfoBox = styled.div`
  background: #f7f8fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  font-size: ${() => getFontSize(15)}px !important;
  color: #333;
  line-height: 1.6;
`;

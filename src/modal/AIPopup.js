// AIPopup.jsx
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

import { model } from "../api/config";
import { removeSymbols } from "../utility/common";
import { getFontSize } from "../utility/fontsize";
import { imageDB } from "../utility/imageData";
import { COLORS } from "../utility/colors";
import VoiceDictateButton from "../common/VoiceDictateButton";

// ▼ 경로는 프로젝트 구조에 맞게 조정하세요.


export const AIPopup = ({ original, userMeta, workMeta, onApply, onCancel }) => {
  const [aiText, setAiText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const textareaRef = useRef(null);  // AI 미리보기 스크롤용
  const inputRef = useRef(null);     // 사용자가 직접 입력하는 textarea(음성 입력 삽입용)

  /* === 프롬프트 === */
  function generatePromptFromMeta(userMeta, selfIntro) {
    const { name = "", age = "", gender = "", region = "", category = "" } = userMeta || {};
    return `
      당신은 사람의 이력과 자기소개를 바탕으로 진심 어린 지원서를 작성해주는 AI입니다.
      다음 정보를 바탕으로 자기소개 문장을 따뜻하고 자연스럽게 작성해주세요:
      - 이름: ${name}
      - 나이: ${age}
      - 성별: ${gender}
      - 지역: ${region}
      - 희망 업무: ${category}
      - 사용자가 직접 작성한 자기소개:
      "${selfIntro}"
      📌 작성 시 유의사항:
      1. 위 정보를 나열하지 말고, 문장 안에 자연스럽게 녹여 하나의 흐름 있는 글로 작성해주세요.
      2. 문장은 따뜻하고 신뢰감을 줄 수 있도록 정중하면서도 사람다운 말투를 사용해주세요.
      3. 너무 딱딱하거나 기계처럼 들리지 않게 하며, 마지막은 정중하게 마무리해주세요.
      4. 전체 글자 수는 **200자 이상 600자 이하**로 작성해주세요.
      5. “귀사”“귀 기관”“본인”“이력서 상” 같은 표현은 사용하지 마세요.`;
  }

  function generateCustomPromptFromMeta(workMeta, customMessage) {
    return `
      당신은 사람의 이력과 자기소개를 바탕으로 진심 어린 지원서를 작성해주는 AI입니다.
      다음 정보를 바탕으로 자기소개 문장을 따뜻하고 자연스럽게 작성해주세요:
      공고 정보:
      ${workMeta?.promptText || "- 공고 정보 없음"}
      - 사용자가 직접 작성한 자기소개:
      "${customMessage}"
      📌 작성 시 유의사항:
      1. 정보 나열 금지, 자연스러운 흐름
      2. 정중하지만 사람다운 말투
      3. 마지막은 정중한 마무리
      4. **200–600자**로 작성`;
  }

  /* === STT: 커서 위치 삽입 유틸 === */
  function insertAtCursor(text, opts = { addSpace: true }) {
    const ta = inputRef.current;
    if (!ta) return;

    const start = ta.selectionStart ?? customMessage.length;
    const end = ta.selectionEnd ?? customMessage.length;

    const before = customMessage.slice(0, start);
    const after = customMessage.slice(end);

    const insert =
      opts.addSpace && before && !/\s$/.test(before) ? ` ${text}` : text;

    const next = before + insert + after;
    setCustomMessage(next);

    const caret = (before + insert).length;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(caret, caret);
    });
  }
  const onPartialSpeak = (t) => insertAtCursor(t, { addSpace: false });
  const onFinalSpeak = (t) => insertAtCursor(t.trim(), { addSpace: true });

  /* === 초기 자동 생성 (original 전달된 경우) === */
  useEffect(() => {
    if (!original) return;
    (async () => {
      setStarted(true);
      setIsGenerating(true);
      const prompt = generatePromptFromMeta(userMeta, original);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setAiText(removeSymbols(text));
    })();
  }, [original]);

  /* 커서 블링크 */
  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(blink);
  }, []);

  /* 사용자 입력 기반 생성 */
  const _handleAISupport = async () => {
    setIsGenerating(true);
    setStarted(true);
    const prompt = generateCustomPromptFromMeta(workMeta, customMessage);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    setAiText(removeSymbols(text));
  };

  /* 타자치는 효과 */
  useEffect(() => {
    if (!aiText) return;
    let i = 0;
    setTypedText("");
    const id = setInterval(() => {
      setTypedText((prev) => {
        const next = prev + aiText.charAt(i++);
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
        if (i >= aiText.length) {
          clearInterval(id);
          setIsTypingDone(true);
          setIsGenerating(false);
        }
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, [aiText]);

  return (
    <PopupOverlay>
      <PopupContent>
        <TitleRow>
          <AITitle>
            <AITitleIcon src={imageDB.seekcharacter} alt="" />
            AI 알비가 다듬은 지원서
          </AITitle>
          <CloseX onClick={onCancel}>✕</CloseX>
        </TitleRow>

        {/* ▼ 1단계: 사용자가 직접 메시지 입력 → 음성 버튼 지원 */}
        {original === "" && !started && (
          <>
            <TextareaWrap>
              <Textarea
                ref={inputRef}
                placeholder="예시: 저는 50대 남자이며 서울에 거주 중입니다. 매사에 모든 일에 최선을 다하고 성격도 활달하여 주위 사람들과 잘 지내며, 한 직장에서 10년간 재직하였습니다."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
              <MicFloat>
                <VoiceDictateButton
                  mode="toggle"
                  size={40}
                  color={COLORS.primary}
                  onPartial={onPartialSpeak}
                  onFinal={onFinalSpeak}
                />
              </MicFloat>
            </TextareaWrap>


            <AIStartButton
              onClick={_handleAISupport}
              disabled={!customMessage.trim() || started}
            >
              {started ? "작성 중..." : "지원서 작성"}
            </AIStartButton>
          </>
        )}

        {/* ▼ 2단계: AI 결과 타이핑 미리보기 (기존 동작 그대로) */}
        {original !== "" ? (
          <>
            <AITextPreview
              ref={textareaRef}
              value={typedText + (cursorVisible ? "█" : "")}
              readOnly
            />
            <PopupActions>
              <CancelBtn onClick={onCancel}>취소</CancelBtn>
              <ApplyBtn disabled={!isTypingDone} onClick={() => onApply(aiText.trim())}>
                {isTypingDone ? "지원서 적용" : "작성 중..."}
              </ApplyBtn>
            </PopupActions>
          </>
        ) : (
          started && (
            <>
              <AITextPreview
                ref={textareaRef}
                value={typedText + (cursorVisible ? "█" : "")}
                readOnly
              />
              <PopupActions>
                <CancelBtn onClick={onCancel}>취소</CancelBtn>
                <ApplyBtn disabled={!isTypingDone} onClick={() => onApply(aiText.trim())}>
                  {isTypingDone ? "지원서 적용" : "작성 중..."}
                </ApplyBtn>
              </PopupActions>
            </>
          )
        )}
      </PopupContent>
    </PopupOverlay>
  );
};

/* ================= styled ================= */

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background: #fff;
  width: 80%;
  max-width: 600px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  max-height: 80vh;
  overflow-y: auto;
`;

const TitleRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px;
`;

const CloseX = styled.div`
  font-size: 18px; cursor: pointer; color: #aaa;
  &:hover { color: #111; }
`;

const AITitle = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-family: Pretendard-SemiBold;
  font-weight: 700;
  display: flex; align-items: center; gap: 6px; color: #333;
`;

const AITitleIcon = styled.img`
  width: 28px; height: 28px; display: block; border-radius: 50%;
  object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,.12);
`;

const TextareaWrap = styled.div`
  position: relative;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  font-size: ${() => getFontSize(16)}px !important;
  padding: 10px 56px 10px 10px;  /* ← 우측 마이크 공간 확보 */
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 16px;

  &::placeholder{
    color: #bbb; padding: 0;
    font-family: 'Pretendard-Light';
    line-height: 1.6; text-align: left;
    font-size: ${() => getFontSize(16)}px !important;
  }
  &:focus { border: 1px solid #7C3AED; outline: none; }
`;

const MicFloat = styled.div`
  position: absolute;
  top: 10px;     /* ⬅️ 아래쪽이 아니라 위쪽으로 */
  right: 10px;
  display: grid;
  place-items: center;
`;

const MicHint = styled.div`
  margin: 6px 2px 12px;
  font-size: ${() => getFontSize(12)}px !important;
  color: #667085;
`;

const AITextPreview = styled.textarea`
  width: 100%;
  min-height: 300px;
  font-size: ${() => getFontSize(16)}px !important;
  padding: 10px 56px 10px 10px; /* 오른쪽 공간 확보 */
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 16px;

  &::placeholder{
    color: #bbb; padding: 0;
    font-family: 'Pretendard-Light';
    line-height: 1.6; text-align: left;
    font-size: ${() => getFontSize(16)}px !important;
  }
  &:focus { border: 1px solid #7C3AED; outline: none; }
`;

const PopupActions = styled.div`
  display: flex; justify-content: flex-end; margin-top: 12px; gap: 10px;
`;

const CancelBtn = styled.button`
  padding: 10px 16px; background: #eee; border: 1px solid #ccc; border-radius: 8px;
`;

const ApplyBtn = styled.button`
  padding: 10px 16px; background: #7C3AED; color: #fff; border: none; border-radius: 8px; font-weight: 700;
`;

const AIStartButton = styled.button`
  font-size: ${() => getFontSize(14)}px !important;
  padding: 12px; border-radius: 12px; border: 1px solid #ddd;
  background: #7C3AED; color: #fff; width: 100%; margin: -10px 0 16px;
  cursor: pointer;
  &:disabled { background: #eee; color: #aaa; cursor: not-allowed; }
`;

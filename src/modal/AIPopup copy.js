import styled from "styled-components";

import { model } from "../api/config";
import { useEffect, useRef, useState } from "react";
import { removeSymbols } from "../utility/common";
import { getFontSize } from "../utility/fontsize";
import { TbChevronsDownLeft } from "react-icons/tb";
import { imageDB } from "../utility/imageData";

export const AIPopup = ({ original, userMeta, workMeta, onApply, onCancel }) => {
  const [aiText, setAiText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef();
  const [customMessage, setCustomMessage] = useState("");

  function generatePromptFromMeta(userMeta, selfIntro) {
    const {
      name = "",
      age = "",
      gender = "",
      region = "",
      category = ""
    } = userMeta || {};

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
      4. 전체 글자 수는 **200자 이상 600자 이하**로 작성해주세요. 너무 길거나 짧지 않게 해주세요.
      5. “귀사”, “귀 기관”, “본인”, “이력서 상” 같은 관공서/회사식 표현은 절대 사용하지 마세요.  
        상대방은 **사람**이며, 일반적인 구직 상황을 전제로 작성해주세요.`;
        
  }

  function generateCustomPromptFromMeta(workMeta, customMessage) {
    return `
      당신은 사람의 이력과 자기소개를 바탕으로 진심 어린 지원서를 작성해주는 AI입니다.
      다음 정보를 바탕으로 자기소개 문장을 따뜻하고 자연스럽게 작성해주세요:
      공고 정보:
        ${workMeta.promptText || "- 공고 정보 없음"}
      - 사용자가 직접 작성한 자기소개:
      "${customMessage}"
📌 작성 시 유의사항:
1. 위 정보를 나열하지 말고, 문장 안에 자연스럽게 녹여 하나의 흐름 있는 글로 작성해주세요.
2. 문장은 따뜻하고 신뢰감을 줄 수 있도록 정중하면서도 사람다운 말투를 사용해주세요.
3. 너무 딱딱하거나 기계처럼 들리지 않게 하며, 마지막은 정중하게 마무리해주세요.
4. 전체 글자 수는 **200자 이상 600자 이하**로 작성해주세요. 너무 길거나 짧지 않게 해주세요.`;
  }


  useEffect(() => {
    if (original) {
      const generate = async () => {
        setStarted(true);
        setIsGenerating(true);
        const prompt = generatePromptFromMeta(userMeta, original);
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        setAiText(removeSymbols(text));
      };
      generate();
    }
  }, [original]);

  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  const _handleAISupport = async () => {
    setIsGenerating(true);
    setStarted(true);
    const prompt = generateCustomPromptFromMeta(workMeta, customMessage);
    console.log("handleAISupport", prompt);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    setAiText(removeSymbols(text));
  };

  useEffect(() => {
    if (!aiText) return;
    let index = 0;
    setTypedText("");
    const interval = setInterval(() => {
      setTypedText((prev) => {
        const next = prev + aiText.charAt(index);
        index++;
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
        if (index >= aiText.length) {
          clearInterval(interval);
          setIsTypingDone(true);
          setIsGenerating(false);
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [aiText]);

  const handleOverlayClick = (e) => {
    if (original === '' && started) onCancel();
  };


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
        {original === '' && !started && (
          <>
            <Textarea
              placeholder="예시: 저는 50대 남자이며 서울에 거주 중입니다. 매사에 모든 일에 최선을 다하고 성격도 활달하여 주위 사람들과 잘 지내며, 
              한 직장에서 10년간 재직하였습니다."

              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            <AIStartButton
              onClick={_handleAISupport}
              disabled={!customMessage.trim() || started}
            >
              {started ? "작성 중..." : "지원서 작성"}
            </AIStartButton>
          </>
        )}
        {original !== '' ? (
          <>
            <AITextPreview
              ref={textareaRef}
              value={typedText + (cursorVisible ? "█" : "")}
              readOnly
            />
            <PopupActions>
              <CancelBtn onClick={onCancel}>취소</CancelBtn>
              <ApplyBtn
                disabled={!isTypingDone}
                onClick={() => {
                  onApply(aiText.trim());
                }}
              >
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
                <ApplyBtn
                  disabled={!isTypingDone}
                  onClick={() => {
                    onApply(aiText.trim());
                  }}
                >
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


const AIButton = styled.button`
  font-size: 13px;
  background: none;
  color: #1a8f5c;
  border: none;
  cursor: pointer;
`;


const PopupActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  gap: 10px;
`;

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
  background: white;
  width: 80%;
  max-width: 600px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  max-height: 80vh;
  overflow-y: auto;
`;

const AITextPreview = styled.textarea`
  width: 100%;
  min-height: 450px;
  font-size: ${() => getFontSize(14)}px !important;
  font-family: 'Courier New', monospace;
  padding: 12px 12px 12px 16px;
  line-height: 1.6;
  border-radius: 12px;
  border-left: 4px solid #ff7e19; // ✅ 포인트 강조색
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background-color: #fffaf4; // ✅ 살짝 아이보리톤
  resize: none;
`;

const CancelBtn = styled.button`
  padding: 10px 16px;
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const ApplyBtn = styled.button`
  padding: 10px 16px;
  background: #7C3AED;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  font-size: ${() => getFontSize(16)}px !important;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 16px;

  &::placeholder {
    color: #bbb;
    padding: 0px;
    font-family: 'Pretendard-Light';
    line-height:1.6;
    text-align: left;
    font-size: ${() => getFontSize(16)}px !important;
  }
  &:focus {
  border: 1px solid #7C3AED;
  outline: none;
 }
`;

const AIStartButton = styled.button`
  font-size: ${() => getFontSize(14)}px !important;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #7C3AED;
  color: #fff;
  width: 100%;
  margin: -10px 0 16px;
  cursor: pointer;
  &:disabled {
    background-color: #eee;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CloseX = styled.div`
  font-size: 18px;
  cursor: pointer;
  color: #aaa;
  &:hover {
    color: #111;
  }
`;

const AITitle = styled.div`
  font-size: ${() => getFontSize(16)}px !important;
  font-family: Pretendard-SemiBold;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
`;

const AITitleIcon = styled.img`
  width: 28px;
  height: 28px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0,0,0,.12); /* 살짝만 띄워주기 */
`;
// 📄 modal/MobileCompletePopup/MobileCompletePopup.jsx
import React from "react";
import styled from "styled-components";
import { toast } from "sonner";

import { getFontSize } from "../../utility/fontsize";
// import { REQUESTINFO } from "../../utility/work"; // 필요 시 사용
import { imageDB } from "../../utility/imageData";
import { COLORS } from "../../utility/colors";
import ModalWrapper from "../ModalWrapper";
import { FlexstartRow, Row } from "../../common/Row";
import { Column, FlexEndColumn } from "../../common/Column";

// ── Preview UI (AI 이미지 + TTS)
const ImgBox = styled.div`
  width: 90%;
  border: 1px solid #EEE;
  border-radius: 12px;
  overflow: hidden;
  background: #FAFAFA;
  position: relative;
  display: grid;
  place-items: center;
`;
const ImgThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ImgBadge = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  font-size: ${() => getFontSize(11)}px !important;
  padding: 4px 8px;
  border-radius: 999px;
  background: #F3E8FF;
  color: ${COLORS.primary};
  border: 1px solid rgba(124, 58, 237, 0.25);
`;
const MiniHr = styled.div`
  height: 1px;
  background: #EDEDED;
  margin: 8px 0 12px;
`;

const Property = styled.div`
  width: 40%;
  font-size: ${() => getFontSize(14)}px;
  font-weight: 700;
  color: #222;
  padding: 12px 0;
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
  &:hover { background-color: #e5e7eb; }
  &[aria-disabled="true"] { opacity: .55; pointer-events: none; }
`;

export default function MobileCompletePopup({ callback, data, messages, requestcallback }) {
  const [open, setOpen] = React.useState(true);

  // 생성 결과(상위에서 전달)
  const imageUrl = data?.imageUrl || "";
  const ttsUrl = data?.ttsUrl || "";
  const summaryText = data?.summaryText || "";

  // 작성한 메모(폴백 TTS용)
  const previewText =
    (messages?.find(m => m.type === "response" && m.requesttype === "요청메모")?.result || "").trim();

  const [ttsPlaying, setTtsPlaying] = React.useState(false);

  const stopTTS = React.useCallback(() => {
    try { window.speechSynthesis?.cancel(); } catch (_) { }
    setTtsPlaying(false);
  }, []);

  React.useEffect(() => {
    return () => stopTTS(); // 언마운트 시 정리
  }, [stopTTS]);

  const toastStyle = {
    fontSize: "13px",
    padding: "6px 10px",
    borderRadius: "8px",
    background: "#f4f4f5",
    color: "#111",
    boxShadow: "none",
  };

  const Content = styled.div`
    font-size: ${() => getFontSize(14)}px !important;
    padding : 5px 0px;
  
  
  `

  const handleListenClick = (e) => {
    e.stopPropagation();

    // 토글 정지
    if (ttsPlaying) {
      stopTTS();
      return;
    }

    // 1) mp3 있으면 Audio 사용
    if (ttsUrl) {
      const audio = new Audio(ttsUrl);

      const toastId = toast.loading("🎧 음성 준비 중입니다...", { duration: Infinity, style: toastStyle });

      audio.onloadeddata = () => {
        toast.dismiss(toastId);
        const playToastId = toast("🎧 음성을 재생 중입니다...", { duration: Infinity, style: toastStyle });
        setTtsPlaying(true);
        audio.play();
        audio.onended = () => {
          setTtsPlaying(false);
          toast.dismiss(playToastId);
        };
      };

      audio.onerror = () => {
        toast.dismiss(toastId);
        toast.error("음성 재생에 실패했습니다 😢");
      };
      return;
    }

    // 2) mp3 없으면 브라우저 스피치
    if (!previewText) {
      toast.info("메모를 먼저 입력해 주세요");
      return;
    }
    try {
      const synth = window.speechSynthesis;
      if (!synth) {
        toast.error("브라우저에서 음성을 지원하지 않아요");
        return;
      }
      const t = toast.loading("🎧 브라우저로 읽어드려요...", { duration: Infinity, style: toastStyle });
      const u = new SpeechSynthesisUtterance(previewText);
      u.lang = "ko-KR"; u.rate = 1;
      u.onend = () => { setTtsPlaying(false); toast.dismiss(t); };
      u.onerror = () => { setTtsPlaying(false); toast.dismiss(t); toast.error("음성 재생에 실패했습니다 😢"); };
      setTtsPlaying(true);
      synth.speak(u);
    } catch {
      toast.error("음성 재생에 실패했습니다 😢");
    }
  };

  const handleClose = () => {
    stopTTS();
    setOpen(false);
    callback?.(data);
  };

  const _handleReqComplete = () => {
    stopTTS();
    setOpen(false);
    requestcallback?.();
  };

  const formatPrice = (v) =>
    typeof v === "number" && !isNaN(v) ? `${v.toLocaleString("ko-KR")}원` : String(v ?? "")

  const canPreview = Boolean(ttsUrl || previewText);

  return (
    <div>
      {open && (
        <ModalWrapper
          title="고객님이 작성하신 요구사항입니다"
          onClose={handleClose}
          onSubmit={_handleReqComplete}
          submitLabel="요청하기"
        >
          {/* ── 프리뷰: 이미지 + 듣기 버튼 */}
          <Column>
            <ImgBox>
              <ImgThumb src={imageUrl || imageDB.hirecharacter} alt="" />
              {!imageUrl && <ImgBadge>등록 후 자동 생성</ImgBadge>}
            </ImgBox>

            <FlexEndColumn>
              <ListenButton
                onClick={handleListenClick}
                aria-disabled={!canPreview}
                aria-pressed={ttsPlaying}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleListenClick(e);
                }}
              >
                {ttsPlaying ? "⏸ 일시정지" : "🎧 AI 요약 듣기"}
              </ListenButton>
            </FlexEndColumn>
          </Column>

          <MiniHr />

          {/* ── 요약 표 */}
          <div style={{ width: "100%", margin: "0 auto" }}>
            <div>
              {messages?.map((row, idx) => (
                <React.Fragment key={idx}>
                  {row.type === "response" && (
                    <Row style={{ width: "100%", borderBottom: "1px solid #ededed" }}>
                      <Property>{row.requesttype}</Property>
                      <FlexstartRow
                        style={{
                          width: "60%",
                          fontSize: getFontSize(14),
                          fontFamily: "Pretendard-Regular",
                          whiteSpace: row.requesttype === "요청메모" ? "pre-wrap" : "normal",
                        }}
                      >
                        <Content>
                          {row.requesttype === "금액" ? formatPrice(row.result) : row.result}
                        </Content>
                      </FlexstartRow>
                    </Row>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

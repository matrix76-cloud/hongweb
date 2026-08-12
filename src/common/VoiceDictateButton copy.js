// src/components/common/VoiceDictateButton.js
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled, { keyframes, css } from "styled-components";
// ⬇️ 기존 이미지 자원 그대로 유지
import { imageDB } from "../utility/imageData";

/**
 * VoiceDictateButton (WebView 전용)
 * - 기존 UI/스타일 그대로 유지
 * - 로직만 RN 브리지로 교체:
 *    Web→RN:  VOICE_START / VOICE_STOP
 *    RN→Web:  VOICE_PARTIAL / VOICE_FINAL
 */
export default function VoiceDictateButton({
  mode = "toggle",      // "toggle" | "press"
  size = 36,
  color = "#3182f6",
  onPartial,
  onFinal,
  onStart,
  onStop,
}) {
  const [listening, setListening] = useState(false);
  const pressedRef = useRef(false); // 터치/마우스 중복 방지

  // RN → Web 결과 수신
  useEffect(() => {
    const onMsg = (e) => {
      try {
        const data = JSON.parse(e?.data ?? "{}");
        if (!data?.type) return;

        if (data.type === "VOICE_PARTIAL") {
          onPartial?.(data.text || "");
        } else if (data.type === "VOICE_FINAL") {
          onFinal?.(data.text || "");
          setListening(false); // 최종 결과 오면 종료 상태로
        }
      } catch (err) {
        console.warn("❌ Voice message parse error:", err);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onPartial, onFinal]);

  // Web → RN 브리지
  const sendToRN = (type, payload = {}) => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type, ...payload }));
  };

  const start = () => {
    sendToRN("VOICE_START", { lang: "ko-KR" });
    setListening(true);
    onStart?.();
  };
  const stop = () => {
    sendToRN("VOICE_STOP");
    setListening(false);
    onStop?.();
  };

  const pressProps =
    mode === "press"
      ? {
          onMouseDown: () => {
            if (!pressedRef.current) {
              pressedRef.current = true;
              start();
            }
          },
          onMouseUp: () => {
            pressedRef.current = false;
            stop();
          },
          onTouchStart: () => {
            if (!pressedRef.current) {
              pressedRef.current = true;
              start();
            }
          },
          onTouchEnd: () => {
            pressedRef.current = false;
            stop();
          },
        }
      : {
          onClick: () => {
            if (listening) stop();
            else start();
          },
        };

  const iconSize = Math.round(size * 0.56);

  return (
    <MicBtn
      aria-label={listening ? "음성 입력 종료" : "음성 입력 시작"}
      $size={size}
      $on={listening}
      $color={color}
      {...pressProps}
    >
      {/* ⬇️ 기존 UI 유지 */}
      <img
        src={imageDB.mic}
        alt=""
        width="100%"
        height="100%"
        decoding="async"
        draggable={false}
        style={{ pointerEvents: "none", position: "absolute", inset: 0 }}
      />
      <img
        src={listening ? imageDB.micon : imageDB.micoff}
        alt=""
        width={iconSize}
        height={iconSize}
        decoding="async"
        draggable={false}
        style={{ pointerEvents: "none" }}
      />

      {/* 접근성: 상태 안내 */}
      <SrOnly aria-live="polite">
        {listening ? "듣는 중" : "대기"}
      </SrOnly>
    </MicBtn>
  );
}

VoiceDictateButton.propTypes = {
  mode: PropTypes.oneOf(["toggle", "press"]),
  size: PropTypes.number,
  color: PropTypes.string,
  onPartial: PropTypes.func,
  onFinal: PropTypes.func,
  onStart: PropTypes.func,
  onStop: PropTypes.func,
};

/* ================= styles ================= */

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
  10%  { box-shadow: 0 0 0 0 var(--pulse); }
  70%  { box-shadow: 0 0 0 16px rgba(0,0,0,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
`;

/* withConfig 호환 이슈 회피: 래퍼로 커스텀 prop 제거 */
const MicBtnBase = ({ $size, $on, $color, ...rest }) => <div {...rest} />;

const MicBtn = styled(MicBtnBase)`
  position: relative;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 999px;

  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background .2s, border-color .2s, color .2s;

  ${p => css`
    --active: ${p.$color || "#3182f6"};
    --pulse: ${hexToRgba(p.$color || "#3182f6", 0.35)};
  `}

  ${p => p.$on && css`
    background: var(--active);
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 999px;
      animation: ${pulse} 1.4s ease-out infinite;
    }
  `}
`;

const SrOnly = styled.span`
  position: absolute !important;
  clip: rect(1px,1px,1px,1px);
  clip-path: inset(50%);
  height: 1px; width: 1px; overflow: hidden; white-space: nowrap;
`;

/* HEX -> rgba */
function hexToRgba(hex, a = 1) {
  const h = (hex || "#3182f6").replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// src/components/common/VoiceDictateButton.js
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled, { keyframes, css } from "styled-components";
import { imageDB } from "../utility/imageData";

/**
 * VoiceDictateButton (WebView 전용)
 * - Web → RN : VOICE_START / VOICE_STOP
 * - RN  → Web: VOICE_PARTIAL / VOICE_FINAL
 * - UI: 네모 박스 제거, 원형 버튼 + 아이콘 크게
 */
export default function VoiceDictateButton({
    mode = "toggle",      // "toggle" | "press"
    size = 36,            // 아이콘 크기(px)
    color = "#3182f6",    // 듣는 중 배경색(펄스)
    onPartial,
    onFinal,
    onStart,
    onStop,
}) {
    const [listening, setListening] = useState(false);
    const pressedRef = useRef(false);

    // RN → Web 결과 수신
    useEffect(() => {
        const onMsg = (e) => {
            try {
                const data = JSON.parse(e?.data ?? "{}");
                if (!data?.type) return;
                if (data.type === "VOICE_PARTIAL") onPartial?.(data.text || "");
                if (data.type === "VOICE_FINAL") {
                    onFinal?.(data.text || "");
                    setListening(false);
                }
            } catch (err) {
                console.warn("❌ Voice message parse error:", err);
            }
        };
        window.addEventListener("message", onMsg);
        return () => window.removeEventListener("message", onMsg);
    }, [onPartial, onFinal]);

    const sendToRN = (type, payload = {}) =>
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type, ...payload }));

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

    // 버튼(터치 영역)은 아이콘보다 약간 크게
    const buttonSize = size + 12;
    const iconSize = size;

    return (
        <MicBtn
            type="button"
            aria-label={listening ? "음성 입력 종료" : "음성 입력 시작"}
            $size={buttonSize}
            $on={listening}
            $color={color}
            {...pressProps}
        >
            {/* 바깥 원형 버튼 배경(네모박스 제거) + 펄스 효과 */}
            {/* 중앙 마이크 아이콘 — 기존 이미지 자원 그대로 */}
            <img
                src={listening ? imageDB.micon : imageDB.micoff}
                alt=""
                width={iconSize}
                height={iconSize}
                decoding="async"
                draggable={false}
                style={{ pointerEvents: "none" }}
            />
            <SrOnly aria-live="polite">{listening ? "듣는 중" : "대기"}</SrOnly>
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

/* 버튼 기본 스타일 제거하고 원형만 유지 */
const MicBtnBase = ({ $size, $on, $color, ...rest }) => <button {...rest} />;
const MicBtn = styled(MicBtnBase)`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  border-radius: 50%;
  position: relative;

  ${(p) => css`
    --active: ${p.$color || "#3182f6"};
    --pulse: ${hexToRgba(p.$color || "#3182f6", 0.35)};
  `}

  ${(p) =>
        p.$on &&
        css`
      background: var(--active);
      &::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
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
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

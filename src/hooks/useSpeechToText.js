import { useEffect, useRef, useState } from "react";

/**
 * 간단 STT 훅 (Web Speech API)
 * - iOS Safari 안정화: 10~12초 세션 자동종료 후 재시작
 * - onPartial: 말하는 중간 결과
 * - onFinal: 최종 결과 (후처리 포함)
 */
export function useSpeechToText({ lang = "ko-KR", sessionMs = 12000, interim = true } = {}) {
    const [supported, setSupported] = useState(false);
    const [listening, setListening] = useState(false);
    const recRef = useRef(null);
    const timerRef = useRef(null);
    const onPartialRef = useRef(null);
    const onFinalRef = useRef(null);

    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;
        setSupported(true);

        const rec = new SR();
        rec.lang = lang;
        rec.interimResults = interim;
        rec.continuous = true;

        rec.onresult = (e) => {
            let interimText = "", finalText = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const t = e.results[i][0].transcript;
                if (e.results[i].isFinal) finalText += t;
                else interimText += t;
            }
            if (interimText && onPartialRef.current) onPartialRef.current(interimText);
            if (finalText && onFinalRef.current) onFinalRef.current(postprocess(finalText));

            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => stop(), sessionMs); // iOS 세션 안정화
        };

        rec.onerror = () => setListening(false);
        rec.onend = () => {
            // 토글 ON 상태에서만 자동 재시작
            if (listening) {
                try { rec.start(); } catch { }
            }
        };

        recRef.current = rec;

        // 권한 프리워밍 (팝업 최소화)
        try { rec.start(); setTimeout(() => rec.stop(), 60); } catch { }
  
    }, []);

    function start({ onPartial, onFinal } = {}) {
        if (!supported || listening) return;
        onPartialRef.current = onPartial || null;
        onFinalRef.current = onFinal || null;
        setListening(true);
        try { recRef.current && recRef.current.start(); } catch { }
    }

    function stop() {
        setListening(false);
        clearTimeout(timerRef.current);
        try { recRef.current && recRef.current.stop(); } catch { }
    }

    return { supported, listening, start, stop };
}

function postprocess(s) {
    return s
        .trim()
        .replace(/\b(어|음|그|저기|그러니까)\b/g, "")
        .replace(/\s{2,}/g, " ");
}

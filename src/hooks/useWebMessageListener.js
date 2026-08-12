import { useEffect } from "react";
import { postLog } from "../utility/common";

/**
 * WebView에서 React Native 메시지를 수신하는 훅 (iOS + Android 모두 대응)
 * 파싱 오류 방지 및 JSON 유효성 체크 포함
 */



const useWebMessageListener = (callback) => {
  useEffect(() => {
    const isValidJson = (str) => {
      try {
        JSON.parse(str);
        return true;
      } catch {
        return false;
      }
    };

    const handler = (event) => {
      try {
        const raw = event.data;
        const parsed =
          typeof raw === "string" && isValidJson(raw)
            ? JSON.parse(raw)
            : typeof raw === "object"
            ? raw
            : null;

        if (!parsed) throw new Error("파싱 불가");

        postLog("📦 메시지 수신: " + JSON.stringify(parsed));

        callback(parsed); // ✅ payload 분리 없이 그대로 넘김
      } catch (e) {
        postLog("❌ 파싱 실패: " + e.message);
      }
    };

    window.addEventListener("message", handler);
    document.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
      document.removeEventListener("message", handler);
    };
  }, [callback]);
};


export default useWebMessageListener;
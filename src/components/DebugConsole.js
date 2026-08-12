import React, { useEffect, useState } from "react";

const DebugConsole = () => {
  const [logs, setLogs] = useState([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      const timestamp = new Date().toLocaleTimeString();
      const logMsg = typeof event.data === "string" ? event.data : JSON.stringify(event.data);

      setLogs((prev) => [...prev.slice(-49), `[${timestamp}] 📡 ${logMsg}`]); // 최근 50줄 유지
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <>
    <button
    onClick={() => setShowDebug((prev) => !prev)}
    style={{
    position: "fixed",
    bottom: "10px",
    right: "10px",
    zIndex: 10000,
    padding: "6px 12px",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px"
    }}
    >
    {showDebug ? "🔽 닫기" : "🔍 디버그"}
    </button>
   {showDebug && <div style={{
        position: "fixed",
        top: 100,
        right: 0,
        background: "rgba(0,0,0,0.8)",
        color: "#0f0",
        fontSize: "12px",
        fontFamily: "monospace",
        padding: "8px",
        width: "100%",
        maxHeight: "300px",
        overflowY: "auto",
        zIndex: 9999
    }}>
        <div>🧪 DEBUG CONSOLE SYSEMT</div>
        <div id="debug-console-content" /> {/* ✅ 혹시 빠졌으면 강제 추가 */}
        {logs.map((log, idx) => (
        <div key={idx}>{log}</div>
        ))}
    </div>}
    </>

  );
};

export default DebugConsole;

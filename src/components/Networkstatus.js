import React from "react";
import { useNetworkState } from "react-use";
import { getFontSize } from "../utility/fontsize";

const NetworkStatus = () => {
    const { online } = useNetworkState();

    return (
        <>
            {online == false && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <div style={{fontFamily:"Pretendard-SemiBold", fontSize: () => getFontSize(25)}}>⚠️ 네트워크 오류</div>
                        <p>인터넷 연결이 끊어졌습니다.</p>
                        <p>네트워크를 확인해주세요.</p>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "50px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    },
};

export default NetworkStatus;

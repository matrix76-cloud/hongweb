import React from 'react';
import { getFontSize } from '../utility/fontsize';
import { LIFEMENU } from '../utility/life';
import { useNavigate } from 'react-router-dom';

const GameResultModal = ({
  callback,
  resulttype,
  minutes,
  remainingSeconds,
  formattedTime,
  rank,
  GameCount,
  length,
}) => {

  const navigate = useNavigate();
  
  const _handleRank = () => {
    navigate("/Mobileconfigcontent", { state: { NAME: LIFEMENU.GAMERANK } });
  }
  
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>기록이 저장되었어요!</h2>
        <p style={styles.time}>⏱ 기록:{formattedTime}초</p>
        {/* <p style={styles.rank}>🥇 현재 등수: {rank}위</p> */}

        <div style={styles.buttonGroup}>
          <button onClick={callback} style={styles.closeButton}>닫기</button>
          <button onClick={_handleRank} style={styles.rankButton}>등수 보러가기</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',   // 👈 여기!
    paddingTop: '20vh',         // 👈 여기!
    zIndex: 1000,
  },
  card: {
    width: 240,
    height: 240,
    borderRadius: '50%',
    backgroundColor: '#fff',
    border: '3px solid #FFD700',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',  // 👈 내용 위로 정렬
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    paddingTop: 25,                // 👈 내용 시작 위치 확보
  },
  title: {
    fontSize: getFontSize(22),
    fontWeight: 'bold',
    marginBottom: 12,
  },
  time: {
    fontSize: getFontSize(18),
    marginBottom: 6,
  },
  rank: {
    fontSize: getFontSize(18),
    marginBottom: 20,
  },
  buttonGroup: {
    display: 'flex',
    gap: 10,
  },
  rankButton: {
    padding: '8px 14px',      // 👈 이전 10px 16px
    borderRadius: 16,
    border: 'none',
    backgroundColor: '#007AFF',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: getFontSize(13),
  },
  closeButton: {
    padding: '8px 14px',
    borderRadius: 16,
    border: 'none',
    backgroundColor: '#f0f0f0',
    color: '#333',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: getFontSize(13),
  },
};

export default GameResultModal;

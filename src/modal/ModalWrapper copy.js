import React, { useRef, useState } from 'react';
import './ModalWrapper.css';
import { getFontSize } from '../utility/fontsize';
import HongButton from '../components/HongButton';

const ModalWrapper = ({ title, children, onClose, onSubmit, submitLabel = '확인' }) => {

  const overlayRef = useRef();
  const [loading, setLoading] = useState(false); // ✅ 버튼 로딩 상태

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose(); // 바깥 클릭 시 닫힘
    }
  };

  return (
  <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title" style={{ fontSize: getFontSize(18) }}>{title}</div>
          <button className="modal-close" style={{fontSize:getFontSize(30)}} onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {children}
        </div>

        <div className="modal-actions">
          {/* <button className="modal-submit" onClick={onSubmit}>{submitLabel}</button> */}

     
          <HongButton variant="primary" disabled={loading} fullWidth onClick={onSubmit}>
            {loading ? "처리 중..." : (<>{submitLabel}</>)}
          </HongButton>


        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;

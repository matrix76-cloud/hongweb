import React, { useRef } from 'react';
import './ModalWrapper.css';

const ModalWrappermin = ({ title, children, onClose}) => {

  const overlayRef = useRef();

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose(); // 바깥 클릭 시 닫힘
    }
  };

  return (
  <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWrappermin;

import React from 'react';

const LadderResultPopup = ({ result, onClose }) => {
    return (
        <div className="result-popup">
            <div className="popup-inner">
                <h3>🎉 결과</h3>
                <p>{result}</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default LadderResultPopup;
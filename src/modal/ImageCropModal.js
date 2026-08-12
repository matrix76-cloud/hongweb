// ImageCropModal.js
import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utility/cropImage';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 90vw;
  max-width: 400px;
  height: 480px;
  background: #fff;
  border-radius: 12px;
  transform: translate(-50%, -50%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1001;
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const ConfirmButton = styled.button`
  flex: 1;
  background: #ff7e19;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
`;

const RotateButton = styled.button`
  flex: 1;
  background: #ddd;
  color: #000;
  border: none;
  padding: 10px;
  border-radius: 8px;
`;

const ImageCropModal = ({ open, file, onClose, onConfirm, isCircle = false }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageKey, setImageKey] = useState(0); // 🔁 리셋 트리거용

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleConfirm = async () => {
        const blob = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels, rotation);
        const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });
        onConfirm(croppedFile);
        onClose();
    };

    useEffect(() => {
        if (open) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setCroppedAreaPixels(null);
            setImageKey(prev => prev + 1); // ✅ 매번 새 Cropper 로드
        }
    }, [open, file]);

    if (!open || !file) return null;

    return ReactDOM.createPortal(
        <>
            <Overlay onClick={onClose} />
            <ModalContainer>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Cropper
                        key={imageKey} // ✅ 강제 재렌더링
                        image={URL.createObjectURL(file)}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        cropShape={isCircle ? 'round' : 'rect'}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <Footer>
                    <RotateButton onClick={() => setRotation((prev) => prev + 90)}>회전</RotateButton>
                    <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
                </Footer>
            </ModalContainer>
        </>,
        document.body
    );
};

export default ImageCropModal;

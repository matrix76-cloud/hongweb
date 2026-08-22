import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ALLREFRESH, RESET } from '../../store/menu/MenuSlice';
import MobileConfirmPopup from '../MobileConfirmPopup/MobileConfirmPopup';

/**
 * 예전엔 MUI Modal + react-spring 으로 따로 그렸다(회색 띠 버튼, 주황 글씨).
 * 이제 공통 창(MobileConfirmPopup)을 그대로 쓴다 — 모양은 거기서만 고친다. (형 리뷰 2026-08-22)
 * 호출 방식은 그대로: <MobileFailPopup callback={...} content="..." />
 */
export default function MobileFailPopup({ callback, content }) {
  const reduxdispatch = useDispatch();

  useEffect(() => { reduxdispatch(RESET()); }, []);

  const handleClose = () => {
    reduxdispatch(ALLREFRESH());
    callback?.([]);
  };

  return <MobileConfirmPopup alertonly icon="fail" message={content} onConfirm={handleClose} />;
}

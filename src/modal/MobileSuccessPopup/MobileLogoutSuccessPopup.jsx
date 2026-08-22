import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RESET } from '../../store/menu/MenuSlice';
import MobileConfirmPopup from '../MobileConfirmPopup/MobileConfirmPopup';

/**
 * 로그아웃 완료 — 공통 창(MobileConfirmPopup)을 쓴다. (형 리뷰 2026-08-22)
 * 닫으면 로그인 화면으로 보낸다 (형 지시 2026-08-13).
 */
export default function MobileLogoutSuccessPopup({ callback, content }) {
  const reduxdispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { reduxdispatch(RESET()); }, []);

  const handleClose = () => {
    navigate('/Mobilelogin');
    callback?.([]);
  };

  return <MobileConfirmPopup alertonly icon="success" message={content} onConfirm={handleClose} />;
}

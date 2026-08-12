import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PiLockKeyLight } from "react-icons/pi";
import { DataContext } from '../context/Data';
import { toast } from 'sonner';
import { sleep } from '../utility/common';
import { imageDB } from '../utility/imageData';
import { playSound } from '../utility/sound';

function RotateCard({
  image,
  index,
  item,
  items,
  setItems,
  callback,
  handleBombBlack,
  handleBombRed,
  bombRedUsed,
  bombRedActive,
  allowClick,
  setAllowClick
}) {
  const { datadispatch, data } = useContext(DataContext);
  const isFlip = item.open;

  const toggleFlip = async () => {
    if (item.open || !allowClick) return;

    // 빨간 지뢰 처리
    if (item.image === imageDB.bombred) {
      if (bombRedUsed) {
        item.autoOpen = false;
        updateItem(item.id, true);
        await sleep(500);
        updateItem(item.id, false);
        setAllowClick(true);
        return;
      }

      console.log(`[💥 빨간 지뢰 발동]`);
      updateItem(item.id, true);

      // ✅ 놀리는 사운드 (예: 홍여사 웃음소리나 "또 섞어볼까~?" 같은 음성)
      playSound("Reclassification.mp3", { volume: 0.9, duration: 1400 });

      // ✅ 카드 흔들림 + 셔플 효과 → 최대한 길게 유지
      await handleBombRed?.(item.id); // 이 안에서 setItems(shuffle(...)) 반복되도록 구현
      await sleep(3000); // ⏱️ 놀리는 연출 길게 유지

      item.autoOpen = false;
      updateItem(item.id, true); // 열린 채 유지
      setBombRedUsed(true);
      setAllowClick(true);
      return;
    }

    // 검은 지뢰 처리
    if (item.image === imageDB.bombblack) {
      playSound("init.wav", { volume: 0.9, duration: 1000 });
      updateItem(item.id, true);
      await sleep(500);
      setTimeout(() => {
        handleBombBlack?.();
      }, 1300);
      return;
    }

    // 일반 카드 처리
    setAllowClick(false);
    updateItem(item.id, true);

    const opened = data?.gameitems || [];
    if (opened.some(x => x.id === item.id)) {
      setAllowClick(true);
      return;
    }

    if (opened.length >= 2) {
      data.gameitems = [item];
      datadispatch(data);
      setAllowClick(true);
      return;
    }

    if (opened.length === 1) {
      const first = opened[0];
      if (first.id === item.id) {
        setAllowClick(true);
        return;
      }

      data.gameitems.push(item);
      datadispatch(data);
      await sleep(500);

      const isMatch = first.index === item.index;
      if (isMatch) {
        playSound("success.mp3", { volume: 0.9, duration: 700 });
        callback(true, data.gameitems.length === 18); // 총 9쌍 = 18장 매칭
      } else {
        playSound("fail.mp3", { volume: 0.9, duration: 700 });
        updateItem(item.id, false);
        data.gameitems = [first];
        datadispatch(data);
        callback(false, false);
      }
      await sleep(200);
      setAllowClick(true);
      return;
    }

    data.gameitems = [item];
    datadispatch(data);
    setAllowClick(true);
  };

  const updateItem = (targetId, openValue) => {
    setItems(prev =>
      prev.map(x => x.id === targetId ? { ...x, open: openValue } : x)
    );
  };

  useEffect(() => {
    const isBomb = item.image === imageDB.bombblack || item.image === imageDB.bombred;
    if (isBomb && !item.open && item.autoOpen) {
      (async () => {
        setAllowClick(false);
        updateItem(item.id, true);
        await sleep(1300);
        updateItem(item.id, false);
        await sleep(50);
        setAllowClick(true);
      })();
    }
  }, []);

  return (
    <div style={{ perspective: '1000px', margin: "6px" }}>
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{
          rotateY: isFlip ? 180 : 0,
          rotate: bombRedActive && !isFlip ? [0, 15, -15, 0] : 0,
        }}
        transition={{ duration: bombRedActive && !isFlip ? 0.4 : 0.25 }}
        style={{
          width: '70px',
          height: '70px',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            backfaceVisibility: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            color: 'black',
            cursor: 'pointer'
          }}
          onClick={toggleFlip}
        >
          <PiLockKeyLight size={22} />
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            backfaceVisibility: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            color: 'black',
            cursor: 'pointer',
            transform: 'rotateY(180deg)',
          }}
        >
          <img src={image} style={{ width: 60 }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RotateCard;

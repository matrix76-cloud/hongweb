// ✅ RotateCard.jsx - 음향 반응 속도 개선 + 중복 실행 방지 적용

import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PiLockKeyLight } from "react-icons/pi";
import { DataContext } from '../context/Data';
import { toast } from 'sonner';
import { sleep } from '../utility/common';
import { imageDB } from '../utility/imageData';
import { playSound } from '../utility/sound';


const screenWidth = window.innerWidth;
const cardSize = (screenWidth - 48) / 4; // 4열 기준, 좌우 padding 포함 여유 있음


function RotateCard({
  image,
  index,
  item,
  items,
  setItems,
  rowIndex,
  columnIndex,
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

    // ✅ 빨간 지뢰 처리
    if (item.image === imageDB.bombred) {
      if (bombRedUsed) {
        item.autoOpen = false;
        updateItem(item.id, true);
        await sleep(500);
        updateItem(item.id, false);
        setAllowClick(true);
        return;
      }

      setAllowClick(false); // 🔒 클릭 막기 시작

      updateItem(item.id, true); // 🔓 지뢰 열기
      playSound("bombshuffle.mp3", { volume: 0.9, duration: 1200 });
      await sleep(800);

      await handleBombRed?.(item.id); // 🔄 셔플 진행 (약 1~2초 예상)

      // 🔐 셔플 끝난 뒤 지뢰 열린 상태 유지
      updateItem(item.id, true);

      // ✅ 셔플 완료 후에만 다시 클릭 가능
      setAllowClick(true);
      return;
    }


    // ✅ 검은 지뢰 처리
    if (item.image === imageDB.bombblack) {
      updateItem(item.id, true);
      // ✅ 사운드 먼저 재생 후 sleep
      playSound("init.wav", { volume: 0.9, duration: 1000 });
      await sleep(500);

      setTimeout(() => {
        handleBombBlack?.();
      }, 1000);
      return;
    }

    // ✅ 일반 카드 처리
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

      await sleep(300);
      const isMatch = first.index === item.index;

      if (isMatch) {

        playSound("success.mp3", { volume: 0.9, duration: 700 });

        // 🔒 강제 open 처리
        const updated = items.map(x => {
          if (x.id === first.id || x.id === item.id) {
            return { ...x, open: true };
          }
          return x;
        });

        setItems(updated);

        await sleep(300); // 렌더링 반영 기다림

        // ✅ 여기서 최신 상태 기반으로 matchedCount 직접 계산
        const matchedCount = updated.filter(x =>
          x.open &&
          x.image !== imageDB.bombred &&
          x.image !== imageDB.bombblack
        ).length;

        console.log("💯 완전방어 matchedCount:", matchedCount);

        callback(true, matchedCount === 18, rowIndex, columnIndex);



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
    <div
      id={`card-col-${columnIndex}`} 
      style={{
      perspective: '1000px', margin: "3px", width: cardSize,
      height: cardSize, }}>
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{
          rotateY: isFlip ? 180 : 0,
          rotate: bombRedActive && !isFlip ? [0, 15, -15, 0] : 0,
        }}
        transition={{ duration: bombRedActive && !isFlip ? 0.4 : 0.18 }}
        style={{
          width: '100%',
          height: '100%',
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

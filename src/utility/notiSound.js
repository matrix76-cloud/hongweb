// 알림음 — 내 정보 > 앱 설정 > 알림음 설정 (형 지시 2026-08-22, 도우미 앱과 같은 방식)
//
// 고른 값(key)은 USERS 문서 notisound 에 저장되고, 푸시를 보낼 때(functions/fcm.js) 그 소리로 울린다.
//   안드로이드: 앱이 만들어 둔 채널 `sound_<key>` 로 보낸다 (res/raw/<key>.mp3)
//   iOS:       `<key>.caf` 를 번들에 싣는다
// file 은 웹에서 미리듣기용(public/sounds/noti/). 'system'(기기 기본음)은 웹에서 들려줄 수 없다.
// pending 은 음원 파일이 아직 없는 항목 — 고를 수는 있지만 미리듣기가 안 된다.

import localforage from 'localforage';

export const NOTI_SOUNDS = [
  // 홍여사 음원 = 유나(맥 TTS) "홍여사 알림이에요" 5번 시안, 형 확정 2026-08-22 (/soundlab). 원본 제작 파일: public/sounds/noti/cand/
  { key: 'honglady', label: '홍여사 알림음', desc: '"홍여사 알림이에요" — 구해줘 홍여사 기본 소리', file: '/sounds/noti/honglady.mp3' },
  { key: 'bell',     label: '벨',           desc: '짧고 또렷한 종소리',       file: '/sounds/noti/bell.mp3' },
  { key: 'chime',    label: '차임',         desc: '맑은 두 음',               file: '/sounds/noti/chime.mp3' },
  { key: 'soft',     label: '부드러운 소리', desc: '조용한 곳에서도 거슬리지 않게', file: '/sounds/noti/soft.mp3' },
  { key: 'system',   label: '기기 기본음',   desc: '휴대폰에 설정된 알림음 그대로', file: null },
];

export const DEFAULT_NOTI_SOUND = 'honglady';
const STORE_KEY = 'hong.noti.sound';

export const isNotiSound = (key) => NOTI_SOUNDS.some((s) => s.key === key);
export const notiSoundLabel = (key) => NOTI_SOUNDS.find((s) => s.key === key)?.label || NOTI_SOUNDS[0].label;

/** 계정에 저장된 값 > 이 기기에 남은 값 > 기본값 */
export const loadNotiSound = async (user) => {
  if (isNotiSound(user?.notisound)) return user.notisound;
  try {
    const v = await localforage.getItem(STORE_KEY);
    if (isNotiSound(v)) return v;
  } catch { /* noop */ }
  return DEFAULT_NOTI_SOUND;
};

export const rememberNotiSound = async (key) => {
  try { await localforage.setItem(STORE_KEY, key); } catch { /* noop */ }
};

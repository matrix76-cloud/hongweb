// 일감 시드 데이터 — WORK 컬렉션에 카테고리별로 골고루 넣는다.
//   node scripts/seed_work.mjs          기존 시드 지우고 새로 넣기
//   node scripts/seed_work.mjs --clean  시드만 지우기
//
// 시드는 USERS_ID 가 'seed_' 로 시작해 나중에 골라서 지울 수 있다.
import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const require = createRequire(import.meta.url);
const serviceAccount = require('../functions/serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// 기준 좌표 — 목록이 5km 컷이라 "보는 사람 근처"에 뿌려야 화면에 뜬다.
//   node scripts/seed_work.mjs --lat 37.4923 --lng 127.0292   (예: 서초동)
// 기본값은 피그마 기본 지역인 남양주시 다산동.
const argv = process.argv;
const argOf = (k, d) => {
  const i = argv.indexOf(k);
  return i !== -1 && argv[i + 1] ? parseFloat(argv[i + 1]) : d;
};
const BASE = { lat: argOf('--lat', 37.6115), lng: argOf('--lng', 127.1560) };
const near = (i) => ({
  lat: BASE.lat + (Math.sin(i * 2.7) * 0.018),
  lng: BASE.lng + (Math.cos(i * 1.9) * 0.022),
});
const ADDRS = [
  '경기도 남양주시 다산동', '경기도 남양주시 지금동', '경기도 남양주시 도농동',
  '경기도 남양주시 별내동', '경기도 남양주시 화도읍', '경기도 남양주시 진접읍',
];

const r = (arr, i) => arr[i % arr.length];
const DAY = 24 * 60 * 60 * 1000;

// [카테고리, 금액, 조건칩들]
const SEEDS = [
  ['집 청소',      '150,000', ['정기적', '오후시간대', '3시간', '아파트 · 30평대', '없음', '집에 있어요']],
  ['집 청소',      '90,000',  ['1회만', '오전시간대', '4시간', '빌라 · 20평대', '강아지', '홍여사가 준비해주세요']],
  ['집 청소',      '200,000', ['정기적', '하루종일', '단독주택 · 40평대', '고양이', '집에 있어요']],
  ['사무실 청소',  '250,000', ['정기적', '오후시간대', '엘리베이터 있음', '20평대']],
  ['사무실 청소',  '120,000', ['1회만', '오전시간대', '2~3층 계단', '10평대']],
  ['이사 청소',    '350,000', ['1회만', '이사 전 (빈집)', '아파트 · 30평대', '하루종일']],
  ['이사 청소',    '280,000', ['1회만', '이사 후 (짐 있음)', '빌라 · 20평대']],
  ['식사 준비',    '60,000',  ['정기적', '3~4인', '재료 있어요', '오후시간대']],
  ['식사 준비',    '80,000',  ['1회만', '5인 이상', '장보기부터 해주세요']],
  ['장봐주기',     '40,000',  ['1회만', '5만원 이하', '미리 전달', '오전시간대']],
  ['짐 나르기',    '100,000', ['1회만', '엘리베이터 있음', '방 하나 분량']],
  ['심부름',       '30,000',  ['1회만', '도보 가능', '오후시간대']],
  ['아이돌봄',     '120,000', ['정기적', '4~6세', '1명', '오후시간대']],
  ['아이돌봄',     '150,000', ['정기적', '1~3세', '2명', '하루종일']],
  ['등원하원',     '70,000',  ['정기적', '미취학', '등하원 모두']],
  ['아이레슨',     '200,000', ['정기적', '영어', '초등', '오후시간대']],
  ['학교행사',     '50,000',  ['1회만', '녹색어머니', '오전시간대']],
  ['간병하기',     '180,000', ['정기적', '부축 필요', '집', '하루종일']],
  ['병원가기',     '80,000',  ['1회만', '휠체어', '접수·수납까지']],
  ['애견산책',     '35,000',  ['정기적', '소형견', '1마리', '오전시간대']],
  ['애견 병원',    '55,000',  ['1회만', '중형견', '1마리']],
];

// 앱이 저장하는 WORK_INFO 와 같은 형식으로 만든다.
// 상세 화면(MobileWorkReport)이 type==='response' 인 항목만 표에 그리기 때문에
// 이 필드가 없으면 상세가 통째로 비어 보인다. (2026-08-12 형 지적)
const CHIP_TYPES = ['주기', '요청시간대', '대상', '시간과 금액', '홍여사성별과연령대', '일자'];

const buildInfo = (i, price, chips) => {
  const { lat, lng } = near(i);
  const info = [];
  let idx = 0;
  const push = (requesttype, result, extra = {}) => {
    info.push({ type: 'response', responseshow: true, show: true, index: idx++, requesttype, result, ...extra });
  };
  chips.forEach((c, k) => push(CHIP_TYPES[k % CHIP_TYPES.length], c));
  push('금액', price);
  push('지역', `대한민국 ${r(ADDRS, i)}`, { latitude: lat, longitude: lng });
  push('요구사항', '시드 데이터입니다. 실제 요청이 아닙니다.');
  return info;
};

const clean = async () => {
  const snap = await db.collection('WORK').where('USERS_ID', '>=', 'seed_').where('USERS_ID', '<', 'seed`').get();
  if (snap.empty) { console.log('지울 시드 없음'); return 0; }
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`시드 ${snap.size}건 삭제`);
  return snap.size;
};

const seed = async () => {
  const batch = db.batch();
  SEEDS.forEach(([type, price, chips], i) => {
    const ref = db.collection('WORK').doc();
    batch.set(ref, {
      WORK_ID: ref.id,
      USERS_ID: `seed_${String(i + 1).padStart(2, '0')}`,
      WORKTYPE: type,
      WORK_INFO: buildInfo(i, price, chips),
      WORK_STATUS: i % 9 === 8 ? 1 : 0,          // 9건 중 1건은 마감 상태로
      VIEW_COUNT: 8 + ((i * 7) % 45),
      APPLY_COUNT: (i * 3) % 6,
      CREATEDT: Date.now() - (i % 12) * DAY,     // 최근 12일에 흩뿌림
    });
  });
  await batch.commit();
  console.log(`일감 ${SEEDS.length}건 등록`);
};

const main = async () => {
  const onlyClean = process.argv.includes('--clean');
  await clean();
  if (!onlyClean) await seed();

  const total = await db.collection('WORK').get();
  console.log(`WORK 컬렉션 총 ${total.size}건`);
  console.log(`기준 좌표 ${BASE.lat.toFixed(4)}, ${BASE.lng.toFixed(4)} 반경 2km 안에 배치 (목록은 5km 컷)`);
  process.exit(0);
};

main().catch((e) => { console.error('실패:', e.message); process.exit(1); });

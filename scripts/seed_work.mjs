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
// 0.3km ~ 4.5km 사이에 고르게 흩뿌린다.
// 예전엔 반경이 너무 촘촘해 카드마다 "거리 0.002km" 로 똑같이 나왔다 (형 지적 2026-08-12)
const near = (i) => {
  const km = 0.3 + ((i * 1.7) % 4.2);              // 0.3~4.5km
  const angle = (i * 137.5) * (Math.PI / 180);     // 황금각으로 방향 분산
  return {
    lat: BASE.lat + (km / 111) * Math.cos(angle),
    lng: BASE.lng + (km / (111 * Math.cos(BASE.lat * Math.PI / 180))) * Math.sin(angle),
  };
};
const ADDRS = [
  '경기도 남양주시 다산동', '경기도 남양주시 지금동', '경기도 남양주시 도농동',
  '경기도 남양주시 별내동', '경기도 남양주시 화도읍', '경기도 남양주시 진접읍',
];

const r = (arr, i) => arr[i % arr.length];
const DAY = 24 * 60 * 60 * 1000;

// [카테고리, 금액, 조건칩들, 요구사항]
// 요구사항은 실제로 사람이 적을 법한 말로. 아예 안 적은 건(빈 문자열)도 섞는다 —
// 진짜 목록도 길게 쓴 사람, 한 줄만 쓴 사람, 안 쓴 사람이 섞여 있다. (형 리뷰 2026-08-12)
const SEEDS = [
  ['집 청소',      '150,000', ['정기적', '오후시간대', '3시간', '아파트 · 30평대', '없음', '집에 있어요'],
    '주 1회 화요일 오후에 부탁드립니다. 화장실 두 개랑 주방 후드까지 봐주시면 좋겠어요. 세제는 집에 있는 걸로 써주시면 되고, 알레르기가 있어서 향 강한 건 피해주세요. 아이가 어려서 베란다 창틀도 한 번씩 닦아주시면 감사하겠습니다.'],
  ['집 청소',      '90,000',  ['1회만', '오전시간대', '4시간', '빌라 · 20평대', '강아지', '홍여사가 준비해주세요'],
    '강아지가 있어서 털이 많습니다. 청소기 돌리실 때 참고 부탁드려요.'],
  ['집 청소',      '200,000', ['정기적', '하루종일', '단독주택 · 40평대', '고양이', '집에 있어요'], ''],
  ['사무실 청소',  '250,000', ['정기적', '오후시간대', '엘리베이터 있음', '20평대'],
    '직원 퇴근 후 7시 이후에 부탁드립니다. 책상 위 서류는 절대 건드리지 말아주세요. 분리수거는 1층 재활용장에 내려주시면 됩니다.'],
  ['사무실 청소',  '120,000', ['1회만', '오전시간대', '2~3층 계단', '10평대'], '이전 입주 정리 청소입니다.'],
  ['이사 청소',    '350,000', ['1회만', '이사 전 (빈집)', '아파트 · 30평대', '하루종일'],
    '입주 전 빈집이라 짐은 없습니다. 새시 레일이랑 붙박이장 안쪽까지 꼼꼼히 부탁드려요. 열쇠는 관리실에 맡겨두겠습니다.'],
  ['이사 청소',    '280,000', ['1회만', '이사 후 (짐 있음)', '빌라 · 20평대'], ''],
  ['식사 준비',    '60,000',  ['정기적', '3~4인', '재료 있어요', '오후시간대'],
    '어머니가 편찮으셔서 간을 싱겁게 해주셔야 합니다. 국이랑 반찬 세 가지 정도면 충분해요.'],
  ['식사 준비',    '80,000',  ['1회만', '5인 이상', '장보기부터 해주세요'],
    '주말에 손님이 옵니다. 장보기 영수증 주시면 따로 정산해드릴게요.'],
  ['장봐주기',     '40,000',  ['1회만', '5만원 이하', '미리 전달', '오전시간대'], '목록은 문자로 보내드립니다.'],
  ['짐 나르기',    '100,000', ['1회만', '엘리베이터 있음', '방 하나 분량'],
    '원룸에서 원룸으로 옮깁니다. 큰 짐은 냉장고랑 세탁기 두 개고 나머지는 박스입니다. 사다리차는 필요 없습니다.'],
  ['심부름',       '30,000',  ['1회만', '도보 가능', '오후시간대'], ''],
  ['아이돌봄',     '120,000', ['정기적', '4~6세', '1명', '오후시간대'],
    '유치원 하원 후 저녁 7시까지 봐주시면 됩니다. 아이가 낯을 조금 가려서 첫 주는 제가 같이 있을 예정이에요. 간식은 준비해두겠습니다.'],
  ['아이돌봄',     '150,000', ['정기적', '1~3세', '2명', '하루종일'],
    '쌍둥이입니다. 둘 다 아직 기저귀를 뗐어요.'],
  ['등원하원',     '70,000',  ['정기적', '미취학', '등하원 모두'],
    '아침 8시 40분 등원, 오후 4시 하원입니다. 어린이집이 도보 5분 거리예요.'],
  ['아이레슨',     '200,000', ['정기적', '영어', '초등', '오후시간대'], ''],
  ['학교행사',     '50,000',  ['1회만', '녹색어머니', '오전시간대'],
    '아침 8시부터 9시까지 교문 앞 교통지도입니다. 조끼랑 깃발은 학교에서 빌려줍니다.'],
  ['간병하기',     '180,000', ['정기적', '부축 필요', '집', '하루종일'],
    '아버지가 무릎 수술을 받으셔서 화장실 이동에 부축이 필요합니다. 식사는 제가 차려두고 나가니 데워서 드리기만 하면 됩니다. 말벗이 되어주시면 더 좋겠어요.'],
  ['병원가기',     '80,000',  ['1회만', '휠체어', '접수·수납까지'],
    '정형외과 정기 진료입니다. 휠체어는 집에 있습니다.'],
  ['애견산책',     '35,000',  ['정기적', '소형견', '1마리', '오전시간대'], ''],
  ['애견 병원',    '55,000',  ['1회만', '중형견', '1마리'],
    '예방접종 때문에 갑니다. 리드줄 잘 잡아주세요. 다른 개를 보면 흥분하는 편이에요.'],
];

// 앱이 저장하는 WORK_INFO 와 같은 형식으로 만든다.
// 상세 화면(MobileWorkReport)이 type==='response' 인 항목만 표에 그리기 때문에
// 이 필드가 없으면 상세가 통째로 비어 보인다. (2026-08-12 형 지적)
const CHIP_TYPES = ['주기', '요청시간대', '대상', '시간과 금액', '홍여사성별과연령대', '일자'];

const buildInfo = (i, price, chips, comment) => {
  const { lat, lng } = near(i);
  const info = [];
  let idx = 0;
  const push = (requesttype, result, extra = {}) => {
    info.push({ type: 'response', responseshow: true, show: true, index: idx++, requesttype, result, ...extra });
  };
  chips.forEach((c, k) => push(CHIP_TYPES[k % CHIP_TYPES.length], c));
  push('금액', price);
  push('지역', `${r(ADDRS, i)}`, { latitude: lat, longitude: lng });
  // 요구사항은 원래 선택 입력이다. 실제로도 안 적는 사람이 많아 빈 건은 아예 안 넣는다.
  // (형 리뷰 2026-08-12 "진짜 상황에 맞게 · 입력이 많은것도 적은것도 다양하게")
  if (comment) push('요구사항', comment);
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
  SEEDS.forEach(([type, price, chips, comment], i) => {
    const ref = db.collection('WORK').doc();
    batch.set(ref, {
      WORK_ID: ref.id,
      USERS_ID: `seed_${String(i + 1).padStart(2, '0')}`,
      WORKTYPE: type,
      WORK_INFO: buildInfo(i, price, chips, comment),
      WORK_STATUS: i % 9 === 8 ? 1 : 0,          // 9건 중 1건은 마감 상태로
      VIEW_COUNT: 8 + ((i * 7) % 45),
      // 채팅중인 건수는 실제 채팅방에서 센다 — 가짜 숫자를 넣으면 카드의 프로필과 어긋난다 (형 리뷰 2026-08-13)
      APPLY_COUNT: 0,
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

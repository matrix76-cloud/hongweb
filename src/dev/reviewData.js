// 리뷰페이지 데이터 — 도메인별 화면 목록
// 각 화면: { id(전역 유니크), no, name, path(빈 문자열=화면 없음), status, spec:[불릿, ★=핵심] }
// status: done(피그마 반영) / wip(작업중) / todo(기존 화면, 미검수) / none(미구현)
//
// spec 은 형이 2026-08-12 대화에서 정한 초심 기준으로 작성했다. 판단 기준은 CORE.md.

export const ENTRY_REVIEW = [
  { id: 'splash', no: '001', name: '스플래시', path: '/', status: 'todo', spec: [
    '로고 노출 후 자동 전환. 모바일=MobileSplash / PC=PCSplash 분기(768px).',
    '현재 스플래시에서 위치 권한·일감 프리로드를 함께 처리한다.',
  ] },
  { id: 'gate', no: '002', name: '게이트', path: '/Mobilegate', status: 'todo', spec: [
    '가입/로그인 진입점. 현재는 전화번호 인증 화면으로 넘어간다.',
  ] },
  { id: 'login', no: '003', name: '로그인 (소셜 3종)', path: '', status: 'none', spec: [
    '★ 미구현. 카카오 · 구글 · 애플 3개로만 간편 가입. 그 외 수단 없음.',
    '★ 기존 전화번호 SMS 인증은 걷어낸다 — "로그인이 너무 어려웠다"가 실패 원인 중 하나.',
    '카카오: Cloud Function 으로 커스텀 토큰 발급 (seekone functions/kakaoAuth.js 이식).',
    'IAM 에 Service Account Token Creator 권한 필수 — 없으면 signBlob denied.',
    '구글·애플: Firebase Auth 기본 제공(GoogleAuthProvider / OAuthProvider apple.com).',
    '가입은 누구나 가능. 여성 한정은 "홍여사(일하는 사람)" 등록에만 적용된다.',
  ] },
  { id: 'phone', no: '004', name: '전화번호 인증 (폐기 예정)', path: '/Mobilephone', status: 'todo', spec: [
    '★ 소셜 로그인 도입 후 제거 대상.',
    '자체 smssend API + 인증번호 입력 방식.',
  ] },
  { id: 'policy', no: '005', name: '약관 동의', path: '/Mobilepolicy', status: 'todo', spec: [
    '가입 단계 약관 동의.',
  ] },
];

export const POST_REVIEW = [
  { id: 'main', no: '010', name: '홈 (일감 리스트)', path: '/Mobilemain', status: 'wip', spec: [
    '★ 주인공은 일 맡기는 사람. 상단 카테고리 16개가 ①일 올리기 진입점이다.',
    '★ 카테고리를 누르면 그 종류로 일 등록 화면(/Mobileregist)으로 바로 간다. 필터가 아니다.',
    '헤더: 로고 + 내 지역(예: 남양주시 다산동) + 알림.',
    '카테고리: 집 청소 · 사무실 청소 · 이사청소 · 식사준비 · 도와주기 · 등원하원 · 아이돌봄 · 아이레슨 · 간병하기 · 집안수리 · 병원가기 · 요리비법 · 학교행사 · 장봐주기 · 애견돌봄 · 애견산책.',
    '검색: "홍여사 AI에게 물어주세요".',
    '필터: 서비스별 / 가격별 / 기간순 (+ 초기화).',
    '하단: 올라온 일감 카드 리스트 — "일감 N건".',
    '피그마 715:21887 기준 반영 완료. 검색·필터 동작은 미검수.',
  ] },
  { id: 'card', no: '011', name: '일감 카드', path: '/Mobilemain', status: 'done', spec: [
    '피그마 715:22647 스펙 반영 완료 (radius 16 · border 1px #E3E3E3 · padding 20).',
    '상태 태그(진행중 거래/마감된 거래) · 제목 18 SemiBold · 금액 18 Bold + 원 16.',
    '메타: 거리 n km / 등록일자 n일 전 (14px #A3A3A3).',
    '★ 조회수·진행중인 건수가 20·5건으로 하드코딩돼 있던 것을 VIEW_COUNT / APPLY_COUNT 로 교체.',
    '★ APPLY_COUNT 는 ②지원 기능을 만들어야 채워진다. 지금은 0이 정상.',
    '조건 칩: 노란 배경(#FFF5E5) 12 -> 13px.',
  ] },
  { id: 'regist', no: '012', name: '일 등록', path: '/Mobileregist', status: 'todo', spec: [
    '카테고리에서 WORKTYPE / WORKTOTAL 을 받아 진입.',
    '질문에 답해가며 일감을 구성하는 대화형 등록.',
    '★ 공간대여(ROOM) 분기는 제거했다. 일감 등록만 남음.',
    'utility/room.js 잔재가 아직 참조돼 있어 사이즈 선택지가 남아있을 수 있음 — 확인 필요.',
  ] },
  { id: 'workregist', no: '013', name: '일 등록 진입', path: '/Mobileworkregister', status: 'todo', spec: [
    '등록 전 카테고리 선택 화면.',
  ] },
  { id: 'work', no: '014', name: '일감 목록', path: '/Mobilework', status: 'todo', spec: [
    '카테고리별 일감 목록.',
  ] },
  { id: 'content', no: '015', name: '일감 상세', path: '/Mobilecontent', status: 'todo', spec: [
    '★ 여기에 "지원하기" 버튼이 붙어야 한다. 현재 없음.',
    '★ 흐름: 일감 카드 누름 → 상세 → 지원하기 → 채팅 연결.',
    '일감 조건·금액·거리·등록자 정보 표시.',
  ] },
];

export const APPLY_REVIEW = [
  { id: 'apply', no: '020', name: '지원하기', path: '', status: 'none', spec: [
    '★ 미구현 — 5년간 비어 있던 자리. PCMapcontainer 의 _handleSupport 는 빈 함수였다.',
    '★ APPLY 컬렉션부터 설계 필요. 지원 내역을 담을 컬렉션이 아예 없다.',
    '홍여사(여성)만 지원할 수 있다.',
    '지원하면 바로 채팅이 연결된다 (형 2026-08-12).',
    '지원 수가 일감 카드의 "진행중인 건수"로 표시된다.',
  ] },
  { id: 'applicants', no: '021', name: '지원자 목록 / 픽', path: '', status: 'none', spec: [
    '★ 미구현.',
    '★ 일 맡기는 사람이 지원한 홍여사들 중에서 고른다(픽).',
    '선택권은 맡기는 사람에게 있다.',
  ] },
  { id: 'ladyregist', no: '022', name: '홍여사 등록 (공급자)', path: '', status: 'none', spec: [
    '★ 화면은 만들어져 있었으나 라우트에 연결이 안 돼 있었다 — 즉 홍여사가 가입할 입구가 막혀 있었다.',
    '★ 안전망 커밋 4c17d77 에 MobileWorkerRegistcontainer(1,353줄) 등이 있다. 복원 필요.',
    '★ 일하는 사람은 여성으로 한정.',
  ] },
  { id: 'ladylicense', no: '023', name: '홍여사 인증', path: '/Mobileladylicense', status: 'todo', spec: [
    '자격/신분 인증 화면.',
  ] },
];

export const CONNECT_REVIEW = [
  { id: 'chat', no: '030', name: '채팅', path: '/Mobilechat', status: 'todo', spec: [
    '★ ④연결 단계. 지원하기를 누르면 여기로 이어진다.',
    'seekone chatService(529줄, Firestore 실연동) 이식 예정 — 읽음처리·삭제·신고·차단·나가기 포함.',
    '방 키를 seekone 의 상점↔회원 에서 일감↔홍여사 로 바꾼다.',
    '하단 탭에 배치했다(안읽음 뱃지 자리 있음).',
  ] },
  { id: 'payment', no: '031', name: '결제', path: '', status: 'none', spec: [
    '★ 미구현.',
    '★ 채팅에서 서로 오케이하면 결제 로직을 타고, 그 돈이 플랫폼으로 들어온다 (형 2026-08-12).',
    '@tosspayments/tosspayments-sdk 가 이미 의존성에 있다.',
  ] },
];

export const FIND_REVIEW = [
  { id: 'map', no: '040', name: '지도', path: '/Mobilemap', status: 'todo', spec: [
    '★ 지도에는 일감들이 표시된다 (형 2026-08-12).',
    '공간대여 마커는 제거했다. 일감 마커만 남음.',
    '하단 탭 2번째.',
  ] },
  { id: 'search', no: '041', name: '검색', path: '/Mobilesearch', status: 'todo', spec: [] },
  { id: 'searchhistory', no: '042', name: '검색 기록', path: '/Mobilesearchhistory', status: 'todo', spec: [] },
  { id: 'mapreconfig', no: '043', name: '위치 재설정', path: '/Mobilemapreconfig', status: 'todo', spec: [
    'seekone geo.js(좌표→지역, haversine 거리) 이식 검토 대상.',
  ] },
];

export const MY_REVIEW = [
  { id: 'config', no: '050', name: '내 정보', path: '/Mobileconfig', status: 'todo', spec: [
    '하단 탭 4번째.',
  ] },
  { id: 'configcontent', no: '051', name: '내 정보 상세', path: '/Mobileconfigcontent', status: 'todo', spec: [] },
  { id: 'footer', no: '052', name: '하단 탭', path: '/Mobilemain', status: 'done', spec: [
    '★ 홈 / 지도 / 채팅 / 내 정보 4개 (형 2026-08-12).',
    '공간대여 · 중앙 CTA · 커뮤니티 제거.',
    '라벨 10 -> 13px, 아이콘 24, 높이 76.',
    '버그 수정: 존재하지 않는 MOBILEMAINMENU.HONGMENU 를 참조해 홈 탭 활성 표시가 안 되던 문제.',
  ] },
];

/* 리뷰 글을 남기는 화면이 아니라 "눌러서 실제로 푸시가 오는지" 확인하는 보드.
   noBoard=true 면 리뷰 페이지가 스레드 대신 이 보드를 띄운다. (형 지시 2026-08-12) */
export const FCM_REVIEW = [
  { id: 'fcm-test', no: 'F', name: 'FCM 발송 테스트', path: '', status: 'wip', board: 'fcm', spec: [
    '★ 알림 허용 -> 토큰 등록 -> 케이스 버튼 순으로 누르면 실제 푸시가 발송된다.',
    '화면을 보고 있으면 상단 인앱 배너, 탭을 내리거나 다른 탭이면 OS 알림으로 온다.',
    '[미리보기]는 발송 없이 배너 모양만 확인한다.',
    '리뷰 글은 남기지 않는다.',
  ] },
];

export const DOMAINS = [
  { key: 'entry',   label: '진입 · 인증',      screens: ENTRY_REVIEW },
  { key: 'post',    label: '① 일 올리기',      screens: POST_REVIEW },
  { key: 'apply',   label: '② 지원 · ③ 픽',    screens: APPLY_REVIEW },
  { key: 'connect', label: '④ 연결 · 결제',    screens: CONNECT_REVIEW },
  { key: 'find',    label: '찾기',             screens: FIND_REVIEW },
  { key: 'my',      label: '내 정보',          screens: MY_REVIEW },
  { key: 'fcm',     label: 'FCM 테스트',       screens: FCM_REVIEW, noBoard: true },
];

export const STATUS_LABEL = { done: '완료', wip: '작업중', todo: '미검수', none: '없음' };
export const STATUS_COLOR = { done: '#1a7f37', wip: '#FF4E19', todo: '#8a8a8a', none: '#c02020' };

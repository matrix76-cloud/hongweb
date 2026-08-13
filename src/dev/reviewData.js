// 리뷰페이지 데이터 — 도메인별 화면 목록
// 각 화면: { id(전역 유니크), no, name, path(빈 문자열=화면 없음), status, spec:[불릿, ★=핵심] }
// status: done(피그마 반영) / wip(작업중) / todo(기존 화면, 미검수) / none(미구현)
//
// spec 은 형이 2026-08-12 대화에서 정한 초심 기준으로 작성했다. 판단 기준은 CORE.md.

export const ENTRY_REVIEW = [
  { id: 'onboarding', no: '000', name: '온보딩 (3단계)', path: '/Mobileonboarding', status: 'wip', spec: [
    '★ 처음 들어온 사람에게 CORE 흐름을 세 장으로 보여준다 — ①일 올리기 ②지원 ③픽.',
    'doum 프로젝트 OnboardingStepsPage 구조를 따랐다 (일러스트 · STEP 라벨 · 제목 · 점 · 건너뛰기/다음).',
    '한 번 보면 다시 안 뜬다. localforage 의 onboarding.done 을 스플래시가 확인한다.',
  ] },

  { id: 'splash', no: '001', name: '스플래시', path: '/', status: 'todo', spec: [
    '로고 노출 후 자동 전환. 모바일=MobileSplash / PC=PCSplash 분기(768px).',
    '★ 여기서 갈 곳을 정한다 — 온보딩 안 봤으면 온보딩, 약관 미동의면 약관, 다 지났으면 로그인.',
    '위치 권한·일감 프리로드도 여기서 한다.',
  ] },

  { id: 'agree', no: '002', name: '약관 동의', path: '/Mobileagree', status: 'wip', spec: [
    '★ 가입 단계의 가장 처음이다 (형 지시 2026-08-12).',
    '★ 소셜은 버튼을 누르는 순간 계정이 생기므로, 그 전에 동의를 받아둔다.',
    '필수 3(이용약관 · 개인정보 처리지침 · 위치기반) + 선택 1(마케팅). 필수를 다 켜야 넘어간다.',
    '동의 내용은 localforage 에 남기고, 계정을 만들 때 USERS 문서의 AGREE 에 함께 적는다.',
    '주소로 로그인·가입에 곧장 들어와도 미동의면 여기로 되돌린다.',
  ] },

  { id: 'login', no: '003', name: '로그인', path: '/Mobilelogin', status: 'wip', spec: [
    '★ 숨고 화면 방식 — 이메일 + 비밀번호, 그 아래 이메일 찾기 | 비밀번호 찾기.',
    '★ 소셜은 카카오 · 구글 둘. 네이버는 넣지 않는다 (형 지시 2026-08-12).',
    '카카오는 아직 막혀 있다 — Cloud Function 으로 커스텀 토큰을 발급해야 하고 IAM 에 Service Account Token Creator 가 필요하다.',
    '구글은 웹에서는 팝업으로 되지만 RN WebView 에서는 막힌다 — 그때는 네이티브 SDK 로 받은 idToken 을 브릿지로 넘겨 signInWithCredential 로 바꿔야 한다.',
    '',
    '── 테스트 계정 (형 요청 2026-08-13) ──',
    '이메일   test@hongyeosa.com',
    '비밀번호 hong1234',
    '대화명   테스트계정   ← 이메일 찾기 시험할 때 이 대화명을 넣으면 된다',
    '다시 만들거나 비밀번호를 되돌리려면: node scripts/make_test_account.mjs',
  ] },

  { id: 'signup', no: '004', name: '회원가입', path: '/Mobilesignup', status: 'wip', spec: [
    '이메일 · 비밀번호 · 비밀번호 확인 · 대화명.',
    '★ 대화명을 여기서 꼭 받는다 — 나중에 이메일 찾기의 열쇠가 된다.',
    '약관은 이 화면 앞에서 이미 받았다.',
  ] },

  { id: 'findaccount', no: '005', name: '계정 찾기', path: '/Mobilefindaccount', status: 'wip', spec: [
    '탭 두 개 — 이메일 찾기 / 비밀번호 찾기.',
    '★ 이메일 찾기: 대화명이 맞으면 가려진 이메일을 알려준다 (ho****@gmail.com).',
    '★ 마스킹은 반드시 서버(functions/findMaskedEmail)에서 한다 — 앱에서 조회하면 원본이 그대로 보인다.',
    '비밀번호 찾기: Firebase 가 재설정 메일을 보낸다.',
    '테스트: 대화명에 "테스트계정" 을 넣으면 te****@hongyeosa.com 이 나온다.',
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
  { id: 'fcm-test', no: 'F', name: 'FCM 발송 테스트', path: '/Mobilemain', status: 'wip', board: 'fcm', spec: [
    '★ 알림 허용 -> 토큰 등록 -> 케이스 버튼 순으로 누르면 실제 푸시가 발송된다.',
    '왼쪽이 실제 앱이다. 발송하면 그 화면 상단에 배너가 뜨는 걸 바로 볼 수 있다.',
    '탭을 내리거나 다른 탭을 보고 있으면 OS 알림으로 온다.',
    '[미리보기]는 발송 없이 배너 모양만 확인한다.',
    '리뷰 글은 남기지 않는다.',
  ] },
];

// ② 지원 · ③ 픽 / ④ 연결 · 결제 / 찾기 탭은 형 지시로 뺐다 (2026-08-12).
// 채팅(/Mobilechat) · 지도 · 검색 · 위치 재설정도 함께 빠졌다.
// 다시 볼 때는 그 배열(CONNECT_REVIEW · FIND_REVIEW 등)을 되살리면 된다.
export const DOMAINS = [
  { key: 'entry',   label: '진입 · 인증',      screens: ENTRY_REVIEW },
  { key: 'post',    label: '① 일 올리기',      screens: POST_REVIEW },
  { key: 'my',      label: '내 정보',          screens: MY_REVIEW },
  { key: 'fcm',     label: 'FCM 테스트',       screens: FCM_REVIEW, noBoard: true },
];

export const STATUS_LABEL = { done: '완료', wip: '작업중', todo: '미검수', none: '없음' };
export const STATUS_COLOR = { done: '#1a7f37', wip: '#FF4E19', todo: '#8a8a8a', none: '#c02020' };

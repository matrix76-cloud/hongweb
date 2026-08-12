// 리뷰 대상 화면 목록. 형이 /review 에서 화면별로 메모를 남기면 카스가 읽고 조치한다.
// status: done(피그마 반영 완료) / wip(작업중) / todo(미착수) / none(화면 자체가 없음)

export const SCREENS = [
  {
    group: '① 일 올리기',
    items: [
      { id: 'main',        name: '홈 (일감 리스트)',   path: '/Mobilemain',        status: 'wip',  note: '카테고리·카드 피그마 반영. 검색/필터 미확인' },
      { id: 'regist',      name: '일 등록',            path: '/Mobileregist',      status: 'todo', note: '카테고리에서 진입. WORKTYPE/WORKTOTAL 전달됨' },
      { id: 'workregist',  name: '일 등록 진입',       path: '/Mobileworkregister', status: 'todo' },
      { id: 'work',        name: '일감 목록',          path: '/Mobilework',        status: 'todo' },
      { id: 'content',     name: '일감 상세',          path: '/Mobilecontent',     status: 'todo', note: '★ 여기에 지원하기 버튼이 붙어야 함 (현재 없음)' },
    ],
  },
  {
    group: '② 지원 · ③ 픽',
    items: [
      { id: 'apply',       name: '지원하기',           path: '',                   status: 'none', note: '★ 미구현. APPLY 컬렉션부터 설계 필요' },
      { id: 'applicants',  name: '지원자 목록 / 픽',   path: '',                   status: 'none', note: '★ 미구현' },
      { id: 'ladyregist',  name: '홍여사 등록(공급자)', path: '',                  status: 'none', note: '★ 안전망 커밋(4c17d77)에 화면 있음. 복원 필요' },
      { id: 'ladylicense', name: '홍여사 인증',        path: '/Mobileladylicense', status: 'todo' },
    ],
  },
  {
    group: '④ 연결 · 결제',
    items: [
      { id: 'chat',        name: '채팅',               path: '/Mobilechat',        status: 'todo', note: 'seekone chatService 이식 예정' },
      { id: 'payment',     name: '결제',               path: '',                   status: 'none', note: '★ 미구현. 수수료 수취 구조' },
    ],
  },
  {
    group: '찾기 · 내 정보',
    items: [
      { id: 'map',         name: '지도',               path: '/Mobilemap',         status: 'todo', note: '일감 마커 표시' },
      { id: 'search',      name: '검색',               path: '/Mobilesearch',      status: 'todo' },
      { id: 'config',      name: '내 정보',            path: '/Mobileconfig',      status: 'todo' },
    ],
  },
  {
    group: '진입 · 인증',
    items: [
      { id: 'splash',      name: '스플래시',           path: '/',                  status: 'todo' },
      { id: 'gate',        name: '게이트',             path: '/Mobilegate',        status: 'todo' },
      { id: 'login',       name: '로그인(소셜 3종)',   path: '',                   status: 'none', note: '★ 미구현. 현재 전화번호 SMS 인증 → 카카오/구글/애플로 교체' },
      { id: 'policy',      name: '약관',               path: '/Mobilepolicy',      status: 'todo' },
    ],
  },
];

export const STATUS_LABEL = {
  done: '완료',
  wip: '작업중',
  todo: '대기',
  none: '없음',
};

export const STATUS_COLOR = {
  done: '#1a7f37',
  wip: '#FF4E19',
  todo: '#8a8a8a',
  none: '#c02020',
};

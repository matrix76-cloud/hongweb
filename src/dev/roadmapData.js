// 9월 마스터 플랜 — 2026-09-30 정식 오픈 목표 (형 지시 2026-08-23 "한 달 마스터 플랜, 캘린더 형식")
// 항목: { id, date(YYYY-MM-DD), title, owner(형|카스|외부|같이), kind(milestone|task), note }
// 상태(대기/진행/완료)는 Firestore reviewMeta/roadmap 에 id 별로 저장된다 — 여기엔 계획만.

export const ROADMAP_START = '2026-08-23';   // 일요일
export const ROADMAP_END = '2026-10-03';     // 토요일 (오픈 뒤 버퍼 3일)
export const OPEN_DATE = '2026-09-30';

export const PHASES = [
  { key: 'w1', label: '1주 · 불러오기 준비', from: '2026-08-23', to: '2026-08-29' },
  { key: 'w2', label: '2주 · 회원 흡수 + 핵심 루프', from: '2026-08-30', to: '2026-09-05' },
  { key: 'w3', label: '3주 · 마켓 제출', from: '2026-09-06', to: '2026-09-12' },
  { key: 'w4', label: '4주 · 심사 대응 + 첫 동네', from: '2026-09-13', to: '2026-09-19' },
  { key: 'w5', label: '5주 · 오픈 준비', from: '2026-09-20', to: '2026-09-26' },
  { key: 'w6', label: '오픈 주', from: '2026-09-27', to: '2026-10-03' },
];

export const ROADMAP_ITEMS = [
  // ── 1주: 8/23~8/29 ──
  { id: 'w1-done', date: '2026-08-23', owner: '카스', kind: 'task', title: '알림음·푸시배너·홈배너·온보딩·홍여사 필터·번호 인증 완료', note: '오늘까지 끝난 것' },
  { id: 'w1-alimtalk-draft', date: '2026-08-24', owner: '카스', kind: 'task', title: '재개 안내 알림톡 템플릿 문안 2종 (홍여사용 · 의뢰자용)', note: '정보성 규칙에 맞게. 버튼 = 앱 열기' },
  { id: 'w1-alimtalk-submit', date: '2026-08-25', owner: '형', kind: 'task', title: '루나소프트 콘솔에 템플릿 심사 신청', note: '보통 2~3일' },
  { id: 'w1-target', date: '2026-08-25', owner: '카스', kind: 'task', title: '발송 대상 추출 — 여성 홍여사 677명 / 전체 5,678명', note: '번호 형식 깨진 21명 제외' },
  { id: 'w1-ios', date: '2026-08-26', owner: '같이', kind: 'task', title: 'iOS 실기기 검증 — 알림음 caf · entitlement · 푸시 배너', note: '아이폰 연결' },
  { id: 'w1-legacy-audit', date: '2026-08-27', owner: '카스', kind: 'task', title: '옛 잔재 점검 목록 — 컨셉과 안 맞는 화면·문구·라우트·AI 샘플 데이터', note: '리뷰 페이지에 목록으로' },
  { id: 'w1-android-build', date: '2026-08-28', owner: '카스', kind: 'task', title: '안드로이드 릴리스 빌드 정리 — versionCode, 서명 키 해시·SHA 3벌 확인', note: '디버그·릴리스·Play 앱서명' },
  { id: 'w1-review', date: '2026-08-29', owner: '형', kind: 'task', title: '주간 리뷰 — 리뷰 페이지에서 지적 정리', note: '' },

  // ── 2주: 8/30~9/5 ──
  { id: 'w2-e2e', date: '2026-08-31', owner: '같이', kind: 'task', title: '핵심 루프 끝까지 1건 — 올리기 → 지원 → 채팅으로 정하기 → 결제 → 후기', note: '형 폰 + 테스트 계정' },
  { id: 'w2-bugs', date: '2026-09-01', owner: '카스', kind: 'task', title: '핵심 루프에서 나온 버그 수정', note: '' },
  { id: 'w2-alimtalk-1', date: '2026-09-02', owner: '형', kind: 'milestone', title: '재개 알림톡 1차 발송 — 여성 홍여사 677명', note: '템플릿 승인 후. 흡수율 확인' },
  { id: 'w2-absorb', date: '2026-09-03', owner: '카스', kind: 'task', title: '흡수 현황 집계 — 로그인·인증·병합 건수, 막힌 사람 원인', note: '' },
  { id: 'w2-legacy-1', date: '2026-09-04', owner: '카스', kind: 'task', title: '옛 잔재 정리 1차 — 안 쓰는 라우트·화면 제거, 문구 컨셉 맞추기', note: '' },
  { id: 'w2-review', date: '2026-09-05', owner: '형', kind: 'task', title: '주간 리뷰', note: '' },

  // ── 3주: 9/6~9/12 ──
  { id: 'w3-play-internal', date: '2026-09-07', owner: '카스', kind: 'task', title: '플레이 내부 테스트 트랙 업로드 (AAB)', note: 'READ_MEDIA_IMAGES 제거 확인' },
  { id: 'w3-apple-signin', date: '2026-09-08', owner: '카스', kind: 'task', title: 'Sign in with Apple 붙이기 (소셜 로그인 있으면 필수)', note: '앱+웹+functions' },
  { id: 'w3-ios-archive', date: '2026-09-09', owner: '같이', kind: 'task', title: 'iOS 아카이브 · TestFlight 업로드', note: '의뢰인 계정 · DEVELOPMENT_TEAM' },
  { id: 'w3-store-assets', date: '2026-09-10', owner: '카스', kind: 'task', title: '스토어 등록 자료 — 스크린샷(6.5/6.7/6.9") · 설명 · 개인정보 URL · 데모 계정', note: '' },
  { id: 'w3-play-submit', date: '2026-09-11', owner: '형', kind: 'milestone', title: '플레이 스토어 프로덕션 심사 제출', note: '' },
  { id: 'w3-ios-submit', date: '2026-09-11', owner: '형', kind: 'milestone', title: '앱스토어 심사 제출', note: '' },
  { id: 'w3-alimtalk-2', date: '2026-09-12', owner: '형', kind: 'task', title: '재개 알림톡 2차 — 전체 회원 5,678명', note: '1차 반응 보고 문안 손질' },

  // ── 4주: 9/13~9/19 ──
  { id: 'w4-review-fix', date: '2026-09-14', owner: '카스', kind: 'task', title: '심사 반려 대응 · 재제출', note: '' },
  { id: 'w4-town-pick', date: '2026-09-15', owner: '형', kind: 'task', title: '첫 동네 확정 (남양주 다산동?) + 목표 숫자 (홍여사 N명 · 의뢰 N건)', note: '' },
  { id: 'w4-town-campaign', date: '2026-09-16', owner: '같이', kind: 'task', title: '첫 동네 홍여사 확보 — 기존 회원 중 그 동네 677명 안에서 먼저', note: '지도 반경 필터로 추출' },
  { id: 'w4-monitor', date: '2026-09-17', owner: '카스', kind: 'task', title: '운영 모니터링 준비 — 푸시 발송 실패·채팅·결제 오류 알림', note: '' },
  { id: 'w4-review', date: '2026-09-19', owner: '형', kind: 'task', title: '주간 리뷰', note: '' },

  // ── 5주: 9/20~9/26 ──
  { id: 'w5-approved', date: '2026-09-22', owner: '외부', kind: 'milestone', title: '플레이 · 앱스토어 승인 (예상)', note: '늦으면 오픈은 웹+안드로이드 먼저' },
  { id: 'w5-polish', date: '2026-09-23', owner: '카스', kind: 'task', title: '오픈 전 손질 — 빈 상태 화면, 에러 문구, 속도', note: '' },
  { id: 'w5-first-deal', date: '2026-09-24', owner: '같이', kind: 'task', title: '첫 동네에서 실제 거래 1건 성사', note: '' },
  { id: 'w5-open-notice', date: '2026-09-25', owner: '카스', kind: 'task', title: '오픈 안내 문안 · 스토어 링크 정리', note: '' },
  { id: 'w5-freeze', date: '2026-09-26', owner: '같이', kind: 'task', title: '코드 동결 · 최종 점검', note: '' },

  // ── 오픈 주: 9/27~10/3 ──
  { id: 'w6-rehearsal', date: '2026-09-28', owner: '같이', kind: 'task', title: '오픈 리허설 — 가입부터 결제까지 새 폰으로', note: '' },
  { id: 'w6-open', date: '2026-09-30', owner: '형', kind: 'milestone', title: '정식 오픈', note: '목표일' },
  { id: 'w6-watch', date: '2026-10-01', owner: '카스', kind: 'task', title: '오픈 후 모니터링 · 긴급 수정', note: '' },
  { id: 'w6-retro', date: '2026-10-03', owner: '같이', kind: 'task', title: '첫 주 회고 · 10월 계획', note: '' },
];

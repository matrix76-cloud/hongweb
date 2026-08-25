/**
 * 루나소프트(Lunasoft) 카카오 알림톡 발송 모듈 — 구해줘 홍여사
 * (CareService/functions/alimtalk.js 를 그대로 가져옴 2026-08-23 — 같은 채널·같은 템플릿)
 * 엔드포인트: https://jupiter.lunasoft.co.kr/api/alimtalk/message/send
 * 참고 구현: classmanage/functions/alimtalk.js (동일 루나소프트 계정 재사용)
 *
 * ※ 루나소프트는 토큰발급/senderkey 없이 userid + api_key + template_id 로 바로 발송.
 *   바디는 JSON. 채널 = "구해줘 홍여사".
 *
 * 키는 functions/.env 로 주입: LUNA_USERID / LUNA_API_KEY
 */
const LUNA = {
  userid: process.env.LUNA_USERID || "",
  api_key: process.env.LUNA_API_KEY || "",
};

/**
 * 카카오 심사 승인된 루나소프트 template_id (2026-06-17 승인 완료)
 * 강조표기형(auth)은 title(강조 타이틀) 필수.
 */
const TEMPLATES = {
  welcome:  { id: "50045", name: "가입환영" },
  matching: { id: "50046", name: "매칭확정" },
  payment:  { id: "50047", name: "결제예약확정" },
  start:    { id: "50048", name: "동행시작" },
  complete: { id: "50049", name: "동행완료(진료결과)" },
  settle:   { id: "50050", name: "정산완료" },
  // 강조표기형: 강조 타이틀 = 인증번호 값
  auth:     { id: "50051", name: "인증번호", title: (v) => String(v.인증번호 || "") },
};

/**
 * 승인된 템플릿 본문과 100% 일치해야 발송됨 (변수 자리만 실제값으로 치환).
 * 본문 출처: docs/08_알림톡_심사용.md (콘솔 승인 본문 기준)
 */
const BODY = {
  welcome: (v) =>
    `[구해줘 홍여사]\n${v.이름}님, 구해줘 홍여사 가입을 환영합니다.\n\n이제 병원동행 신청과 진행 상황을\n앱에서 바로 확인하실 수 있습니다.\n\n· 고객센터 010-6214-9756`,
  matching: (v) =>
    `[구해줘 홍여사]\n${v.매니저명}님, 병원동행 매칭이 확정되었습니다.\n\n· 일시 : ${v.동행일시}\n· 병원 : ${v.병원명}\n· 의뢰자 : ${v.의뢰자명}\n\n자세한 내용은 아래에서 확인해 주세요.`,
  payment: (v) =>
    `[구해줘 홍여사]\n${v.의뢰자명}님, 병원동행 예약이 확정되었습니다.\n\n· 일시 : ${v.동행일시}\n· 병원 : ${v.병원명}\n· 담당 매니저 : ${v.매니저명}\n· 결제금액 : ${v.결제금액}원\n\n· 고객센터 010-6214-9756`,
  start: (v) =>
    `[구해줘 홍여사]\n${v.환자명}님의 병원동행이 시작되었습니다.\n\n· 담당 매니저 : ${v.매니저명}\n· 병원 : ${v.병원명}\n· 시작 시각 : ${v.시작시각}\n\n동행이 끝나면 진료 내용을 전해드립니다.`,
  complete: (v) =>
    `[구해줘 홍여사]\n${v.환자명}님의 병원동행이 완료되었습니다.\n\n· 병원 : ${v.병원명}\n· 진료 요약 : ${v.진료요약}\n\n자세한 내용은 아래에서 확인해 주세요.\n· 고객센터 010-6214-9756`,
  settle: (v) =>
    `[구해줘 홍여사]\n${v.매니저명}님, 정산이 완료되었습니다.\n\n· 동행 건 : ${v.동행일시} ${v.병원명}\n· 정산금액 : ${v.정산금액}원\n· 입금 예정일 : ${v.입금예정일}\n\n감사합니다.`,
  auth: (v) =>
    `[구해줘 홍여사]\n본인 확인을 위한 인증번호입니다.\n\n인증번호 [${v.인증번호}]를 입력해 주세요.\n\n· 타인에게 절대 알려주지 마세요.`,
};

/**
 * 알림톡 버튼(웹링크) — 전부 https://honglady.com.
 * ⚠️ 콘솔 템플릿에 등록된 버튼과 일치해야 노출됨. API로는 URL만 전송.
 *    (버튼명/타입은 템플릿 등록값을 그대로 사용)
 */
const LANDING_URL = "https://honglady.com";
const webLinkBtn = () => ({
  url_pc: LANDING_URL,
  url_mobile: LANDING_URL,
});
const BUTTONS = {
  welcome:  webLinkBtn(),
  matching: webLinkBtn(),
  payment:  webLinkBtn(),
  start:    webLinkBtn(),
  complete: webLinkBtn(),
  settle:   webLinkBtn(),
  auth:     webLinkBtn(),
};

const ENDPOINT = "https://jupiter.lunasoft.co.kr/api/alimtalk/message/send";

/**
 * 카카오 알림톡 1건 발송 (실패 시 SMS 대체발송 옵션)
 * @param {string} tplKey   - TEMPLATES 키 (welcome/matching/payment/start/complete/settle/auth)
 * @param {string} phone    - 수신 전화번호 (하이픈 있어도 됨)
 * @param {string} recvname - 수신자 이름 (로깅용, 루나는 본문에 포함)
 * @param {object} vars     - 본문 변수 객체 (BODY 빌더 인자에 맞춤)
 * @param {object} [opts]
 * @param {object} [opts.button]   - 버튼 URL 객체 { url_pc, url_mobile }. 미지정 시 BUTTONS 기본값.
 * @param {boolean} [opts.failover] - true면 알림톡 실패 시 SMS 대체발송
 * @returns {Promise<object>} 루나소프트 응답 JSON
 */
async function sendAlimtalk(tplKey, phone, recvname, vars = {}, opts = {}) {
  const tpl = TEMPLATES[tplKey];
  if (!tpl) throw new Error(`알 수 없는 템플릿 키: ${tplKey}`);
  if (!tpl.id) {
    throw new Error(`템플릿 ID 미설정: ${tplKey}`);
  }
  if (!LUNA.userid || !LUNA.api_key) {
    throw new Error("루나소프트 설정값(userid/api_key) 미입력 — functions/.env 확인");
  }

  const to = String(phone || "").replace(/\D/g, "");
  if (!to) throw new Error("수신 전화번호 없음");

  const content = BODY[tplKey](vars);
  const message = {
    no: "0",
    tel_num: to,
    msg_content: content,
    sms_content: content, // 매뉴얼상 필수 (use_sms=0이어도 요구됨)
    use_sms: opts.failover ? "1" : "0",
  };
  // 강조표기형 템플릿은 title(강조 타이틀) 필수
  if (tpl.title) {
    message.title = tpl.title(vars);
  }
  // 버튼 — 명시 우선, 없으면 BUTTONS 기본값
  const button = opts.button !== undefined ? opts.button : BUTTONS[tplKey];
  if (button) {
    message.btn_url = Array.isArray(button) ? button : [button];
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      userid: LUNA.userid,
      api_key: LUNA.api_key,
      template_id: tpl.id,
      messages: [message],
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(`알림톡 발송 실패(HTTP ${res.status}): ${JSON.stringify(json)}`);
  }
  // 최상위 code != 0 → 요청 자체 실패
  if (json.code !== undefined && Number(json.code) !== 0) {
    throw new Error(`알림톡 발송 실패: ${JSON.stringify(json.msg)} (code ${json.code})`);
  }
  // 함정: 최상위 code 0이라도 개별 메시지가 실패할 수 있음
  const perMsg = json && json.msg && Array.isArray(json.msg.messages) ? json.msg.messages : null;
  if (perMsg) {
    const failed = perMsg.filter((m) => Number(m.result_code) !== 0);
    if (failed.length) {
      throw new Error(
        `알림톡 발송 실패: ${failed.map((m) => m.result_msg || `code ${m.result_code}`).join(", ")}`
      );
    }
  }
  return json;
}

module.exports = { sendAlimtalk, TEMPLATES, BODY, BUTTONS, LANDING_URL, LUNA, ENDPOINT };

const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const DAILY_PROMPT_TEMPLATES = [
    // 일요일 (회복/반성)
    `❗ 스타일 조건:
- 오늘 하루는 한 주를 정리하며 마음을 돌아보는 날입니다.
- 반성과 회복, 휴식에 집중해주세요.
- 마무리는 반드시 "마루이모의 한마디:"로 끝내주세요.
`,
    // 월요일 (계획/출발)
    `❗ 스타일 조건:
- 새로운 계획, 시작, 다짐에 관한 내용으로 풀어주세요.
- 일상의 재정비와 의욕적인 출발을 표현해주세요.
- 마무리는 반드시 "마루이모의 한마디:"로 끝내주세요.
`,
    // 화요일 (실행력/결단)
    `❗ 스타일 조건:
- 추진력과 현실적 조언 중심으로 운세를 써주세요.
- 재물, 일, 효율 중심으로 표현해주세요.
- 마무리는 반드시 "마루이모의 한마디:"로 끝내주세요.
`,
    // 수요일 (관계/대화)
    `❗ 스타일 조건:
- 소통, 인간관계, 말 한마디에 관한 운세로 표현해주세요.
- 감정 표현, 오해 방지 조언도 포함해주세요.
- 마무리는 반드시 "마루이모의 한마디:"로 끝내주세요.
`,
    // 목요일 (감성/예술)
    `❗ 스타일 조건:
- 감정 기복, 내면, 감성 위주의 운세로 써주세요.
- 여유와 음악, 예술 감성도 포함해주세요.
- 마무리는 반드시 "마루이모의 한마디:"로 끝내주세요.
`,
    // 금요일 (해방감/즐거움)
    `❗ 스타일 조건:
- 휴식, 즐거움, 스트레스 해소 중심 운세로 써주세요.
- 친구, 음식, 여유에 관한 내용 포함해주세요.
- 마무리는 반드시 "마루이모의 한마디:"로 끝내주세요.
`,
    // 토요일 (자기관리/정리)
    `❗ 스타일 조건:
- 건강, 루틴, 자기 정비 중심 운세로 써주세요.
- 가벼운 정리, 가족 중심 활동 포함해주세요.
- 마무리는 반드시 "마루이모의 한마디:"로 끝내주세요.
`
];


export const getWeeklyPrompt = (userInfo) => {
    const today = new Date();

    // 이번 주 월요일 ~ 일요일 날짜 범위 계산
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const format = (d) => d.toISOString().split('T')[0];
    const weekRange = `${format(startOfWeek)} ~ ${format(endOfWeek)}`;

    return `
[전문 운세 작가 AI]로서 아래 사용자에게 이번 주의 운세를 작성해주세요.
절대 **, ##, -, *, :, ~ 등의 기호를 사용하지 마세요.

- 생년: ${userInfo.year}
- 생월: ${userInfo.month}
- 생일: ${userInfo.day}
- 시간: ${userInfo.time}
- 음력 생일: 예 (Lunar Calendar)

이번 주 날짜는 ${weekRange}입니다.

❗ 분석 조건:
- 운세는 실제 사주 구성(일간, 월지, 시지 등)의 흐름을 바탕으로 작성해주세요.
- 사주 기반이라는 인식이 들도록 설명을 포함해주세요.
- 사주 내 수기운, 목기운 등 주요 흐름이 이번 주에 어떤 영향을 주는지도 반영해주세요.
- 마루이모의 주간 운세늘 특별한 요일을 중심으로 작성해주세요.

형식:
- 요약
- 주의할 점

- 마루이모의 주간 한마디

❗ 추가 조건:
- 각 항목은 반드시 아래 형식으로 시작해주세요:
- 절대 Markdown 문법 (##, ###, -, *, 등)을 사용하지 마세요.


`;
};

export const getDailyPrompt = (userInfo, dateStr) => {
    const today = dateStr ? new Date(dateStr) : new Date();
    const dayIndex = today.getDay();
    const weekdayName = weekdays[dayIndex];
    const stylePrompt = DAILY_PROMPT_TEMPLATES[dayIndex];

    return `
[전문 운세 작가 AI]로서 아래 사용자에게 오늘의 운세를 작성해주세요.

- 생년: ${userInfo.year}
- 생월: ${userInfo.month}
- 생일: ${userInfo.day}
- 시간: ${userInfo.time}
- 음력 생일: 예 (Lunar Calendar)

오늘 날짜는 ${today.toISOString().split('T')[0]} (${weekdayName})입니다.

${stylePrompt}

[전문 운세 작가 AI]로서 아래 사용자에게 오늘의 운세를 작성해주세요.

- 생년: ${userInfo.year}
- 생월: ${userInfo.month}
- 생일: ${userInfo.day}
- 시간: ${userInfo.time}
- 음력 생일: 예 (Lunar Calendar)

오늘 날짜는 ${today.toISOString().split('T')[0]} (${weekdayName})입니다.

${stylePrompt}

❗ 분석 조건:
- 운세는 실제 사주 구성(일간, 월지, 시지 등)의 흐름을 바탕으로 작성해주세요.
- 사주 기반이라는 인식이 들도록 설명을 포함해주세요.
- 사주 내 목 화 토 금 수기운 주요 흐름이 오늘 어떤 영향을 주는지도 반영해주세요

형식:
- 요약: 오늘의 사주 흐름과 전반적인 분위기를 정리해주세요.
- 주의할 점: 사주 흐름 속에서 조심해야 할 현실적 부분을 중심으로 써주세요.
- 마루이모의 한마디: 반드시 이 문장으로 시작하며, 감성 있는 한 줄로 마무리해주세요.

❗ 추가 조건:
- 반드시 "마루이모의 한마디:"라는 표현으로 마지막 문장을 구분해주세요.
- 이 표현은 꼭 포함되어야 파싱이 가능합니다.

결과는 마치 구해줘 알바 앱에서 사용자에게 전달되는 것처럼,
현실적으로 작성해주세요.
`;
};

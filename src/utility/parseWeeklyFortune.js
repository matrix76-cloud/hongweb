// 📦 /utils/parseWeeklyFortune.js (리팩: includes 사용 + 정제 대응)

import { removeSymbols } from "./common";



// const removeSymbols = (text) => {
//     return text.replace(/[^\w가-힣\s:/]/g, '');
// };

export const parseWeeklyFortune = (rawText) => {
    const cleanedText = removeSymbols(rawText);

    console.log("clenedText", cleanedText);
    const lines = cleanedText.split('\n').map(line => line.trim()).filter(Boolean);

    const result = {
        summary: '',
        mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '',
        caution: '', focus: '', quote: ''
    };

    let current = 'summary';

    lines.forEach(line => {
        const cleaned = line.trim();

        // 💡 "요일:" 뒤에 텍스트가 있는 것도 인식
        if (cleaned.startsWith('월요일') || cleaned.startsWith('월요일:') || cleaned.startsWith('월요일에는')) current = 'mon';
        else if (cleaned.startsWith('화요일') || cleaned.startsWith('화요일:') || cleaned.startsWith('화요일에는')) current = 'tue';
        else if (cleaned.startsWith('수요일') || cleaned.startsWith('수요일:') || cleaned.startsWith('수요일에는')) current = 'wed';
        else if (cleaned.startsWith('목요일') || cleaned.startsWith('목요일:') || cleaned.startsWith('목요일에는')) current = 'thu';
        else if (cleaned.startsWith('금요일') || cleaned.startsWith('금요일:') || cleaned.startsWith('금요일에는')) current = 'fri';
        else if (cleaned.startsWith('토요일') || cleaned.startsWith('토요일:') || cleaned.startsWith('토요일에는')) current = 'sat';
        else if (cleaned.startsWith('일요일') || cleaned.startsWith('일요일:') || cleaned.startsWith('일요일에는')) current = 'sun';
        else if (cleaned.includes('주의할 점')) current = 'caution';
        if (cleaned.includes('주의할 점')) current = 'caution';
        else if (cleaned.includes('마루이모의 주간 한마디')) current = 'quote';
        else result[current] += (result[current] ? '\n' : '') + cleaned;
    });

    return result;
};


export const parseDailyFortune = (text) => {
    const raw = typeof text === 'function' ? text() : text || '';
    const cleanedText = removeSymbols(raw); // 전처리
    const [main, quote] = cleanedText.split('마루이모의 한마디:');
    console.log("main", main);

    return {
        main: main?.trim() || '',
        quote: quote?.trim() || '',
    };
};


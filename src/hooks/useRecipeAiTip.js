import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, model } from '../api/config';
import { removeSymbols } from '../utility/common';

export const useRecipeAiTip = (RECIPE_ID, item) => {

    console.log("useRecipeAiTip", RECIPE_ID, item);


    const [tip, setTip] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!RECIPE_ID || !item) return;

        const checkAndFetchTip = async () => {
            const ref = doc(db, 'RECIPE', RECIPE_ID);
            const snap = await getDoc(ref);

            const existingTip = snap.exists() ? snap.data()?.TIP_AI : null;

            console.log("useRecipeAiTip", existingTip);

            if (existingTip) {
                setTip(existingTip);
                setLoading(false);
                return;
            }

            const prompt = `
                요리명: ${item.RCP_NM}
                요리 설명: ${item.RCP_NA_TIP}
                조리법: ${item.RCP_WAY2}
                분류: ${item.RCP_PAT2}
                재료: ${item.RCP_PARTS_DTLS}

                이 요리를 만들 때 특별히 신경 써야 할 부분이나, 실수하기 쉬운 포인트, 맛을 좋게 만드는 팁이 있다면 알려줘. 
                300자 이내로 요약해줘.
                    `.trim();

            try {
                const res = await model.generateContent(prompt);
                const text = res.response.text();
                const cleanText = removeSymbols(text); // ✔️ 기호나 엔터 정리

                console.log("요리 팁", cleanText);
                setTip(cleanText);
                await setDoc(ref, { TIP_AI: cleanText }, { merge: true }); // ✅ DB에 저장
            } catch (err) {
                console.error('Gemini 응답 실패:', err);
                setTip('');
            } finally {
                setLoading(false);
            }
        };

        checkAndFetchTip();
    }, [RECIPE_ID, item]);

    return { tip, loading };
};

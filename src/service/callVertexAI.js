// 📦 /services/vertexAI.js

import { model } from "../api/config";


// Vertex AI 호출 함수 (형식화된 프롬프트 전달 후 텍스트 결과 반환)
export const callVertexAI = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error('🔴 Vertex AI 호출 오류:', error);
        return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
};
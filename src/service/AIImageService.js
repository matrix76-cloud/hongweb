import { translatePrompt } from "./TranslateService";
import { updateWorkerByUserId } from "./WorkerService";


import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../api/config"; // ✅ 상단에 이미 있을 수 있음

import { db, model } from '../api/config';
import { removeSymbols } from '../utility/common';




 const generateSummaryFromPost = async (post) => {
    const prompt = generateSummaryPromptFromPost(post); // ✅ 프롬프트 생성

    const res = await model.generateContent(prompt);
    const text = res.response.text();

    const cleanText = removeSymbols(text); // ✔️ 줄바꿈, 특수문자 정리

    return cleanText;
 };

 const makeTTSPrompt = ({ store, summary }) => {
    return `
  지금 소개해드릴 가게는 "${store}"입니다.
  
  ${summary.trim().replace(/\.$/, '')} 가게인데요,  
  시간 나실 때 한 번 방문해보시면 좋을 것 같아요 :)
  `.trim();
  };
  
const generateKoreanPromptFromWorker = (worker) => {
    const gender = worker.gender === "male" ? "남성" : "여성";
    const age = worker.age || "30대";
    const region = (worker.address || "서울").split(" ").slice(0, 2).join(" ");
    const selfIntro = worker.selfIntro || "성실하고 믿을 수 있는 사람입니다.";
    const availableTime = worker.availableTime || "시간 조율이 가능합니다.";
    const career = worker.career || "다양한 서비스 경험이 있습니다.";
    const rawTags = worker.tags || [];
    const tagText = rawTags.length ? rawTags.join(", ") : "다양한 일";
    const mood = getRandomMood();
    const background = getRandomBackground();

    return `${age}의 ${gender}로, ${region}에 거주하며, 주요 활동 분야는 ${tagText}입니다. 가능한 시간은 ${availableTime}입니다. 자기소개 내용인 "${selfIntro}"의 성격과 분위기가 그림에 자연스럽게 드러나도록 해주세요. 또한 "${career}"의 경력도 함께 반영해주세요. 마지막으로 주요 활동 분야를 가장 크게 반영해주세요. 배경은 ${background}입니다.`;
};


const generateKoreanPromptFromPost = (post) => {
    const {
        storename = "우리 가게",
        content = "",
        region = "서울"
    } = post;

    return `${region}에 위치한 '${storename}'이라는 가게는,\n` +
        `"${content}" 라는 소개 문구처럼, 자랑하고 싶은 특별한 공간입니다.\n\n` +
        `이 가게의 분위기와 특징이 잘 드러나도록 감성적인 일러스트 스타일의 이미지를 만들어 주세요.\n` +
        `예: 따뜻한 조명, 진열된 상품, 아늑한 인테리어 등`;
  };


export const generateSummaryPromptFromPost = (post) => {
    const store = post?.storename || "우리 가게";
    const content = post?.content || "";

    return `
"${content}" 이 내용을 참고해서, 가게를 따뜻하고 친근하게 소개하는 한 문장을 만들어 주세요.  
가게 이름은 문장 맨 앞에 넣고, 좋은 분위기나 서비스, 특징을 자연스럽게 강조해 주세요.  
가게 이름은 "${store}"입니다.
`.trim();
  };

export const generateSummaryPromptFromPost2 = (post) => {
    const totalAmount = post?.totalAmount || "우리 가게";
    const content = post?.content || "";
    const region = post?.region || "";

    return `
"${content}" 이 내용을 참고해서, 일자리 .  

`.trim();
};


const compressImageFromUrl = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const img = new Image();
            img.crossOrigin = "anonymous"; // CORS 허용
            img.src = url;

            await new Promise((res, rej) => {
                img.onload = res;
                img.onerror = rej;
            });

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // 고정 사이즈 640 x 640
            canvas.width = 350;
            canvas.height = 350;

            ctx.drawImage(img, 0, 0, 350, 350);

            let quality = 0.9;

            let blob = await new Promise((res) =>
                canvas.toBlob(res, "image/webp", quality)
            );

            // 180KB 이하로 반복 압축
            while (blob.size > 180 * 1024 && quality > 0.4) {
                quality -= 0.05;
                blob = await new Promise((res) =>
                    canvas.toBlob(res, "image/webp", quality)
                );
            }

            resolve(blob);
        } catch (err) {
            reject(err);
        }
    });
};

const getRandomMood = () => [
    "cheerful", "friendly", "focused", "confident",
    "gentle", "warm-hearted", "enthusiastic", "relaxed"
][Math.floor(Math.random() * 8)];

const getRandomPose = () => [
    "standing with folded arms", "holding a notepad",
    "smiling with hands on hips", "sitting at a table",
    "waving hand", "gently leaning on a counter"
][Math.floor(Math.random() * 6)];

const getRandomBackground = () => [
    "in a cozy home setting", "inside a clean kitchen",
    "in a simple living room", "in front of a small shop",
    "in a calm garden", "at a tidy office desk"
][Math.floor(Math.random() * 6)];


export const generateAiImageFromPrompt = async ({ users_id, prompt }) => {
    console.log("🔥 요청 시작:", { users_id, prompt });

    try {
        const response = await fetch("https://asia-northeast1-help-bbcb5.cloudfunctions.net/generateCreateAiImagFromPrompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ users_id, prompt }),
        });

        console.log("📡 응답 도착", response);

        const result = await response.json();
        console.log("📦 응답 JSON:", result);

        if (!response.ok || !result.imageUrl) {
            const message = result.message || "알 수 없는 오류";
            const errorDetail = result.error || "";
            throw new Error(`[${response.status}] ${message} ${errorDetail}`);
        }



        return result.imageUrl;

    } catch (error) {
        console.error("❌ generateAIImageFromPrompt 실패:", error);


        throw error;
    }
};



export async function generateAndSaveAIImageForWorker({ worker, users_id, promptOverride = null }) {
    try {
        const koPrompt = promptOverride || generateKoreanPromptFromWorker(worker);
        const englishPrompt = await translatePrompt(koPrompt);
        const imageUrl = await generateAiImageFromPrompt({ users_id, prompt: englishPrompt });

        const compressedBlob = await compressImageFromUrl(imageUrl);
        const storageRef = ref(storage, `ai_compressed/${users_id}.webp`);
        await uploadBytes(storageRef, compressedBlob);
        const downloadUrl = await getDownloadURL(storageRef);

        await updateWorkerByUserId(users_id, {
            AI_NEWIMAGE_COMPRESSED: downloadUrl,
            AI_GENERATED: true,
        });

        return downloadUrl;
    } catch (err) {
        console.error("❌ generateAndSaveAIImageForWorker 실패:", err);
        throw err;
    }
}

// 📄 service/workAssetsLegacy.js (선택사항)
// 기존 post 기반 함수 확장: summaryText도 반환하도록

export async function generateAndSaveAIImageForWork({ work, users_id, promptOverride = null }) {
    try {
        // 1) 이미지
        const koPrompt = promptOverride || buildKoPromptForWork({ workType: work?.workType, memo: work?.memo });
        const englishPrompt = await translatePrompt(koPrompt);
        const imageUrlOrigin = await generateAiImageFromPrompt({ users_id, prompt: englishPrompt });

        const compressedBlob = await compressImageFromUrl(imageUrlOrigin);
        const storageRef = ref(storage, `ai_compressed/${users_id}_${Date.now()}.webp`);
        await uploadBytes(storageRef, compressedBlob);
        const imageUrl = await getDownloadURL(storageRef);

        // 2) 요약 + TTS
        const summaryText = await generateSummaryFromPost({ content: work?.memo, region: work?.region, storename: work?.storeName || "우리 가게" });
        const ttsPrompt = makeTTSPrompt({ store: work?.storeName || "우리 가게", summary: summaryText });
        const ttsUrl = await generateAiTTSFromPrompt({ users_id, prompt: ttsPrompt });

        return { imageUrl, ttsUrl, summaryText };
    } catch (err) {
        console.error("❌ generateAndSaveAIImageForWork 실패:", err);
        throw err;
    }
}
  

export async function generateAndSaveAIImageForPost({ post, users_id, promptOverride = null }) {
    try {
        // 1. 이미지 프롬프트 → 번역 → 생성
        const koPrompt = promptOverride || generateKoreanPromptFromPost(post);
        const englishPrompt = await translatePrompt(koPrompt);
        const imageUrl = await generateAiImageFromPrompt({ users_id, prompt: englishPrompt });

        const compressedBlob = await compressImageFromUrl(imageUrl);
        const storageRef = ref(storage, `ai_compressed/${users_id}.webp`);
        await uploadBytes(storageRef, compressedBlob);
        const downloadUrl = await getDownloadURL(storageRef);

        // 2. 요약 → 감성 TTS 멘트 → 음성 생성
        const summaryText = await generateSummaryFromPost(post);

        const ttsPrompt = makeTTSPrompt({
            store: post?.storename || "우리 가게",
            summary: summaryText,
        });

        const ttsUrl = await generateAiTTSFromPrompt({ users_id, prompt: ttsPrompt });

        return {
            imageUrl: downloadUrl,
            ttsUrl,
        };
    } catch (err) {
        console.error("❌ generateAndSaveAIImageForPost 실패:", err);
        throw err;
    }
}
export const generateAiTTSFromPrompt = async ({ users_id, prompt }) => {
    console.log("🔥 요청 시작:", { users_id, prompt });

    try {
        const response = await fetch("https://asia-northeast1-help-bbcb5.cloudfunctions.net/generateCreateTTSFromPrompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ users_id, prompt }),
        });

        console.log("📡 응답 도착", response);

        const result = await response.json();
        console.log("📦 응답 JSON:", result);

        if (!response.ok || !result.ttsUrl) {
            const message = result.message || "알 수 없는 오류";
            const errorDetail = result.error || "";
            throw new Error(`[${response.status}] ${message} ${errorDetail}`);
        }



        return result.ttsUrl;

    } catch (error) {
        console.error("❌ generateAIImageFromPrompt 실패:", error);


        throw error;
    }
};

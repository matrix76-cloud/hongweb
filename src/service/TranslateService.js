
export const translatePrompt = async (text) => {

    console.log("translatePrompt");
    const res = await fetch("https://asia-northeast1-help-bbcb5.cloudfunctions.net/translateKoToEn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    const result = await res.json();

    console.log("🌐 Papago 응답:", result); // 추가
    
    return result.translatedText;
}; 
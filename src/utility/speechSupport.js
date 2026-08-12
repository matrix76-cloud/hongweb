function sendToRN(type, payload = {}) {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type, ...payload }));
}
export function startDictationFallback(lang = 'ko-KR') {
    sendToRN('VOICE_START', { lang });
}
export function stopDictationFallback() {
    sendToRN('VOICE_STOP');
}
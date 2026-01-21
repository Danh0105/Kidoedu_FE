let cachedVoices = [];

function loadVoices() {
    return new Promise((resolve) => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length) {
            cachedVoices = voices;
            resolve(voices);
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                cachedVoices = window.speechSynthesis.getVoices();
                resolve(cachedVoices);
            };
        }
    });
}

export async function speak(text) {
    if (!("speechSynthesis" in window)) return;

    const voices = cachedVoices.length
        ? cachedVoices
        : await loadVoices();

    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "vi-VN";
    msg.rate = 1;
    msg.pitch = 1;
    msg.volume = 1;

    // 🎯 ƯU TIÊN GIỌNG VIỆT
    const viVoice =
        voices.find(v => v.lang === "vi-VN" && v.name.toLowerCase().includes("female")) ||
        voices.find(v => v.lang === "vi-VN") ||
        voices.find(v => v.lang.startsWith("vi"));

    if (viVoice) {
        msg.voice = viVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}

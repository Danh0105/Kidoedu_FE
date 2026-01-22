let cachedVoices = [];
let voicesLoaded = false;

function loadVoices() {
    return new Promise((resolve) => {
        if (voicesLoaded && cachedVoices.length) {
            resolve(cachedVoices);
            return;
        }

        const voices = speechSynthesis.getVoices();
        if (voices.length) {
            cachedVoices = voices;
            voicesLoaded = true;
            resolve(voices);
            return;
        }

        speechSynthesis.onvoiceschanged = () => {
            cachedVoices = speechSynthesis.getVoices();
            voicesLoaded = true;
            speechSynthesis.onvoiceschanged = null;
            resolve(cachedVoices);
        };
    });
}

function pickVietnameseVoice(voices) {
    return (
        voices.find(v =>
            v.lang === "vi-VN" &&
            /hoaimy|female|google/i.test(v.name)
        ) ||
        voices.find(v => v.lang === "vi-VN") ||
        voices.find(v => v.lang.startsWith("vi"))
    );
}

export async function speak(text) {
    if (!("speechSynthesis" in window)) return;

    const voices = await loadVoices();
    const voice = pickVietnameseVoice(voices);

    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "vi-VN";
    msg.voice = voice || null;
    msg.rate = 1;
    msg.pitch = 1;
    msg.volume = 1;

    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
}

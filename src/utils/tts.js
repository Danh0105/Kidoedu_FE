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

/**
 * 🎀 Ưu tiên giọng nữ dễ thương
 */
function pickCuteFemaleVietnameseVoice(voices) {
    return (
        // 1️⃣ Google nữ (nghe tự nhiên nhất)
        voices.find(v =>
            v.lang === "vi-VN" &&
            /google/i.test(v.name)
        ) ||

        // 2️⃣ Hoài My / Female
        voices.find(v =>
            v.lang === "vi-VN" &&
            /hoai|my|female|woman/i.test(v.name)
        ) ||

        // 3️⃣ Bất kỳ giọng Việt nào
        voices.find(v => v.lang === "vi-VN") ||

        // 4️⃣ Fallback
        voices.find(v => v.lang.startsWith("vi"))
    );
}

export async function speak(text) {
    if (!("speechSynthesis" in window)) return;

    const voices = await loadVoices();
    const voice = pickCuteFemaleVietnameseVoice(voices);

    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "vi-VN";
    msg.voice = voice || null;

    // 🎵 TINH CHỈNH CHO GIỌNG DỄ THƯƠNG
    msg.rate = 0.95;   // nói chậm hơn chút
    msg.pitch = 1.25;  // cao hơn → nữ tính
    msg.volume = 1;

    speechSynthesis.cancel(); // tránh chồng tiếng
    speechSynthesis.speak(msg);
}

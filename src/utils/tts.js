let currentAudio = null;

export async function speak(text) {
    try {
        // Dừng audio cũ (tránh chồng tiếng)
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        const res = await fetch(
            `${process.env.REACT_APP_API_URL}/tts`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            }
        );

        if (!res.ok) {
            console.error("TTS error", res.status);
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        currentAudio = new Audio(url);
        currentAudio.volume = 1;
        await currentAudio.play();

    } catch (err) {
        console.error("TTS failed:", err);
    }
}

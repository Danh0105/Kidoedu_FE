import confetti from "canvas-confetti";

let timer = null;

// 🌟 bảng màu vàng phát sáng
const GOLD_COLORS = [
    "#fff7cc", // vàng trắng
    "#ffeb3b", // vàng sáng
    "#ffd700", // gold
    "#ffb300", // amber
];

export function startFireworks() {
    if (timer) return;

    timer = setInterval(() => {
        // ===== BÊN TRÁI =====
        glowBurst({
            angle: 60,
            origin: { x: 0, y: 0.7 },
        });

        // ===== BÊN PHẢI =====
        glowBurst({
            angle: 120,
            origin: { x: 1, y: 0.7 },
        });
    }, 1200);
}

function glowBurst({ angle, origin }) {
    // 🌟 LỚP NGOÀI (to – mờ – tạo glow)
    confetti({
        particleCount: 20,
        angle,
        spread: 60,
        scalar: 2.2,
        gravity: 0.6,
        colors: ["#fff9c4"],
        origin,
    });

    // ✨ LỚP TRONG (nhỏ – sáng – sắc nét)
    confetti({
        particleCount: 35,
        angle,
        spread: 55,
        scalar: 1.6,
        gravity: 0.9,
        colors: GOLD_COLORS,
        origin,
    });
}

export function stopFireworks() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

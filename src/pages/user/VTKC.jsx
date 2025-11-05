import React, { useEffect, useMemo, useRef, useState } from "react";

// ✅ Single-file React component using Bootstrap 5 utility classes
// How to use:
// 1) Include Bootstrap 5 CSS & JS in index.html (CDN):
//    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
//    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
// 2) (Optional) Bootstrap Icons:
//    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
// 3) Host a local image at /cake.jpg (or keep the fallback), then render <BirthdayKimChi />
import mp3 from '../../assets/user/Happy Birthday To You.mp3'
export default function BirthdayKimChi() {
    // THEME & UI
    const [theme, setTheme] = useState("sunrise"); // sunrise | aurora | candy | royal | ocean | sunset
    const [accent, setAccent] = useState("#ff4d6d");
    const [showConfetti, setShowConfetti] = useState(true);

    // MESSAGE
    const [signature, setSignature] = useState("Gia đình & Bạn bè");
    const [wish, setWish] = useState("");

    // MUSIC
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [track, setTrack] = useState(mp3); // Royalty-free

    // EXPORT
    const cardRef = useRef(null);

    // PRESET WISHES
    const wishes = useMemo(
        () => [
            "Chúc Chi luôn rạng rỡ như ánh mặt trời, gặp nhiều điều may mắn và yêu thương ngập tràn!",
            "Tuổi mới thật nhiều sức khỏe, thêm vạn niềm vui, và tất cả dự định đều thành công ngoài mong đợi!",
            "Chúc Chi một năm đầy cảm hứng: làm việc hăng say – sống thật chất – hạnh phúc mỗi ngày!",
            "Mong mọi điều an lành, bình yên và nở rộ những cơ hội tuyệt vời ở phía trước!",
            "Chúc Chi càng ngày càng xinh đẹp, tự tin, tỏa sáng và luôn là phiên bản tuyệt nhất của chính mình!",
        ],
        []
    );

    // pick a random wish on first load
    useEffect(() => {
        setWish(wishes[Math.floor(Math.random() * wishes.length)]);
    }, [wishes]);

    // bind accent color variable
    useEffect(() => {
        document.documentElement.style.setProperty("--accent", accent);
    }, [accent]);

    // THEME switcher
    const themes = [
        { key: "sunrise", label: "Sunrise" },
        { key: "aurora", label: "Aurora" },
        { key: "candy", label: "Candy" },
        { key: "royal", label: "Royal" },
        { key: "ocean", label: "Ocean" },
        { key: "sunset", label: "Sunset" },
    ];
    const switchTheme = () => {
        const order = themes.map((t) => t.key);
        const idx = order.indexOf(theme);
        setTheme(order[(idx + 1) % order.length]);
    };
    // autotheme
    useEffect(() => {
        const order = themes.map((t) => t.key);
        const interval = setInterval(() => {
            setTheme((prev) => {
                const idx = order.indexOf(prev);
                return order[(idx + 1) % order.length];
            });
        }, 1500); // đổi mỗi 10 giây

        return () => clearInterval(interval); // cleanup
    }, []);
    useEffect(() => {
        const autoPlay = async () => {
            const el = audioRef.current;
            if (!el) return;

            try {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (Ctx) {
                    if (!window.__appAudioCtx) window.__appAudioCtx = new Ctx();
                    await window.__appAudioCtx.resume();
                }

                el.muted = false;
                el.volume = 1;
                await el.play();
                setIsPlaying(true);
            } catch (err) {
                console.warn("Autoplay failed", err);
            }
        };

        autoPlay();
    }, []);

    // SHARE
    const shareWish = async () => {
        const url = window.location.href;
        const text = `🎂 Chúc mừng sinh nhật Vũ Thị Kim Chi!

${wish}
— ${signature}`;
        if (navigator.share) {
            try { await navigator.share({ title: "Happy Birthday Kim Chi", text, url }); return; } catch (_) { }
        }
        await navigator.clipboard.writeText(`${text}
${url}`);
        alert("Đã sao chép lời chúc & link vào clipboard! ✨");
    };

    const shareToFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        const quote = encodeURIComponent(`${wish} — ${signature}`);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, "_blank", "noopener,noreferrer,width=600,height=600");
    };

    const shareToZalo = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`${wish} — ${signature}`);
        // Simple web share link (Zalo app will handle on devices with Zalo installed)
        window.open(`https://zalo.me/share?url=${url}&text=${text}`, "_blank", "noopener,noreferrer,width=600,height=600");
    };

    // MUSIC controls


    const togglePlay = async () => {
        const el = audioRef.current;
        if (!el) return;
        try {
            if (isPlaying) {
                el.pause();
                setIsPlaying(false);
            } else {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (Ctx) {
                    if (!window.__appAudioCtx) window.__appAudioCtx = new Ctx();
                    await window.__appAudioCtx.resume();
                }
                el.muted = false;
                if (el.volume === 0) el.volume = 1;
                if (el.readyState < 2) el.load();
                await el.play();
                setIsPlaying(true);
            }
        } catch (e) {
            console.warn('Play error', e);
            alert('Không phát được nhạc. Hãy thử chọn bài khác hoặc dùng file nội bộ /music.mp3, và kiểm tra chế độ im lặng/âm lượng.');
        }
    };

    const onChangeTrack = (url) => {
        setTrack(url);
        const el = audioRef.current;
        if (!el) return;
        el.pause();
        el.src = url; // force swap
        setTimeout(async () => {
            try {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (Ctx) {
                    if (!window.__appAudioCtx) window.__appAudioCtx = new Ctx();
                    await window.__appAudioCtx.resume();
                }
                el.muted = false;
                if (el.volume === 0) el.volume = 1;
                await el.play();
                setIsPlaying(true);
            } catch (err) {
                console.warn('Autoplay/load failed', err);
                setIsPlaying(false);
            }
        }, 150);
    };

    // EXPORT PNG using html-to-image (requires CORS-safe images or same-origin assets)
    /*  const exportPNG = async () => {
         if (!cardRef.current) return;
         try {
             const { toPng } = await import("html-to-image");
             const dataUrl = await toPng(cardRef.current, {
                 cacheBust: true,
                 pixelRatio: 2,
                 quality: 1,
                 filter: (node) => !(node.tagName === 'AUDIO'),
             });
             const a = document.createElement("a");
             a.href = dataUrl;
             a.download = `HappyBirthday_VuThiKimChi_${Date.now()}.png`;
             document.body.appendChild(a);
             a.click();
             a.remove();
         } catch (err) {
             console.error("Export PNG error:", err);
             alert("Xuất PNG chưa thành công. Kiểm tra lại nguồn ảnh (CORS) hoặc dùng ảnh nội bộ /cake.jpg rồi thử lại!");
         }
     }; */

    // CONFETTI pieces (static)
    const confettiPieces = useMemo(() => {
        const count = 120;
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // vw
            delay: Math.random() * 3, // s
            duration: 5 + Math.random() * 4, // s
            size: 6 + Math.random() * 8, // px
            rotate: Math.random() * 360,
        }));
    }, []);

    return (
        <div className={`min-vh-100 d-flex align-items-stretch ${theme}`}>
            <style>{styles}</style>

            {/* Decorative background shapes */}
            <div className="bg-glow" />
            <div className="bg-orb orb-1" />
            <div className="bg-orb orb-2" />
            <div className="bg-orb orb-3" />

            {/* Confetti */}
            {showConfetti && (
                <div className="confetti-wrap pointer-events-none">
                    {confettiPieces.map((p) => (
                        <span
                            key={p.id}
                            className="confetti"
                            style={{
                                left: `${p.left}vw`,
                                animationDelay: `${p.delay}s`,
                                animationDuration: `${p.duration}s`,
                                width: p.size,
                                height: p.size * 0.4,
                                transform: `rotate(${p.rotate}deg)`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="container py-5 position-relative">


                {/* CARD */}
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10">
                        <div ref={cardRef} className="card shadow-lg border-0 overflow-hidden rounded-4 birthday-card">
                            <div className="position-relative">
                                {/* Hero */}
                                <div className="hero p-4 p-md-5 text-center text-light">
                                    <div className="display-6 fw-bold text-shadow lh-1">Chúc mừng sinh nhật</div>
                                    <h1 className="display-4 fw-black mb-3 text-shadow">Vũ Thị Kim Chi</h1>
                                    <p className="lead mb-0 fw-bold text-shadow lh-1">Ngày hôm nay là của Chi — hãy tỏa sáng, tận hưởng và cười thật nhiều nhé! ✨</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="card-body p-4 p-md-5">
                                <div className="row g-4 align-items-center">
                                    <div className="col-12 col-md-5">
                                        <div className="photo-frame ratio ratio-1x1 rounded-4 overflow-hidden shadow-sm">
                                            <img crossOrigin="anonymous" src="/cake.jpg" alt="Birthday Cake" className="object-fit-cover" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/id/1062/1200/1200.jpg'; }} />
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-7">
                                        <div className="p-3 p-md-4 rounded-4 bg-light-subtle border">
                                            <h2 className="h3 fw-bold mb-3">Lời chúc dành cho Chi 🎁</h2>
                                            <p className="fs-5 mb-4" style={{ lineHeight: 1.7 }}>{wish}</p>

                                            <div className="row g-2 align-items-center mb-3">
                                                <div className="col-auto"><label className="form-label fw-semibold mb-0">Ký tên:</label></div>
                                                <div className="col">
                                                    <input className="form-control form-control-lg" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Người gửi" />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-wrap gap-2">
                                                <button className="btn btn-primary btn-lg" onClick={shareWish}><i className="bi bi-send me-2" />Chia sẻ lời chúc</button>
                                                <button className="btn btn-outline-primary btn-lg" onClick={() => setWish(wishes[Math.floor(Math.random() * wishes.length)])}><i className="bi bi-stars me-2" />Đổi lời chúc khác</button>
                                                <button className={`btn btn-${showConfetti ? "warning" : "success"} btn-lg`} onClick={() => setShowConfetti((s) => !s)}>
                                                    {showConfetti ? "Tắt pháo giấy" : "Bật pháo giấy"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* chips */}
                                        <div className="mt-4 d-flex flex-wrap gap-2">
                                            {["Sức khỏe", "Niềm vui", "Thành công", "An yên", "Yêu thương"].map((chip) => (
                                                <span key={chip} className="badge rounded-pill bg-accent-soft border px-3 py-2">{chip}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer bg-transparent border-0 text-center pb-4">
                                <small className="text-muted">Made with 💖 for Kim Chi — {new Date().getFullYear()}</small>
                            </div>
                        </div>

                        {/* Hashtags */}
                        <div className="d-flex justify-content-center gap-2 mt-4">
                            {["#KimChiBirthday", "#HappyBirthday", "#WeLoveYou"].map((tag) => (
                                <a key={tag} href="#" className="btn btn-link link-light text-decoration-none" onClick={(e) => e.preventDefault()}>{tag}</a>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Hidden audio element */}
            <audio ref={audioRef} src={track} preload="auto" crossOrigin="anonymous" playsInline onError={() => alert('Không phát được nhạc. Thử chọn bài khác hoặc dùng /music.mp3')} />
        </div>
    );
}

const styles = `
  :root { --accent: #ff4d6d; }

  /* ---------- THEME BACKGROUNDS ---------- */
  .sunrise { background: radial-gradient(1200px 800px at 10% 10%, #ffe6a7 0%, transparent 60%), linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%); }
  .aurora { background: radial-gradient(900px 650px at 85% 15%, rgba(120,255,214,.35) 0%, transparent 60%), linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%); }
  .candy { background: radial-gradient(900px 650px at 10% 90%, rgba(255,255,255,.4) 0%, transparent 55%), linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%); }
  .royal { background: radial-gradient(45% 35% at 80% 20%, rgba(255,255,255,.2), transparent 60%), linear-gradient(135deg, #200122 0%, #6f0000 100%); }
  .ocean { background: radial-gradient(60% 40% at 20% 20%, rgba(255,255,255,.18), transparent 60%), linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); }
  .sunset { background: radial-gradient(60% 40% at 50% 0%, rgba(255,255,255,.18), transparent 60%), linear-gradient(135deg, #f12711 0%, #f5af19 100%); }

  .bg-glow { position: fixed; inset: 0; pointer-events: none; background: radial-gradient(60% 40% at 50% 0%, rgba(255,255,255,.15), transparent 70%); }
  .bg-orb { position: fixed; width: 40vmin; height: 40vmin; border-radius: 50%; filter: blur(20px); opacity: .35; pointer-events: none; }
  .orb-1 { top: 8%; left: 6%; background: var(--accent); animation: float 10s ease-in-out infinite; }
  .orb-2 { bottom: 8%; right: 10%; background: #a18cd1; animation: float 12s ease-in-out infinite reverse; }
  .orb-3 { bottom: 15%; left: 40%; background: #6ef3d6; animation: float 14s ease-in-out infinite; }

  @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }

  /* ---------- CARD / HERO ---------- */
  .birthday-card { backdrop-filter: blur(4px); background: rgba(255,255,255,.88); }
  .hero { background: linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.2)), url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat; min-height: 280px; }
  .text-shadow { text-shadow: 0 6px 24px rgba(0,0,0,.35); }
  .fw-black { font-weight: 900; }

  .photo-frame img { transition: transform .6s ease; }
  .photo-frame:hover img { transform: scale(1.05) rotate(-.5deg); }

  /* ---------- RIBBON ---------- */
  .ribbon { position: absolute; top: 18px; left: -10px; z-index: 1; }
  .ribbon span { position: relative; display: inline-block; background: var(--accent); color: #fff; padding: .5rem 1.25rem; font-weight: 800; letter-spacing: .5px; border-radius: .5rem; box-shadow: 0 8px 20px color-mix(in oklab, var(--accent), black 35%); }
  .ribbon span::after { content: ""; position: absolute; left: 8px; bottom: -10px; border: 10px solid transparent; border-top-color: color-mix(in oklab, var(--accent), black 30%); filter: drop-shadow(0 2px 0 rgba(0,0,0,.15)); }

  /* ---------- BADGES ---------- */
  .bg-accent-soft { background: color-mix(in oklab, var(--accent), white 85%); color: color-mix(in oklab, var(--accent), black 15%); }

  /* ---------- CONFETTI ---------- */
  .confetti-wrap { position: fixed; inset: 0; overflow: hidden; }
  .confetti { position: absolute; top: -10vh; border-radius: 2px; background: linear-gradient(135deg, #ffffff, #ffffff); box-shadow: 0 0 0 1px rgba(0,0,0,.05) inset; animation-name: fall, sway; animation-timing-function: linear, ease-in-out; animation-iteration-count: infinite; }
  @keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }
  @keyframes sway { 0%, 100% { margin-left: 0 } 50% { margin-left: 16px } }
html, body {
transition: background 2s ease-in-out, filter 1.5s ease;
}
.sunrise, .aurora, .candy, .royal, .ocean, .sunset {
transition: background 2s ease-in-out, filter 1.5s ease;
will-change: background;
}


.theme-transition {
animation: fadeTheme 2s ease-in-out;
}


@keyframes fadeTheme {
from { filter: brightness(0.95) saturate(0.8); }
to { filter: brightness(1) saturate(1); }
}

`;

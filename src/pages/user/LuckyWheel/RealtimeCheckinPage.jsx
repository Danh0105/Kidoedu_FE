import { useEffect, useRef, useState } from "react";
import { speak } from "../../../utils/tts";
import "../../../components/user/css/RealtimeCheckinPage.css";
import { startFireworks } from "../../../utils/fireworks";

export default function RealtimeCheckinPage() {
    const [currentGuest, setCurrentGuest] = useState(null);
    const [lastId, setLastId] = useState(null);
    const [voiceEnabled, setVoiceEnabled] = useState(true);

    const isFirstLoad = useRef(true);
    const hideTimer = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/participants/checked-in`
                );
                const data = await res.json();

                if (!data.length) return;
                console.log("Fetched data:", data);

                const newest = data[0];
                console.log("Newest participant:", newest);
                // ❌ Không đọc lần load đầu
                /*   if (isFirstLoad.current) {
                      isFirstLoad.current = false;
                      setLastId(newest.id);
                      return;
                  } */
                if (!newest.avatar) {
                    return;
                }
                console.log("Newest avatar:", newest.avatar);
                // hoặc nếu backend trả avatar rỗng
                if (typeof newest.avatar === "string" && newest.avatar.trim() === "") {
                    return;
                }
                console.log("Last ID:", lastId, "Newest ID:", newest.id);
                if (newest.id !== lastId) {
                    setLastId(newest.id);
                    setCurrentGuest(newest);
                    console.log("New check-in:", newest);
                    speak(
                        `Chào mừng ${newest.fullName} - ${newest.position} đã đến tham dự tiệc tất niên`,
                        () => {
                            // ✅ Ẩn thông báo NGAY khi đọc xong
                            setCurrentGuest(null);
                        }
                    );

                    startFireworks();

                    // ⏱️ Ẩn sau 6 giây
                    /*                  if (hideTimer.current) {
                                         clearTimeout(hideTimer.current);
                                     }
                 
                                     hideTimer.current = setTimeout(() => {
                                         setCurrentGuest(null);
                                     }, 6000); */
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        const timer = setInterval(fetchData, 3000);
        return () => clearInterval(timer);
    }, [lastId, voiceEnabled]);

    return (
        <div className="bg-checkin d-flex justify-content-center align-items-center min-vh-100">
            {/* Toggle voice */}
            <button
                className={`btn position-fixed top-0 end-0 m-3 ${voiceEnabled ? "btn-success" : "btn-outline-secondary"
                    }`}
                onClick={() => {
                    setVoiceEnabled(true);

                    // 🔓 unlock speech
                    const utter = new SpeechSynthesisUtterance(" ");
                    utter.volume = 0;
                    speechSynthesis.speak(utter);
                }}
            >
                🔊 Bật giọng đọc
            </button>


            {/* ===== HIỂN THỊ KHÁCH MỚI ===== */}
            {currentGuest && (
                <div className="guest-card text-center animate-fade-in">
                    <img
                        src={`${process.env.REACT_APP_API_URL}${currentGuest.avatar}`}
                        alt={currentGuest.fullName}
                        className="rounded-circle mb-4 guest-avatar"
                        width={600}
                        height={600}
                    />

                    <h1 className="guest-name">
                        {currentGuest.fullName}
                    </h1>

                    <h2 className="guest-position">
                        {currentGuest.position}
                    </h2>

                    <p className="text-light fs-4 mt-3">
                        Welcome to Year End Party 🎉
                    </p>
                </div>

            )}
        </div>
    );
}

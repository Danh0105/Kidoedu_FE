import { useEffect, useRef, useState } from "react";
import { speak } from "../../utils/tts";
import "../../components/user/css/RealtimeCheckinPage.css";
import { startFireworks } from "../../utils/fireworks";

export default function RealtimeCheckinPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [lastId, setLastId] = useState(null);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const isFirstLoad = useRef(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    "http://localhost:3000/participants/checked-in"
                );
                const data = await res.json();

                if (data.length) {
                    const newest = data[0];

                    setLastId((prevId) => {
                        if (isFirstLoad.current) {
                            isFirstLoad.current = false;
                            return newest.id; // ❌ không đọc lần đầu
                        }

                        if (prevId !== newest.id) {
                            if (voiceEnabled) {
                                speak(`Xin chào ${newest.fullName} đã đến tham dự Year End Party`);
                            }
                            return newest.id;
                        }
                        return prevId;
                    });
                }


                setList(data);
                setLastUpdated(new Date());
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        };
        startFireworks();
        fetchData();
        const timer = setInterval(fetchData, 3000);
        return () => clearInterval(timer);
    }, [voiceEnabled]);


    return (
        <div className="bg-checkin">
            <div className="container px-4 py-4 min-vh-100 bg-transparent">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <button
                        className={`btn btn-sm ${voiceEnabled ? "btn-success" : "btn-outline-secondary"
                            }`}
                        onClick={() => {
                            setVoiceEnabled((v) => {
                                const next = !v;
                                if (!v && next) {
                                    speak("Hệ thống đã sẵn sàng thông báo");
                                }
                                return next;
                            });
                        }}

                    >
                        🔊 {voiceEnabled ? "Đã bật giọng đọc" : "Bật giọng đọc"}
                    </button>
                </div>

                {/* ===== Stats Cards ===== */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex align-items-center gap-3">
                                <div className="fs-2 text-success">
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div>
                                    <div className="text-muted small">
                                        Trạng thái
                                    </div>
                                    <div className="fw-bold">
                                        Đang hoạt động
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex align-items-center gap-3">
                                <div className="fs-2 text-primary">
                                    <i className="bi bi-clock-history"></i>
                                </div>
                                <div>
                                    <div className="text-muted small">
                                        Lần cập nhật gần nhất
                                    </div>
                                    <div className="fw-semibold">
                                        {lastUpdated
                                            ? lastUpdated.toLocaleTimeString()
                                            : "--"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex align-items-center gap-3">
                                <div className="fs-2 text-warning">
                                    <i className="bi bi-person-badge-fill"></i>
                                </div>
                                <div>
                                    <div className="text-muted small">
                                        Tổng số khách
                                    </div>
                                    <div className="fw-bold fs-5">
                                        {list.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== Table ===== */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white fw-semibold">
                        <i className="bi bi-list-check me-2"></i>
                        Danh sách check-in
                    </div>

                    <div className="card-body p-0">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: 60 }}>#</th>
                                    <th>Khách hàng</th>
                                    <th>Email</th>
                                    <th className="text-end">
                                        <i className="bi bi-clock me-1"></i>
                                        Thời gian
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5">
                                            <div className="spinner-border text-primary" />
                                            <div className="mt-2 text-muted">
                                                Đang tải dữ liệu…
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {!loading && list.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5 text-muted">
                                            <i className="bi bi-inbox fs-3 d-block mb-2"></i>
                                            Chưa có khách nào check-in
                                        </td>
                                    </tr>
                                )}

                                {list.map((p, idx) => (
                                    <tr key={p.id}>
                                        <td className="text-muted">
                                            {idx + 1}
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                {/* Avatar */}
                                                <div
                                                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    <i className="bi bi-person-fill"></i>
                                                </div>

                                                <div>
                                                    <div className="fw-semibold">
                                                        {p.fullName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="text-muted">
                                            <i className="bi bi-envelope me-1"></i>
                                            {p.email}
                                        </td>

                                        <td className="text-end fw-semibold">
                                            {new Date(p.checkedInAt).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

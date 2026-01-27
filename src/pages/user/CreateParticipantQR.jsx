import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Logoct from "../../assets/user/Logo.png";
export default function CreateParticipantQR() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [participant, setParticipant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [position, setPosition] = useState("");
    const qrRef = useRef(null);

    const handleCreate = async () => {
        if (!fullName.trim()) {
            setStatus("Vui lòng nhập tên khách mời");
            return;
        }

        setLoading(true);
        setStatus("");
        console.log({ fullName, email, position });
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/participants`,

                /* `http://localhost:3000/participants`, */
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fullName, email: email || undefined, position: position || undefined }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setParticipant(data);
        } catch (err) {
            setStatus(err.message || "Lỗi tạo QR");
        } finally {
            setLoading(false);
        }
    };

    const qrValue = participant
        ? `https://www.kidoedu.edu.vn/checkin?code=${participant.qrCode}`
        : "";

    const downloadQR = async () => {
        const qrCanvas = qrRef.current?.querySelector("canvas");
        if (!qrCanvas || !participant) return;

        const size = qrCanvas.width;

        // Tạo canvas mới
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = size;
        finalCanvas.height = size;

        const ctx = finalCanvas.getContext("2d");

        // Vẽ QR trước
        ctx.drawImage(qrCanvas, 0, 0);

        // Load logo
        const logoImg = new Image();
        logoImg.src = Logoct;
        logoImg.crossOrigin = "anonymous";

        logoImg.onload = () => {
            const logoSize = size * 0.2; // 20%
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;

            // Nền trắng dưới logo
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, logoSize / 2 + 8, 0, Math.PI * 2);
            ctx.fill();

            // Vẽ logo
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);

            // Download
            const url = finalCanvas.toDataURL("image/png");
            const a = document.createElement("a");

            a.href = url;
            a.download = `qr-${participant.fullName
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "_")
                .toLowerCase()}.png`;

            a.click();
        };
    };


    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div
                style={{
                    width: 500,
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 16,
                    textAlign: "center",
                }}
            >
                <h5>Tạo QR khách mời</h5>

                <input
                    className="form-control mt-2"
                    placeholder="Họ và tên"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <input
                    className="form-control mt-2"
                    placeholder="Chức vụ (không bắt buộc)"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                />

                <button
                    className="btn btn-sm btn-success mt-3 w-100"
                    onClick={handleCreate}
                    disabled={loading}
                >
                    {loading ? "Đang tạo..." : "Tạo QR"}
                </button>

                {status && (
                    <div style={{ marginTop: 8, fontSize: 13, color: "red" }}>
                        {status}
                    </div>
                )}

                {participant && (
                    <>
                        <div
                            ref={qrRef}
                            style={{
                                position: "relative",
                                width: 300,
                                height: 300,
                                margin: "16px auto",
                            }}
                        >
                            <QRCodeCanvas
                                value={qrValue}
                                size={300}        // ✅ đồng bộ với container
                                level="H"
                                includeMargin
                            />

                            <img
                                src={Logoct}
                                alt="logo"
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: 60,
                                    height: 60,
                                    borderRadius: 50,
                                    background: "#fff",
                                    padding: 6,
                                }}
                            />
                        </div>


                        <h6>{participant.fullName}</h6>

                        <button
                            className="btn btn-sm btn-outline-primary mt-2 w-100"
                            onClick={downloadQR}
                        >
                            ⬇️ Tải QR
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

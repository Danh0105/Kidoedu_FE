import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

export default function ParticipantQrCard({ participant }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const sendEmail = async () => {
        setLoading(true);
        setStatus("");

        try {
            const res = await fetch(
                `http://localhost:3000/participants/${participant.id}/send-invite`,
                { method: "POST" }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setStatus("Đã gửi");
        } catch (err) {
            setStatus("Lỗi");
        } finally {
            setLoading(false);
        }
    };

    const qrValue = `${window.location.origin}/checkin?code=${participant.qrCode}`;

    return (
        <div
            style={{
                width: 260,
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                textAlign: "center",
            }}
        >
            <QRCodeCanvas value={qrValue} size={180} />
            <h5 style={{ marginTop: 12 }}>{participant.fullName}</h5>

            <button
                className="btn btn-sm btn-primary mt-2"
                onClick={sendEmail}
                disabled={loading}
            >
                {loading ? "Đang gửi..." : "Gửi email"}
            </button>

            {status && (
                <div
                    style={{
                        marginTop: 8,
                        fontSize: 13,
                        color: status === "Đã gửi" ? "green" : "red",
                    }}
                >
                    {status}
                </div>
            )}
        </div>
    );
}

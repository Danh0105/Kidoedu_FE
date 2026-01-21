import { useEffect, useState } from "react";

export default function CheckinPage() {
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const [participant, setParticipant] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code"); // ⭐ chỉ lấy code, bỏ qua gidzl

        if (!code) {
            setStatus("error");
            setMessage("QR không hợp lệ");
            return;
        }

        fetch("http://localhost:3000/participants/checkin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ qrCode: code }),
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Check-in thất bại");
                }

                setParticipant(data);
                setStatus("success");
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.message);
            });
    }, []);

    // ⏳ Loading
    if (status === "loading") {
        return <h3 style={{ textAlign: "center" }}>Đang check-in...</h3>;
    }

    // ❌ Error
    if (status === "error") {
        return (
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <h3 style={{ color: "red" }}>❌ Check-in thất bại</h3>
                <p>{message}</p>
            </div>
        );
    }

    // ✅ Success
    return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
            <h3 style={{ color: "green" }}>✅ Check-in thành công</h3>
            <p>
                Xin chào <b>{participant.fullName}</b>
            </p>
            <small>
                Thời gian:{" "}
                {new Date(participant.checkedInAt).toLocaleString()}
            </small>
        </div>
    );
}

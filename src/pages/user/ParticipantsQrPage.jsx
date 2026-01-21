import { useEffect, useState } from "react";
import ParticipantQrCard from "../../components/user/ParticipantQrCard";

export default function ParticipantsQrPage() {
    const [participants, setParticipants] = useState([]);
    const [sendingAll, setSendingAll] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/participants")
            .then((res) => res.json())
            .then(setParticipants);
    }, []);

    const sendAllEmails = async () => {
        if (!window.confirm("Gửi email mời cho tất cả khách?")) return;

        setSendingAll(true);
        try {
            await fetch(
                "http://localhost:3000/participants/send-invite-all",
                { method: "POST" }
            );
            alert("Đã đưa toàn bộ email vào hàng đợi gửi");
        } catch {
            alert("Gửi thất bại");
        } finally {
            setSendingAll(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h4>Danh sách khách mời</h4>

                <button
                    className="btn btn-success"
                    onClick={sendAllEmails}
                    disabled={sendingAll}
                >
                    {sendingAll ? "Đang gửi..." : "Gửi email cho tất cả"}
                </button>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 20,
                    marginTop: 20,
                }}
            >
                {participants.map((p) => (
                    <ParticipantQrCard key={p.id} participant={p} />
                ))}
            </div>
        </div>
    );
}

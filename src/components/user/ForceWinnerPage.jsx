import React, { useEffect, useState } from "react";

export default function ForceWinnerPage() {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ===== LOAD PARTICIPANTS ===== */
    const loadParticipants = async () => {
        const res = await fetch("http://localhost:3000/participants");
        const data = await res.json();

        setParticipants(
            data.filter(p => p.isCheckedIn && !p.isWinner)
        );
    };

    useEffect(() => {
        loadParticipants();
    }, []);

    /* ===== SET / UNSET FORCED WINNER ===== */
    const setForcedWinner = async (participantId) => {
        setLoading(true);

        await fetch(
            "http://localhost:3000/participants/force-winner",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participantId }),
            }
        );

        await loadParticipants();
        setLoading(false);
    };

    const clearForcedWinner = async () => {
        setLoading(true);

        await fetch(
            "http://localhost:3000/participants/clear-force-winner",
            { method: "POST" }
        );

        await loadParticipants();
        setLoading(false);
    };

    return (
        <div className="container py-5">
            <h3 className="mb-4 text-center">
                🎯 Chọn người chắc chắn trúng giải
            </h3>

            <div className="text-center mb-3">
                <button
                    className="btn btn-outline-secondary"
                    onClick={clearForcedWinner}
                    disabled={loading}
                >
                    ❌ Bỏ chọn (random bình thường)
                </button>
            </div>

            <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Họ tên</th>
                        <th>Check-in</th>
                        <th>Chắc chắn trúng</th>
                    </tr>
                </thead>

                <tbody>
                    {participants.map((p, index) => (
                        <tr
                            key={p.id}
                            className={p.isForcedWinner ? "table-success" : ""}
                        >
                            <td>{index + 1}</td>
                            <td className="fw-bold">{p.fullName}</td>
                            <td>
                                {p.isCheckedIn ? "✅" : "❌"}
                            </td>
                            <td>
                                <input
                                    type="radio"
                                    name="forcedWinner"
                                    checked={p.isForcedWinner}
                                    disabled={loading}
                                    onChange={() =>
                                        setForcedWinner(p.id)
                                    }
                                />
                            </td>
                        </tr>
                    ))}

                    {participants.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-muted">
                                Không có participant hợp lệ
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

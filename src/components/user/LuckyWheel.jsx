import { useEffect, useRef, useState } from "react";
import { getParticipants, spinParticipant } from "../../services/participants.api";
import '../user/css/LuckyWheel.css'
export default function LuckyWheel() {
    const wheelRef = useRef(null);

    const [participants, setParticipants] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        loadParticipants();
    }, []);

    const loadParticipants = async () => {
        const res = await getParticipants();
        setParticipants(res.data);
    };

    const handleSpin = async () => {
        if (spinning || participants.length === 0) return;
        setSpinning(true);

        const res = await spinParticipant();
        const { winner, remaining } = res.data;

        const index = participants.findIndex(p => p.id === winner.id);
        const slice = 360 / participants.length;

        const angle =
            360 * 6 + // quay 6 vòng
            index * slice +
            slice / 2;

        wheelRef.current.style.transition =
            "transform 5s cubic-bezier(0.33, 1, 0.68, 1)";
        wheelRef.current.style.transform = `rotate(${angle}deg)`;

        setTimeout(() => {
            setWinner(winner);
            setParticipants(remaining);
            setSpinning(false);
        }, 5000);
    };

    return (
        <div className="wheel-container">
            <h1>🎉 VÒNG QUAY MAY MẮN 🎉</h1>

            <div className="wheel-wrapper">
                <div className="pointer">▼</div>

                <div className="wheel" ref={wheelRef}>
                    {participants.map((p, i) => (
                        <div
                            key={p.id}
                            className="slice"
                            style={{
                                transform: `rotate(${(360 / participants.length) * i}deg)`
                            }}
                        >
                            <span>{p.fullName}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleSpin} disabled={spinning}>
                {spinning ? "ĐANG QUAY..." : "XOAY 🎡"}
            </button>

            {winner && (
                <div className="result">
                    🎉 Người trúng giải:
                    <h2>{winner.fullName}</h2>
                </div>
            )}
        </div>
    );
}

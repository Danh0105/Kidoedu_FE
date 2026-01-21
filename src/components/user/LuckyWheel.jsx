import React, { useEffect, useRef, useState } from "react";

/* ===== CONFIG ===== */
const ITEM_WIDTH = 230;
const ITEM_MARGIN = 32;
const ITEM_FULL_WIDTH = ITEM_WIDTH + ITEM_MARGIN;
const SPIN_DURATION = 5000;
const ROLL_SIZE = 150;

export default function LuckyWheel() {
    const trackRef = useRef(null);

    const [participants, setParticipants] = useState([]);
    const [rollItems, setRollItems] = useState([]);
    const [rolling, setRolling] = useState(false);
    const [winner, setWinner] = useState(null);

    /* ===== LOAD DATA ===== */
    useEffect(() => {
        fetch("http://localhost:3000/participants")
            .then(res => res.json())
            .then(data => {
                const valid = data.filter(
                    p => p.isCheckedIn && !p.isWinner
                );

                // ✅ CHỈ DÙNG valid
                setParticipants(valid);
                setRollItems(generateRollList(valid));
            });
    }, []);

    /* ===== SINH DANH SÁCH QUAY ===== */
    const generateRollList = (list, size = ROLL_SIZE) => {
        const result = [];
        for (let i = 0; i < size; i++) {
            result.push(list[Math.floor(Math.random() * list.length)]);
        }
        return result;
    };

    /* ===== QUAY ===== */
    const spin = () => {
        if (rolling || participants.length === 0) return;

        setRolling(true);
        setWinner(null);

        const list = generateRollList(participants);
        setRollItems(list);

        requestAnimationFrame(() => {
            const track = trackRef.current;
            if (!track) return;

            const items = track.children;
            const container = track.parentElement;

            const containerCenter =
                container.offsetWidth / 2;

            const targetIndex = Math.floor(list.length / 2);
            const targetItem = items[targetIndex];

            const itemCenter =
                targetItem.offsetLeft +
                targetItem.offsetWidth / 2;

            const offset = itemCenter - containerCenter;

            track.style.transition = "none";
            track.style.transform = "translateX(0)";
            void track.offsetHeight;

            track.style.transition =
                "transform 5s cubic-bezier(.08,.6,0,1)";
            track.style.transform = `translateX(-${offset}px)`;

            setTimeout(() => {
                setWinner(list[targetIndex]);
                setRolling(false);
            }, SPIN_DURATION);
        });
    };


    return (
        <div className="container py-5">
            <h3 className="text-center mb-4">🎯 Vòng xoay trúng thưởng</h3>

            <div
                className="position-relative border rounded bg-light mx-auto mb-4"
                style={{ width: 700, height: 160, overflow: "hidden" }}
            >
                {/* Vạch đỏ */}
                <div
                    className="position-absolute top-0 bottom-0 start-50 bg-danger"
                    style={{
                        width: 4,
                        transform: "translateX(-50%)",
                        zIndex: 10,
                    }}
                />

                {/* Track */}
                <div
                    ref={trackRef}
                    className="d-flex align-items-center h-100"
                >
                    {rollItems.map((p, idx) => (
                        <div
                            key={idx}
                            className="card bg-primary text-white mx-2"
                            style={{
                                width: ITEM_WIDTH,
                                height: 120,
                                flexShrink: 0,
                            }}
                        >
                            <div className="card-body d-flex align-items-center justify-content-center text-center fw-bold">
                                {p.fullName}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button
                    className="btn btn-success px-4"
                    onClick={spin}
                    disabled={rolling || participants.length === 0}
                >
                    {rolling ? "Đang quay..." : "Quay"}
                </button>
            </div>

            {winner && (
                <div className="alert alert-success text-center mt-4">
                    🎉 Người trúng thưởng: <strong>{winner.fullName}</strong>
                </div>
            )}
        </div>
    );
}

import React, { useEffect, useRef, useState } from "react";

/* ===== CONFIG ===== */
const ITEM_WIDTH = 230;
const ITEM_MARGIN = 32; // mx-2 (16px * 2)
const ITEM_FULL_WIDTH = ITEM_WIDTH + ITEM_MARGIN;

export default function LuckyWheel() {
    const trackRef = useRef(null);

    const [participants, setParticipants] = useState([]);
    const [rollItems, setRollItems] = useState([]);
    const [rolling, setRolling] = useState(false);
    const [winner, setWinner] = useState(null);

    /* ===== LOAD DATA TỪ DB ===== */
    useEffect(() => {
        fetch("http://localhost:3000/participants")
            .then(res => res.json())
            .then(data => {
                const valid = data.filter(
                    p => p.isCheckedIn && !p.isWinner
                );

                setParticipants(valid);

                // init vòng xoay (tránh trắng lần đầu)
                if (valid.length > 0) {
                    setRollItems(generateRollList(valid, valid[0]));
                }
            });
    }, []);

    /* ===== RANDOM NGƯỜI TRÚNG ===== */
    const randomWinner = () => {
        return participants[Math.floor(Math.random() * participants.length)];
    };

    /* ===== SINH DANH SÁCH QUAY ===== */
    const generateRollList = (list, winItem, size = 150) => {
        const result = [];
        for (let i = 0; i < size; i++) {
            result.push(list[Math.floor(Math.random() * list.length)]);
        }
        result[Math.floor(size / 2)] = winItem;
        return result;
    };

    /* ===== QUAY ===== */
    const spin = () => {
        if (rolling || participants.length === 0) return;

        setRolling(true);
        setWinner(null);

        const win = randomWinner();
        const list = generateRollList(participants, win);
        setRollItems(list);

        setTimeout(() => {
            const track = trackRef.current;

            // reset animation
            track.style.transition = "none";
            track.style.transform = "translateX(0)";
            void track.offsetHeight; // force reflow

            const targetIndex = Math.floor(list.length / 2);
            const containerWidth = track.parentElement.offsetWidth;

            const offset =
                targetIndex * ITEM_FULL_WIDTH -
                containerWidth / 2 +
                ITEM_FULL_WIDTH / 2;

            track.style.transition =
                "transform 5s cubic-bezier(.08,.6,0,1)";
            track.style.transform = `translateX(-${offset}px)`;

            setTimeout(() => {
                setWinner(win);
                setRolling(false);
            }, 5000);
        }, 100);
    };

    return (
        <div className="container py-5">
            <h3 className="text-center mb-4">🎯 Vòng xoay trúng thưởng</h3>

            <div
                className="position-relative border rounded bg-light mx-auto mb-4"
                style={{ width: 700, height: 160, overflow: "hidden" }}
            >
                {/* Vạch giữa */}
                <div
                    className="position-absolute top-0 bottom-0 start-50 bg-danger"
                    style={{ width: 4, transform: "translateX(-50%)" }}
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
                            <div
                                className="card-body d-flex align-items-center justify-content-center text-center fw-bold p-0"
                            >
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

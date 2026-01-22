import React, { useEffect, useRef, useState } from "react";
import LuckyWheel from "./LuckyWheel";
import "./LuckyWheel.css";
import WinnerModal from "./WinnerModal";
import Asset from "../../../assets/user/Asset.png"
import avatar from "../../../assets/user/avatar.png"
const PAGE_SIZE = 160;
const SPIN_DURATION = 5000;
const ROLL_SIZE = 150;
/* ===== CARD NGƯỜI THAM GIA ===== */
const ParticipantCard = ({ p }) => (
    <div className={`p-card ${p.isForcedWinner ? "forced" : ""}`}>

        <div className="d-flex ">
            <div>
                <img src={avatar} alt="" width={50} height={50} />
            </div>
            <div>
                <div className="fullname">{p.fullName}</div>
                <div className="fullname">Chủ tích hội đồng quản trị</div>
            </div>
        </div>
    </div>
);

/* ===== CHIA DANH SÁCH THÀNH 4 CẠNH ===== */
const splitSides = (list) => {
    const perSide = Math.ceil(list.length / 4);

    return {
        top: list.slice(0, perSide),
        right: list.slice(perSide, perSide * 2),
        bottom: list.slice(perSide * 2, perSide * 3),
        left: list.slice(perSide * 3),
    };
};

export default function LuckyWheelStage() {
    const [participants, setParticipants] = useState([]);
    const [page, setPage] = useState(0);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winner, setWinner] = useState();
    const [rolling, setRolling] = useState(false);
    const [forcedWinner, setForcedWinner] = useState(null);
    const trackRef = useRef(null);

    const [rollItems, setRollItems] = useState([]);


    const generateRollWithWinner = (list, winner, size = ROLL_SIZE) => {
        const result = [];

        for (let i = 0; i < size; i++) {
            result.push(list[Math.floor(Math.random() * list.length)]);
        }

        const targetIndex = Math.floor(size / 2);
        result[targetIndex] = winner; // 🔥 ÉP NGƯỜI TRÚNG

        return { result, targetIndex };
    };


    useEffect(() => {
        loadParticipants().then(list => {
            setRollItems(generateRollList(list));
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
    /* ===== LOAD PARTICIPANTS TỪ DB ===== */
    const loadParticipants = async () => {
        const res = await fetch("http://localhost:3000/participants");
        const data = await res.json();

        const valid = data.filter(
            p => p.isCheckedIn && !p.isWinner
        );

        setParticipants(valid);
        return valid;
    };

    /* ===== LOAD LẦN ĐẦU ===== */
    useEffect(() => {
        loadParticipants();
        startCoinRainContinuous(80);
    }, []);

    /* ===== PAGINATION ===== */
    const pageCount = Math.ceil(participants.length / PAGE_SIZE);
    const pageParticipants = participants.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE
    );

    const sides = splitSides(pageParticipants);
    const spin = async () => {
        if (rolling) return;

        setRolling(true);
        setWinner(null);

        // 🔄 1. LOAD LẠI TỪ DB
        const latestParticipants = await loadParticipants();

        if (!latestParticipants.length) {
            setRolling(false);
            return;
        }

        // 🎯 2. XÁC ĐỊNH WINNER
        let winnerToUse =
            latestParticipants.find(p => p.isForcedWinner) ??
            latestParticipants[
            Math.floor(Math.random() * latestParticipants.length)
            ];

        // 🎰 3. TẠO LIST QUAY
        const { result, targetIndex } =
            generateRollWithWinner(latestParticipants, winnerToUse);

        setRollItems(result);

        // 🎥 4. QUAY
        requestAnimationFrame(() => {
            const track = trackRef.current;
            if (!track) {
                setRolling(false);
                return;
            }

            const container = track.parentElement;
            const items = track.children;
            const targetItem = items[targetIndex];

            if (!targetItem) {
                setRolling(false);
                return;
            }

            const containerCenter = container.offsetWidth / 2;
            const itemCenter =
                targetItem.offsetLeft + targetItem.offsetWidth / 2;

            const offset = itemCenter - containerCenter;

            track.style.transition = "none";
            track.style.transform = "translateX(0)";
            void track.offsetHeight;

            track.style.transition =
                "transform 5s cubic-bezier(.08,.6,0,1)";
            track.style.transform = `translateX(-${offset}px)`;

            setTimeout(() => {

                setWinner(winnerToUse);
                setShowWinnerModal(true);   // 👈 HIỆN MODAL
                setRolling(false);
            }, SPIN_DURATION);

        });
    };

    return (
        <div className="stage" onClick={spin}>
            <div id="coin-container">
                <div className="lucky-arrow">
                    <img src={Asset} alt="" style={{ maxWidth: '60px' }} className="img-arrow" />
                </div>
                {/* ===== TOP ===== */}
                <div className="side top">
                    {sides.top.map(p => (
                        <ParticipantCard key={p.id} p={p} />
                    ))}
                </div>

                {/* ===== LEFT ===== */}
                <div className="side left">
                    {sides.left.map(p => (
                        <ParticipantCard key={p.id} p={p} />
                    ))}
                </div>

                {/* ===== CENTER (VÒNG QUAY) ===== */}
                <div className="center">
                    <LuckyWheel
                        onAfterSpin={loadParticipants}
                        trackRef={trackRef}
                        rollItems={rollItems}
                    />
                </div>
                <WinnerModal
                    winner={showWinnerModal ? winner : null}
                    onClose={() => setShowWinnerModal(false)}
                />
                {/* ===== RIGHT ===== */}
                <div className="side right">
                    {sides.right.map(p => (
                        <ParticipantCard key={p.id} p={p} />
                    ))}
                </div>

                {/* ===== BOTTOM ===== */}
                <div className="side bottom">
                    {sides.bottom.map(p => (
                        <ParticipantCard key={p.id} p={p} />
                    ))}
                </div>

                {/* ===== PAGE INDICATOR ===== */}
                {pageCount > 1 && (
                    <div className="page-indicator">
                        Trang {page + 1} / {pageCount}
                    </div>
                )}
            </div>
        </div>


    );
}
function spawnCoin() {
    const coin = document.createElement("div");
    coin.className = "coin";

    coin.style.left = Math.random() * window.innerWidth + "px";
    coin.style.animationDuration = 2 + Math.random() * 2 + "s";

    document.getElementById("coin-container").appendChild(coin);

    setTimeout(() => coin.remove(), 4000);
}
let running = false;
let lastTime = 0;

function coinLoop(time) {
    if (!running) return;

    if (time - lastTime > 100) { // 100ms / coin
        spawnCoin();
        lastTime = time;
    }

    requestAnimationFrame(coinLoop);
}

function startCoinRainContinuous() {
    if (running) return;
    running = true;
    requestAnimationFrame(coinLoop);
}

function stopCoinRain() {
    running = false;
}


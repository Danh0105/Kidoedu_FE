import React, { useEffect, useRef, useState } from "react";
import LuckyWheel from "./LuckyWheel";
import "./LuckyWheel.css";
import WinnerModal from "./WinnerModal";
import Asset from "../../../assets/user/Asset.png"
import mp3luckywheel from '../../../assets/user/luckywheel.mp3'
import mp3winner from '../../../assets/user/winner.mp3'
const PAGE_SIZE = 160;
const SPIN_DURATION = 10000;
const ROLL_SIZE = 150;


export default function LuckyWheelStage() {
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winner, setWinner] = useState();
    const [rolling, setRolling] = useState(false);
    const trackRef = useRef(null);
    const audioRef = useRef(null);
    const [rollItems, setRollItems] = useState([]);

    const winnerAudioRef = useRef(null);
    useEffect(() => {
        const spinAudio = new Audio(mp3luckywheel);
        spinAudio.loop = true;
        spinAudio.volume = 1;
        audioRef.current = spinAudio;

        const winAudio = new Audio(mp3winner);
        winAudio.loop = false;
        winAudio.volume = 0.8;
        winnerAudioRef.current = winAudio;

        return () => {
            spinAudio.pause();
            spinAudio.currentTime = 0;
            winAudio.pause();
            winAudio.currentTime = 0;
        };
    }, []);


    const generateRollWithWinner = (list, winner, size = ROLL_SIZE) => {
        const result = [];

        for (let i = 0; i < size; i++) {
            result.push(list[Math.floor(Math.random() * list.length)]);
        }

        const targetIndex = Math.floor(size / 2);
        result[targetIndex] = winner;

        return { result, targetIndex };
    };


    useEffect(() => {
        loadParticipants().then(list => {
            setRollItems(generateRollList(list));
        });
    }, []);

    const generateRollList = (list, size = ROLL_SIZE) => {
        const result = [];
        for (let i = 0; i < size; i++) {
            result.push(list[Math.floor(Math.random() * list.length)]);
        }
        return result;
    };

    const loadParticipants = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/participants`);
        const data = await res.json();

        const valid = data.filter(
            p => p.isCheckedIn && !p.isWinner
        );

        return valid;
    };

    useEffect(() => {
        loadParticipants();
        startCoinRainContinuous(80);
    }, []);



    const spin = async () => {
        if (rolling) return;

        if (winnerAudioRef.current) {
            winnerAudioRef.current.pause();
            winnerAudioRef.current.currentTime = 0;
        }

        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(() => { });
        }

        setRolling(true);
        setWinner(null);

        const latestParticipants = await loadParticipants();

        if (!latestParticipants.length) {
            setRolling(false);
            return;
        }

        const winnerToUse =
            latestParticipants[
            Math.floor(Math.random() * latestParticipants.length)
            ];

        const { result, targetIndex } =
            generateRollWithWinner(latestParticipants, winnerToUse);

        setRollItems(result);

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
                `transform ${SPIN_DURATION}ms cubic-bezier(.08,.6,0,1)`;
            track.style.transform = `translateX(-${offset}px)`;

            setTimeout(async () => {
                audioRef.current?.pause();
                audioRef.current.currentTime = 0;

                winnerAudioRef.current?.play().catch(() => { });
                await markWinner(winnerToUse.id);
                setWinner(winnerToUse);
                setShowWinnerModal(true);
                setRolling(false);
            }, SPIN_DURATION);
        });
    };

    const markWinner = async (winnerId) => {
        await fetch(
            `${process.env.REACT_APP_API_URL}/participants/${winnerId}/winner`,
            {
                method: "PATCH",
            }
        );
    };

    return (
        <div className="stage" onClick={spin}>
            <div id="coin-container">
                <div className="lucky-arrow">
                    <img
                        src={Asset}
                        alt=""
                        className="img-arrow"
                    />
                </div>
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

    if (time - lastTime > 100) {
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




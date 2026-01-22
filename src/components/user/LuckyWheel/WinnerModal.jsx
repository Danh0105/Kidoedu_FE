import React from "react";
import "./WinnerModal.css";

export default function WinnerModal({ winner, onClose }) {
    if (!winner) return null;

    return (
        <div className="winner-backdrop">
            <div className="winner-modal">
                <div className="winner-icon">🎉</div>

                <div className="winner-title">
                    Người trúng thưởng
                </div>

                <div className="winner-name">
                    {winner.fullName}
                </div>


            </div>
        </div>
    );
}

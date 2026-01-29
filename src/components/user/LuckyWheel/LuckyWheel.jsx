import React, { useEffect, useRef, useState } from "react";
import './LuckyWheel.css'
/* ===== CONFIG ===== */
const ITEM_WIDTH = 230;
const ITEM_MARGIN = 32;
const ITEM_FULL_WIDTH = ITEM_WIDTH + ITEM_MARGIN;
const SPIN_DURATION = 5000;
const ROLL_SIZE = 150;

export default function LuckyWheel({ trackRef, rollItems }) {



    return (
        <div className="container py-5" >
            <div
                className="position-relative bg-light mx-auto mb-4 border-none roll-container"
            >
                {/* Vạch đỏ */}


                {/* Track */}
                <div
                    ref={trackRef}
                    className="d-flex align-items-center h-100"
                >
                    {rollItems.map((p, idx) => (
                        <div
                            key={idx}
                            className="card bg-participant text-white mx-2"
                            style={{
                                width: ITEM_WIDTH,
                                height: 120,
                                flexShrink: 0,
                            }}
                        >
                            <div className="card-body d-flex align-items-center justify-content-center text-center fw-bold text-dark" style={{ fontSize: "14px" }}>
                                {p?.fullName || "No Name"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

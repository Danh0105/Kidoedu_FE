import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../components/user/csss/Carouse.css";
const API = process.env.REACT_APP_API_URL;

export default function Carousel() {
    const [banner, setBanner] = useState(null);

    const loadBanner = async () => {
        const res = await axios.get(`${API}/banners/2`);
        setBanner(res.data);
    };

    useEffect(() => {
        loadBanner();
    }, []);

    return (
        <div className="modern-carousel">
            <div className="carousel-frame">

                {banner?.imageUrl ? (
                    <img
                        src={`${API}${banner.imageUrl}`}
                        alt="Main Banner"
                        className="carousel-image"
                    />
                ) : (
                    <div className="carousel-placeholder">Banner</div>
                )}

                {/* Gradient overlay */}
                <div className="carousel-overlay"></div>

                {/* Caption (tuỳ muốn dùng hoặc tắt) */}
                <div className="carousel-caption">
                    <h3>Khám Phá Công Nghệ Cùng IchiSkill</h3>
                    <p>Học mà chơi – Chơi mà học!</p>
                </div>

            </div>
        </div>
    );
}

import React from 'react'
import C1 from "../../assets/user/Carouse1.jpg";
import C2 from "../../assets/user/Carouse2.jpg";
export default function Carousel() {
    return (
        <div
            id="carouselExampleDark"
            className=" carousel carousel-dark slide position-relative mb-2"
        >
            <div className="carousel-inner" style={{ borderRadius: "30px" }}>
                <div className="carousel-item active" data-bs-interval="10000">
                    <img src={C1} className="d-block w-100" alt="..." style={{ maxWidth: "100%", maxHeight: "700px", margin: "0 auto" }} />
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                    <img src={C2} className="d-block w-100" alt="..." style={{ maxWidth: "100%", maxHeight: "700px", margin: "0 auto" }} />
                </div>
            </div>

            <button className="carousel-control-prev position-absolute top-50 start-0 translate-middle-y"
                type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>

            <button className="carousel-control-next" type="button"
                data-bs-target="#carouselExampleDark" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}



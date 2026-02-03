import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function LoadPage({ loading, children }) {
    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
                <FontAwesomeIcon
                    icon={faLaptop}
                    className="text-primary mb-3"
                    style={{ fontSize: "3rem" }}
                />
                <div className="spinner-border text-primary mb-3" />
                <h5 className="fw-bold text-secondary">Kido đang tải nội dung...</h5>
                <p className="text-muted small">Vui lòng đợi trong giây lát 💙</p>
            </div>
        );
    }

    return children;
}


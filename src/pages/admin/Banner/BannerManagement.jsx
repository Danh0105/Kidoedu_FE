import React from "react";
import HomeBanner from "./HomeBanner";
import ProductBanner from "./ProductBanner";

export default function BannerManagement() {
    return (
        <div className="layout-page overflow-auto" style={{ maxHeight: "100vh" }}>

            <nav>
                <div className="nav nav-tabs d-flex justify-content-center" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>
                    <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Product</button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabIndex="0">
                    <HomeBanner />
                </div>
                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabIndex="0">
                    <ProductBanner />
                </div>
            </div>
        </div>
    );
}
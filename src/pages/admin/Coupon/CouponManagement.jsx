import React, { useEffect, useState } from 'react';
import { getPromotions } from '../../../services/promotion';
import PromotionTab from './PromotionTab';
import PromotionBannerTab from './PromotionBannerTab';

export default function CouponManagement() {
    const [activeTab, setActiveTab] = useState('promotion');
    const [data, setData] = useState([]);

    const load = () => getPromotions().then(setData);

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="container mt-4">

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'promotion' ? 'active' : ''}`}
                        onClick={() => setActiveTab('promotion')}
                    >
                        🎯 Quản lý khuyến mãi
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'banner' ? 'active' : ''}`}
                        onClick={() => setActiveTab('banner')}
                    >
                        🖼️ Banner khuyến mãi
                    </button>
                </li>
            </ul>

            {/* Content */}
            {activeTab === 'promotion' && (
                <PromotionTab data={data} reload={load} />
            )}

            {activeTab === 'banner' && (
                <PromotionBannerTab promotions={data} />
            )}
        </div>
    );
}


import { hasPermission } from "../../../utils/permission";
import InventoryReceipts from "./InventoryReceipts";
import InventoryProduct from "./InventoryProduct";
import './css/InventoryManager.css';
import { useState } from "react";


export default function InventoryManager() {

    const [activeTab, setActiveTab] = useState('promotion');
    return (
        <div >
            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'promotion' ? 'active' : ''}`}
                        onClick={() => setActiveTab('promotion')}
                    >
                        📤 Phiếu xuất kho
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'banner' ? 'active' : ''}`}
                        onClick={() => setActiveTab('banner')}
                    >
                        📦 Sản phẩm trong kho
                    </button>
                </li>
            </ul>

            {/* Content */}
            {activeTab === 'promotion' && (
                <InventoryReceipts hasPermission={hasPermission} />
            )}

            {activeTab === 'banner' && (
                <InventoryProduct />
            )}
        </div>

    );
}
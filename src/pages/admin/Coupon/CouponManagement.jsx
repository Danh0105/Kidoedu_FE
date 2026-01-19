import React, { useEffect, useState } from 'react';
import {
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    applyPromotion,
    createVoucher
} from '../../../services/promotion';

import PromotionsTable from '../../../components/admin/CouponManagement/PromotionsTable';
import PromotionForm from '../../../components/admin/CouponManagement/PromotionForm';
import PromotionApplyForm from '../../../components/admin/CouponManagement/PromotionApplyForm';
import PromotionScopeModal from '../../../components/admin/CouponManagement/PromotionScopeModal';
import CreateVoucherModal from '../../../components/admin/CouponManagement/CreateVoucherModal';

export default function CouponManagement() {
    const [data, setData] = useState([]);
    const [editing, setEditing] = useState(null);
    const [applying, setApplying] = useState(null);
    const [scopePromo, setScopePromo] = useState(null);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [showVoucherModal, setShowVoucherModal] = useState(false);

    const load = () => getPromotions().then(setData);

    useEffect(load, []);
    return (
        <div className="container mt-4">
            <h3>Quản lý khuyến mãi</h3>

            <button className="btn btn-success mb-2" onClick={() => setEditing({})}>
                + Tạo khuyến mãi
            </button>

            <PromotionsTable
                data={data}
                onEdit={setEditing}
                onApply={setScopePromo}
                onDelete={(id) => deletePromotion(id).then(load)}
                onCreateVoucher={(promo) => {
                    setSelectedPromotion(promo);
                    setShowVoucherModal(true);
                }}
            />

            <CreateVoucherModal
                show={showVoucherModal}
                promotion={selectedPromotion}
                onClose={() => setShowVoucherModal(false)}
                onSubmit={async (payload) => {
                    try {
                        const apiPayload = {
                            id: payload.id,
                            code: payload.voucherCode,
                            usageLimit: Number(payload.quantity),
                        };

                        await createVoucher(apiPayload);

                        alert("🎉 Tạo voucher thành công");
                        setShowVoucherModal(false);
                        load();
                    } catch (err) {
                        alert(err.response?.data?.message || "Tạo voucher thất bại");
                    }
                }}
            />


            <PromotionForm
                open={editing !== null}
                initial={editing}
                onClose={() => setEditing(null)}
                onSubmit={(form) => {
                    const action = editing?.id
                        ? updatePromotion(editing.id, form)
                        : createPromotion(form);

                    action.then(() => {
                        setEditing(null);
                        load();
                    });
                }}
            />


            <PromotionApplyForm
                open={!!applying}
                onClose={() => setApplying(null)}
                onSubmit={(body) => {
                    applyPromotion(applying.id, body).then(() => {
                        setApplying(null);
                        load();
                    });
                }}
            />

            <PromotionScopeModal
                open={!!scopePromo}
                promotion={scopePromo}
                onClose={() => setScopePromo(null)}
            />
        </div>
    );
}

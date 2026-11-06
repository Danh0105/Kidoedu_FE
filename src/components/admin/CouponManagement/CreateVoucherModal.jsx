import React, { useState } from "react";
import { createPortal } from "react-dom";

const CreateVoucherModal = ({ show, onClose, onSubmit, promotion }) => {
    const [voucherCode, setVoucherCode] = useState("");
    const [quantity, setQuantity] = useState(100);
    const [expireDate, setExpireDate] = useState("");

    if (!show) return null;

    return createPortal(
        <>
            <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">🎟️ Tạo Voucher</h5>
                            <button className="btn-close" onClick={onClose} />
                        </div>

                        <div className="modal-body">
                            <div className="alert alert-light border">
                                <b>{promotion?.name}</b>
                                <div className="text-muted small">
                                    {promotion?.description}
                                </div>
                            </div>

                            <input
                                className="form-control mb-2"
                                placeholder="VD: KM10OFF"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            />

                            <input
                                type="number"
                                className="form-control mb-2"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>
                                Huỷ
                            </button>
                            <button
                                className="btn btn-success"
                                disabled={!voucherCode}
                                onClick={() =>
                                    onSubmit({
                                        id: promotion.id,
                                        voucherCode,
                                        quantity,
                                    })
                                }
                            >
                                Tạo voucher
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} />
        </>,
        document.body
    );
};

export default CreateVoucherModal;

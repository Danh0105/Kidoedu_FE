import React, { useState } from 'react';

export default function PromotionApplyForm({ open, onClose, onSubmit }) {
    const [productId, setProductId] = useState('');
    const [categoryId, setCategoryId] = useState('');

    if (!open) return null;

    return (
        <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog">
                <div className="modal-content p-3">
                    <h5>Áp dụng khuyến mãi</h5>

                    <input
                        className="form-control my-2"
                        placeholder="Product ID"
                        value={productId}
                        onChange={e => setProductId(e.target.value)}
                    />

                    <input
                        className="form-control my-2"
                        placeholder="Category ID"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                    />

                    <small className="text-muted">
                        Chỉ nhập 1 trong 2
                    </small>

                    <div className="mt-3 text-end">
                        <button className="btn btn-secondary me-2" onClick={onClose}>Hủy</button>
                        <button className="btn btn-success" onClick={() =>
                            onSubmit({ productId: productId || undefined, categoryId: categoryId || undefined })
                        }>
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

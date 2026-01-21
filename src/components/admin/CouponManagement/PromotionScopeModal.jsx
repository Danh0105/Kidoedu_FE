import React, { useEffect, useState } from 'react';
import {
    getApplicability,
    addApplicability,
    removeApplicability,
} from '../../../services/promotion';

export default function PromotionScopeModal({ open, promotion, onClose }) {
    const [list, setList] = useState([]);
    const [productId, setProductId] = useState('');
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        if (!open || !promotion) return;

        getApplicability(promotion.id)
            .then(setList);
    }, [open, promotion?.id]);

    if (!open || !promotion) return null;

    const submit = () => {
        if (!!productId === !!categoryId) {
            alert('Chỉ nhập product hoặc category');
            return;
        }

        addApplicability(promotion.id, {
            productId: Number(productId),
            categoryId: Number(categoryId),
        }).then(() => {
            setProductId('');
            setCategoryId('');
            return getApplicability(promotion.id);
        }).then(setList);
    };

    return (
        <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog">
                <div className="modal-content p-3">
                    <h5>Phạm vi áp dụng – {promotion.name}</h5>

                    <ul className="list-group mb-3">
                        {list.map(a => (
                            <li
                                key={a.id}
                                className="list-group-item d-flex justify-content-between"
                            >
                                <span>
                                    {a.product && `Sản phẩm #${a.product.productId}`}
                                    {a.category && `Danh mục #${a.category.categoryId}`}
                                </span>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                        removeApplicability(
                                            promotion.id,
                                            a.id
                                        ).then(() =>
                                            getApplicability(promotion.id).then(setList)
                                        )
                                    }
                                >
                                    Xoá
                                </button>
                            </li>
                        ))}
                    </ul>

                    <input
                        className="form-control mb-2"
                        placeholder="Product ID"
                        value={productId}
                        onChange={e => setProductId(e.target.value)}
                    />

                    <input
                        className="form-control mb-2"
                        placeholder="Category ID"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                    />

                    <small className="text-muted">Chỉ nhập 1 trong 2</small>

                    <div className="mt-3 text-end">
                        <button className="btn btn-secondary me-2" onClick={onClose}>
                            Đóng
                        </button>
                        <button className="btn btn-primary" onClick={submit}>
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

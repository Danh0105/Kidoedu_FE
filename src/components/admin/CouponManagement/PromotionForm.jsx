import React, { useState, useEffect } from 'react';

export default function PromotionForm({ open, initial, onClose, onSubmit }) {
    console.log(initial)
    const [form, setForm] = useState({
        name: '',
        discountType: 'percentage',
        discountValue: 0,
        startDate: '',
        endDate: '',
        isActive: true,
    });


    useEffect(() => {
        if (initial) {
            setForm({
                name: initial.name ?? '',
                description: initial.description ?? '',
                discountType: initial.discountType ?? 'percentage',
                discountValue: Number(initial.discountValue) ?? 0,

                // 🔥 FIX Ở ĐÂY
                startDate: initial.startDate
                    ? new Date(initial.startDate).toISOString().slice(0, 16)
                    : '',
                endDate: initial.endDate
                    ? new Date(initial.endDate).toISOString().slice(0, 16)
                    : '',

                isActive: initial.isActive ?? true,
            });
        } else {
            setForm({
                name: '',
                description: '',
                discountType: 'percentage',
                discountValue: 0,
                startDate: '',
                endDate: '',
                isActive: true,
            });
        }
    }, [initial]);



    if (!open) return null;

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = () => {
        if (!form.startDate || !form.endDate) {
            alert('Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc');
            return;
        }

        const start = new Date(form.startDate);
        const end = new Date(form.endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            alert('Ngày không hợp lệ');
            return;
        }

        onSubmit({
            name: form.name,
            description: form.description,
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            isActive: form.isActive,
        });
    };


    return (
        <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog">
                <div className="modal-content p-3">
                    <h5>{initial ? 'Sửa' : 'Tạo'} khuyến mãi</h5>

                    {/* Tên */}
                    <input
                        className="form-control my-2"
                        placeholder="Tên khuyến mãi"
                        value={form.name}
                        onChange={e => handleChange('name', e.target.value)}
                    />

                    {/* Mô tả */}
                    <textarea
                        className="form-control my-2"
                        placeholder="Mô tả"
                        value={form.description}
                        onChange={e => handleChange('description', e.target.value)}
                    />

                    {/* Loại giảm */}
                    <select
                        className="form-select my-2"
                        value={form.discountType}
                        onChange={e => handleChange('discountType', e.target.value)}
                    >
                        <option value="percentage">Giảm %</option>
                        <option value="fixed_amount">Giảm tiền</option>
                    </select>

                    {/* Giá trị giảm */}
                    <input
                        type="number"
                        className="form-control my-2"
                        placeholder="Giá trị giảm"
                        value={form.discountValue}
                        onChange={e => handleChange('discountValue', e.target.value)}
                    />

                    {/* Ngày bắt đầu */}
                    <label className="form-label mt-2">Ngày bắt đầu</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={form.startDate}
                        onChange={e => handleChange('startDate', e.target.value)}
                    />

                    {/* Ngày kết thúc */}
                    <label className="form-label mt-2">Ngày kết thúc</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={form.endDate}
                        onChange={e => handleChange('endDate', e.target.value)}
                    />

                    {/* Trạng thái */}
                    <div className="form-check mt-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={form.isActive}
                            onChange={e => handleChange('isActive', e.target.checked)}
                        />
                        <label className="form-check-label">Hoạt động</label>
                    </div>

                    <div className="mt-4 text-end">
                        <button className="btn btn-secondary me-2" onClick={onClose}>
                            Hủy
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

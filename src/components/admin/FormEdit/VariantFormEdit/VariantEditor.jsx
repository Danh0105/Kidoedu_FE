import React, { useEffect, useState } from "react";
import { generateId } from "./utils";
import VariantEditorFields from "./VariantEditorFields";
import SpecsGroupForm from "./SpecsGroupForm";

export default function VariantEditor({ editing, onSave, onCancel }) {
    const [variant, setVariant] = useState({});

    useEffect(() => {
        setVariant(editing || {});
    }, [editing]);

    const update = (patch) => {
        setVariant(prev => ({ ...prev, ...patch }));
    };

    const handleSubmit = () => {
        onSave({
            ...variant,
            id: variant.id || generateId(),
        });
    };

    return (
        <div className="card card-body bg-light shadow-sm border-0 mb-4">

            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <h6 className="fw-bold text-primary m-0">
                    {editing ? "Cập nhật biến thể" : "Tạo biến thể mới"}
                </h6>

                {editing && (
                    <a
                        className="btn btn-sm btn-secondary"
                        onClick={onCancel}
                    >
                        Hủy & Tạo mới
                    </a>
                )}
            </div>

            <VariantEditorFields variant={variant} update={update} />

            <div className="col-12 mt-3">
                <label className="form-label fw-bold small">
                    Thông số kỹ thuật
                </label>
                <SpecsGroupForm
                    specs={variant.specs || []}
                    onChange={(s) => update({ specs: s })}
                />
            </div>

            <div className="col-12 text-end pt-3 border-top">
                <a
                    type="a"
                    className="btn btn-secondary me-2"
                    onClick={onCancel}
                >
                    Đóng
                </a>

                <a
                    type="a"
                    className="btn btn-primary px-4 fw-bold"
                    onClick={handleSubmit}
                >
                    {editing ? "Cập nhật" : "Lưu"}
                </a>
            </div>
        </div>
    );
}

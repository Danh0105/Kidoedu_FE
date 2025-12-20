import React, { useEffect, useRef, useState } from "react";
import { generateId } from "./utils";
import VariantList from "./VariantList";
import VariantEditor from "./VariantEditor";

export default function VariantFormEdit({ data = [], onChange }) {
    const [variants, setVariants] = useState([]);
    const [editing, setEditing] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const isInternal = useRef(false);

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        if (isInternal.current) {
            isInternal.current = false;
            return;
        }

        if (Array.isArray(data)) {
            setVariants(
                data.map(v => ({
                    ...v,
                    id: String(v.id || generateId()),
                    prices: v.prices || [],
                    specs: v.specs || [],
                }))
            );
        }
    }, [data]);

    /* ================= EMIT ================= */
    useEffect(() => {
        if (isInternal.current && typeof onChange === "function") {
            onChange(variants);
        }
    }, [variants, onChange]);

    /* ================= HANDLERS ================= */

    const handleCreate = () => {
        setEditing(null);
        setIsOpen(true);
    };

    const handleEdit = (variant) => {
        setEditing(variant);
        setIsOpen(true);
    };

    const handleSave = (variant) => {
        isInternal.current = true;

        setVariants(prev => {
            const exists = prev.some(v => v.id === variant.id);
            return exists
                ? prev.map(v => (v.id === variant.id ? variant : v))
                : [...prev, variant];
        });

        setEditing(null);
        setIsOpen(false);
    };

    const handleRemove = (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa biến thể?")) return;

        isInternal.current = true;
        setVariants(prev => prev.filter(v => v.id !== id));

        if (editing?.id === id) {
            setEditing(null);
            setIsOpen(false);
        }
    };

    const handleCancel = () => {
        setEditing(null);
        setIsOpen(false);
    };

    /* ================= RENDER ================= */
    return (
        <div className="container-fluid p-0">

            <div className="d-flex justify-content-center mb-3">
                <a
                    type="a"
                    className="btn btn-outline-primary"
                    onClick={handleCreate}
                >
                    <i className="bi bi-plus-circle me-1" />
                    Thêm Biến Thể Mới
                </a>
            </div>

            {isOpen && (
                <VariantEditor
                    editing={editing}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}

            <VariantList
                variants={variants}
                onEdit={handleEdit}
                onRemove={handleRemove}
            />
        </div>
    );
}

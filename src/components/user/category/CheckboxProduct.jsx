// RadioCategoryItem.jsx
import React from "react";

export default function RadioCategoryItem({ id, name, selectedId, onChange }) {
    const checked = selectedId === id;
    return (
        <button
            type="button"
            className={`list-group-item list-group-item-action d-flex align-items-center
                  ${checked ? "active" : ""}`}
            onClick={() => onChange(checked ? null : id)}
            aria-pressed={checked}
            style={{ fontSize: 16 }}
        >
            <input
                className="form-check-input me-2"
                type="radio"
                checked={checked}
                readOnly
                tabIndex={-1}
            />
            <span className="flex-grow-1 text-start">{name}</span>
            {checked && <span className="ms-2" aria-hidden>✔</span>}
        </button>
    );
}

// components/CautionList.jsx
import React, { useMemo, useState } from "react";
import { cautionNotes } from "../data/caution-notes";

const sevStyles = {
    danger: { alert: "alert-danger", badge: "bg-danger-subtle text-danger-emphasis" },
    warning: { alert: "alert-warning", badge: "bg-warning-subtle text-warning-emphasis" },
    info: { alert: "alert-info", badge: "bg-info-subtle text-info-emphasis" }
};

export default function CautionList({ limit = 8, tagFilter = null }) {
    const [expanded, setExpanded] = useState(false);

    const items = useMemo(() => {
        const base = tagFilter
            ? cautionNotes.filter(n => n.tags?.includes(tagFilter))
            : cautionNotes;
        // sort: danger > warning > info, sau đó theo id
        const rank = { danger: 0, warning: 1, info: 2 };
        return [...base].sort((a, b) => (rank[a.severity] - rank[b.severity]) || a.id.localeCompare(b.id));
    }, [tagFilter]);

    const visible = expanded ? items : items.slice(0, limit);

    return (
        <div className="vstack gap-3">
            {/* Legend */}
            <div className="d-flex gap-2 flex-wrap">
                <span className={`badge ${sevStyles.danger.badge}`}>Danger = Rủi ro cao</span>
                <span className={`badge ${sevStyles.warning.badge}`}>Warning = Cảnh báo</span>
                <span className={`badge ${sevStyles.info.badge}`}>Info = Khuyến nghị</span>
            </div>

            <ul className="list-group list-group-flush rounded-3 overflow-hidden shadow-sm">
                {visible.map(n => (
                    <li key={n.id} className="list-group-item d-flex">
                        <i className={`bi ${n.icon} me-2 ${sevStyles[n.severity].alert.replace("alert-", "text-")}`} aria-hidden="true"></i>
                        <div>
                            <div className="fw-semibold">
                                {n.title}
                                <span className={`ms-2 badge ${sevStyles[n.severity].badge}`} role="status">{n.severity.toUpperCase()}</span>
                            </div>
                            <small className="text-secondary">{n.note}</small>
                            {n.bullets?.length ? (
                                <ul className="small mt-2 mb-0 ps-3">
                                    {n.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                </ul>
                            ) : null}
                        </div>
                    </li>
                ))}
            </ul>

            {items.length > limit && (
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm align-self-start"
                    onClick={() => setExpanded(v => !v)}
                >
                    {expanded ? "Thu gọn" : "Xem thêm"}
                </button>
            )}
        </div>
    );
}

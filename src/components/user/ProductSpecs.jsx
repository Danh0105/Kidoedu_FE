import React, { useMemo } from "react";

export function ProductSpecs({ specs = [] }) {

    // Gom nhóm specs theo group
    const grouped = useMemo(() => {
        const map = {};

        specs.forEach(s => {
            const groupName = s.group || "Thông số khác";
            if (!map[groupName]) map[groupName] = [];
            map[groupName].push(s);
        });

        // Sắp xếp từng group theo order
        Object.keys(map).forEach(g => {
            map[g].sort((a, b) => (a.order || 0) - (b.order || 0));
        });

        return map;
    }, [specs]);

    return (
        <div className="vstack gap-4">

            {Object.entries(grouped).map(([groupName, items]) => (
                <div key={groupName}>

                    {/* Tiêu đề nhóm kiểu DMX */}
                    <h5
                        className="fw-bold py-2 px-3 rounded"
                        style={{
                            background: "#e8f3ff",
                            color: "#0066cc",
                            borderLeft: "4px solid #1a73e8"
                        }}
                    >
                        {groupName}
                    </h5>

                    {/* Danh sách thông số giống DMX */}
                    <div className="dmx-specs-list">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="d-flex justify-content-between py-2 px-3 border-bottom"
                                style={{ fontSize: "0.95rem" }}
                            >
                                <span className="text-muted" style={{ width: "45%" }}>
                                    {item.label || item.key}
                                </span>

                                <span
                                    className="fw-semibold"
                                    style={{ width: "55%", textAlign: "right" }}
                                >
                                    {item.value}
                                    {item.unit ? ` ${item.unit}` : ""}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            ))}

        </div>
    );
}

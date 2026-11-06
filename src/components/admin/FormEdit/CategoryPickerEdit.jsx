import React, { useEffect, useMemo, useState } from "react";

/**
 * CategoryPicker – Clean, searchable, collapsible tree WITH select-on-click & delete-on-click
 *
 * Props:
 * - value: number | number[] | null  (selected category id(s))
 * - onChange: (id: number | number[]) => void            // click chọn
 * - onDelete?: (id: number, isParent: boolean) => void    // click xóa
 * - data: Array<{ id:number; name:string; parentId?: number | null }>
 * - multiple?: boolean (default false)
 * - title?: string
 * - allowDeleteParents?: boolean (default true)
 *
 * UX:
 * - Click vào label là CHỌN (radio/checkbox). Click icon thùng rác là XÓA.
 * - Nút xóa không làm ảnh hưởng tới chọn (stopPropagation).
 * - Accordion nhóm cha, con dạng lưới 2–3 cột, có tìm kiếm.
 */
export default function CategoryPicker({
    value = null,
    onChange,
    onDelete,
    data = [],
    multiple = false,
    title = "Danh mục",
    allowDeleteParents = true,
}) {
    const [query, setQuery] = useState("");
    const [openParents, setOpenParents] = useState(() => new Set());

    // Build tree: parents (no parentId) with children
    const tree = useMemo(() => {
        const parents = data.filter((c) => !c.parentId);
        const children = data.filter((c) => c.parentId);
        const grouped = parents
            .map((p) => ({
                ...p,
                children: children
                    .filter((c) => c.parentId === p.id)
                    .sort((a, b) => a.name.localeCompare(b.name)),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
        return grouped;
    }, [data]);

    // Filter by query
    const filteredTree = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return tree;
        return tree
            .map((p) => {
                const matchParent = p.name.toLowerCase().includes(q);
                const kids = p.children.filter((c) => c.name.toLowerCase().includes(q));
                if (matchParent || kids.length) return { ...p, children: kids };
                return null;
            })
            .filter(Boolean);
    }, [tree, query]);

    // Helpers for selection state
    const isChecked = (id) => {
        return multiple ? Array.isArray(value) && value.includes(id) : Number(value) === id;
    };
    const toggle = (id) => {
        if (!multiple) return onChange?.(id);
        const arr = Array.isArray(value) ? [...value] : [];
        const i = arr.indexOf(id);
        if (i === -1) arr.push(id);
        else arr.splice(i, 1);
        onChange?.(arr);
    };

    // When filtering, auto-open all groups that have matches
    useEffect(() => {
        if (!query) return;
        const s = new Set();
        filteredTree.forEach((p) => s.add(p.id));
        setOpenParents(s);
    }, [query]);

    const InputComp = multiple ? Checkbox : Radio;

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-white d-flex align-items-center gap-2 sticky-top" style={{ top: 0, zIndex: 1 }}>
                <span className="fw-semibold">{title}</span>
                <div className="ms-auto" style={{ minWidth: 160 }}>
                    <input
                        type="search"
                        className="form-control form-control-sm"
                        placeholder="Tìm danh mục…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Tìm danh mục"
                    />
                </div>
            </div>

            <div className="card-body" style={{ maxHeight: 420, overflow: "auto" }}>
                {filteredTree.length === 0 && (
                    <div className="text-muted small">Không tìm thấy danh mục phù hợp.</div>
                )}

                <div className="accordion accordion-flush" id="cat-accordion">
                    {filteredTree.map((p) => {
                        const open = openParents.has(p.id);
                        return (
                            <div className="accordion-item" key={p.id}>
                                <h2 className="accordion-header" id={`head-${p.id}`}>
                                    <div className="d-flex align-items-center">
                                        <button
                                            className={`accordion-button flex-grow-1 ${open ? "" : "collapsed"}`}
                                            type="button"
                                            aria-expanded={open}
                                            aria-controls={`panel-${p.id}`}
                                            onClick={() => {
                                                const next = new Set(openParents);
                                                if (next.has(p.id)) next.delete(p.id);
                                                else next.add(p.id);
                                                setOpenParents(next);
                                            }}
                                        >
                                            <span className="fw-semibold me-2">{p.name}</span>
                                            {p.children?.length ? (
                                                <span className="badge text-bg-light">{p.children.length}</span>
                                            ) : (
                                                <span className="text-muted small">(Không có mục con)</span>
                                            )}
                                        </button>
                                        {allowDeleteParents && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger ms-2 me-2"
                                                title="Xóa danh mục cha"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete?.(p.id, true);
                                                }}
                                            >
                                                🗑
                                            </button>
                                        )}
                                    </div>
                                </h2>
                                <div
                                    id={`panel-${p.id}`}
                                    className={`accordion-collapse collapse ${open ? "show" : ""}`}
                                    aria-labelledby={`head-${p.id}`}
                                    data-bs-parent={!query ? "#cat-accordion" : undefined}
                                >
                                    <div className="accordion-body pt-2">
                                        {p.children?.length ? (
                                            <div className="category-grid">
                                                {p.children.map((c) => (
                                                    <div key={c.id} className="cat-chip">
                                                        <label className="form-check d-flex align-items-center gap-2 mb-0 flex-grow-1" onClick={() => toggle(c.id)}>
                                                            <InputComp checked={isChecked(c.id)} onChange={() => toggle(c.id)} name="cat" />
                                                            <span className="truncate-1">{c.name}</span>
                                                        </label>
                                                        {onDelete && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-xs btn-outline-danger ms-1"
                                                                title="Xóa danh mục"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onDelete(c.id, false);
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-muted small">Chưa có mục con</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
        .category-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.25rem .5rem}
        @media (min-width: 992px){.category-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        .accordion-button{padding:.5rem .75rem}
        .accordion-body{padding:.5rem .75rem}
        .cat-chip{display:flex;align-items:center;border:1px solid #e9ecef;border-radius:.5rem;padding:.25rem .5rem}
        .btn-xs{--bs-btn-padding-y:.05rem;--bs-btn-padding-x:.35rem;--bs-btn-font-size:.75rem}
        .truncate-1{display:inline-block;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      `}</style>
        </div>
    );
}

function Radio({ checked, onChange, name }) {
    return (
        <input className="form-check-input" type="radio" name={name} checked={checked} onChange={onChange} />
    );
}
function Checkbox({ checked, onChange }) {
    return (
        <input className="form-check-input" type="checkbox" checked={checked} onChange={onChange} />
    );
}
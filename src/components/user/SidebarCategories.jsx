import React, { useMemo, useState } from "react";
import { Cpu } from 'lucide-react';
import CategoryTitle from "../../components/user/category/Category";
import RadioCategoryItem from "../../components/user/category/CheckboxProduct";
export default function SidebarCategories({
  roots = [],
  selectedCatId,
  onSelect,
  onClear,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roots;
    return roots
      .map((p) => {
        const parentMatch = p.category_name.toLowerCase().includes(q);
        const kids = (p.children || []).filter((c) =>
          c.category_name.toLowerCase().includes(q)
        );
        if (parentMatch && kids.length === 0) return { ...p };
        if (parentMatch || kids.length) return { ...p, children: parentMatch ? p.children : kids };
        return null;
      })
      .filter(Boolean);
  }, [roots, query]);

  const toggle = (id) => {
    const next = new Set(open);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpen(next);
  };

  return (
    <aside
      className="p-3 border rounded bg-white"
      style={{
        width: 330,
        position: "sticky",
        top: 16,
        maxHeight: "calc(100vh - 32px)",
        overflow: "auto",
      }}
      aria-label="Bộ lọc danh mục"
    >
      {/* Tìm danh mục + Clear filter */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Tìm danh mục…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          title="Xóa ô tìm"
          onClick={() => setQuery("")}
          disabled={!query}
        >
          ✕
        </button>
      </div>

      {selectedCatId && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge text-bg-primary">Đang chọn: #{selectedCatId}</span>
          <button className="btn btn-link p-0" onClick={onClear}>Xóa bộ lọc</button>
        </div>
      )}

      {!filtered.length ? (
        <p className="text-center text-muted mb-0">Không có danh mục</p>
      ) : (
        <div className="accordion" id="cat-accordion">
          {filtered.map((cat) => {
            const isOpen = open.has(cat.category_id);
            const headerId = `h-${cat.category_id}`;
            const panelId = `p-${cat.category_id}`;
            const children = cat.children || [];
            return (
              <div className="accordion-item" key={cat.category_id}>
                <h2 className="accordion-header" id={headerId}>
                  <button
                    className={`accordion-button ${!isOpen ? "collapsed" : ""}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(cat.category_id)}
                  >
                    <Cpu
                      size={18}
                      className={`me-2 ${selectedCatId === cat.category_id ? "text-danger" : "text-primary"}`}
                    />
                    <CategoryTitle label={cat.category_name} />
                    {children.length > 0 && (
                      <span className="badge text-bg-light ms-2">{children.length}</span>
                    )}
                  </button>
                </h2>
                <div
                  id={panelId}
                  className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                  aria-labelledby={headerId}
                  data-bs-parent="#cat-accordion"
                >
                  {children.length ? (
                    <div className="list-group list-group-flush">
                      {children.map((child) => (

                        <RadioCategoryItem
                          key={child.category_id}
                          id={child.category_id}
                          name={child.category_name}
                          selectedId={selectedCatId}
                          onChange={(val) => onSelect(val == null ? null : Number(val))} // ✅ đảm bảo number
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="list-group-item text-muted">Không có mục con</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}

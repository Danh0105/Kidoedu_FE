import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Cpu } from "lucide-react";
import CategoryTitle from "../../components/user/category/Category";
import RadioCategoryItem from "../../components/user/category/CheckboxProduct";

/**
 * SidebarCategories (cleaned)
 * - Robustly supports either snake_case (category_id) or camelCase (categoryId)
 * - Keeps panel open when there's an active query or a selected category
 * - Safe Number() casts and null guards
 * - Keyboard accessible section headers (Enter/Space)
 */
export default function SidebarCategories({
  roots = [],
  selectedCatId,
  onSelect = () => { },
  onClear = () => { },
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  // Normalize incoming tree nodes to a consistent shape
  const normalized = useMemo(() => {
    const norm = (node) => ({
      id: node.categoryId ?? node.category_id ?? node.id,
      name: node.categoryName ?? node.name,
      children: Array.isArray(node.children)
        ? node.children.map(norm)
        : [],
    });
    return Array.isArray(roots) ? roots.map(norm) : [];
  }, [roots]);

  // Filter with query (case-insensitive). If parent matches, keep all its children
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalized;

    const walk = (node) => {
      const parentMatch = (node.name || "").toLowerCase().includes(q);
      const kids = node.children.map(walk).filter(Boolean);
      if (parentMatch) return { ...node, children: node.children };
      if (kids.length) return { ...node, children: kids };
      return null;
    };

    return normalized.map(walk).filter(Boolean);
  }, [normalized, query]);

  // Auto-open section that has selectedCatId or when user is searching
  useEffect(() => {
    if (!filtered.length) return;

    if (query) {
      // open the first matching section on search
      setOpenId((cur) => cur ?? filtered[0]?.id ?? null);
      return;
    }

    if (selectedCatId != null) {
      // Find parent containing the selected child
      const parent = filtered.find((p) =>
        (p.children || []).some((c) => String(c.id) === String(selectedCatId))
      );
      if (parent) setOpenId(parent.id);
    }
  }, [filtered, query, selectedCatId]);

  const toggle = useCallback((id) => {
    setOpenId((cur) => (cur === id ? null : id));
  }, []);

  const handleKeyToggle = useCallback(
    (e, id) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(id);
      }
    },
    [toggle]
  );

  return (
    <aside
      className="p-3 border rounded bg-white"
      style={{
        width: 330,
        position: "sticky",
        top: 16,
        maxHeight: "calc(70vh - 32px)",
        overflow: "auto",
      }}
    >
      {/* Search */}
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
          onClick={() => setQuery("")}
          disabled={!query}
          aria-label="Xóa tìm kiếm"
        >
          ✕
        </button>
      </div>

      {selectedCatId != null && (
        <div className="d-flex justify-content-between mb-2">
          <span className="badge text-bg-primary">Đang chọn: #{selectedCatId}</span>
          <button className="btn btn-link p-0" onClick={onClear}>
            Xóa bộ lọc
          </button>
        </div>
      )}

      {!filtered.length ? (
        <p className="text-center text-muted mb-0">Không có danh mục</p>
      ) : (
        filtered.map((cat) => {
          const id = cat.id;
          const isOpen = openId === id;
          const children = cat.children || [];

          return (
            <div key={id ?? Math.random()} className="mb-1 border rounded">
              <div
                role="button"
                tabIndex={0}
                className="w-100 d-flex align-items-center justify-content-between px-3 py-2 bg-light"
                onClick={() => toggle(id)}
                onKeyDown={(e) => handleKeyToggle(e, id)}
              >
                <div className="d-flex align-items-center">
                  <Cpu size={18} className="me-2 text-primary" />
                  <CategoryTitle label={cat.name} />
                </div>
                {children.length > 0 && (
                  <span className="badge text-bg-secondary">{children.length}</span>
                )}
              </div>

              {isOpen && children.length > 0 && (
                <div className="list-group list-group-flush">
                  {children.map((child) => (
                    <RadioCategoryItem
                      key={child.id}
                      id={child.id}
                      name={child.name}
                      selectedId={selectedCatId}
                      onChange={(val) => onSelect(val ? Number(val) : null)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </aside>
  );
}

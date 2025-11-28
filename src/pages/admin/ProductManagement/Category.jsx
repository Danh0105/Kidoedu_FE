import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import CategoryItem from "./CategoryItem";

export default function Category({ onChange }) {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [parentId, setParentId] = useState(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [query, setQuery] = useState("");

  // ===== FETCH ROOT CATEGORIES =====
  const fetchRoots = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
      const raw = res.data || [];

      const roots = raw.filter((cat) => cat.parent === null);

      const normalized = roots.map((r) => ({
        category_id: r.category_id ?? r.categoryId ?? r.id,
        categoryName: r.categoryName ?? r.name,
        children: r.children ?? [],
      }));

      setCategories(normalized);
      setErr(null);
    } catch (e) {
      console.error(e);
      setErr("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoots();
  }, []);

  // ===== DELETE =====
  const handleDelete = async (id, isParent = false) => {
    const confirmMsg = isParent
      ? "Danh mục này là danh mục cha. Xoá nó sẽ xoá luôn các danh mục con."
      : "Bạn có chắc chắn muốn xoá danh mục này?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/categories/${id}`);
      await fetchRoots();
    } catch (error) {
      console.error(error);
      alert("Không thể xoá danh mục!");
    }
  };

  // ===== CREATE =====
  const handleSubmit = async () => {
    if (!categoryName.trim()) return alert("Vui lòng nhập tên danh mục!");

    try {
      const dto = {
        categoryName,
        parentCategoryId: parentId || null,
      };

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/categories`, dto);
      const newCatRaw = res.data;

      const newCat = {
        category_id: newCatRaw.category_id ?? newCatRaw.categoryId ?? newCatRaw.id,
        categoryName: newCatRaw.categoryName ?? newCatRaw.name,
        parent: newCatRaw.parent ?? null,
        children: [],
      };

      if (newCat.parent) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.category_id === newCat.parent.category_id
              ? { ...cat, children: [...(cat.children || []), newCat] }
              : cat
          )
        );
      } else {
        setCategories((prev) => [...prev, newCat]);
      }

      setCategoryName("");
      setParentId(null);
    } catch (err) {
      console.error(err);
      alert("Thêm danh mục thất bại!");
    }
  };

  // ===== FILTER =====
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;

    return categories
      .map((parent) => {
        const matchParent = parent.categoryName.toLowerCase().includes(q);
        const kids = parent.children.filter((c) =>
          c.categoryName.toLowerCase().includes(q)
        );

        if (matchParent || kids.length) return { ...parent, children: kids };
        return null;
      })
      .filter(Boolean);
  }, [categories, query]);

  return (
    <>
      {/* CARD MAIN */}
      <div className="card shadow-sm">

        {/* HEADER */}
        <div
          className="card-header bg-white d-flex align-items-center gap-2 sticky-top"
          style={{ top: 0, zIndex: 10 }}
        >
          <span className="fw-semibold">Danh mục</span>

          <div className="ms-auto d-flex gap-2" style={{ minWidth: 180 }}>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Tìm danh mục…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              title="Làm mới"
              onClick={fetchRoots}
            >
              ⟳
            </button>
          </div>
        </div>

        {/* BODY */}
        <div
          className="card-body p-2"
          style={{ maxHeight: 420, overflow: "auto" }}
        >
          {loading && (
            <div className="d-flex flex-column gap-2 p-2">
              <CatSkeleton />
              <CatSkeleton />
              <CatSkeleton />
            </div>
          )}

          {!loading && err && (
            <div className="alert alert-danger d-flex justify-content-between py-2">
              <span className="small">{err}</span>
              <button className="btn btn-sm btn-light" onClick={fetchRoots}>
                Thử lại
              </button>
            </div>
          )}

          {!loading && !err && filtered.length === 0 && (
            <div className="text-center text-muted p-4 border rounded-3 bg-light-subtle">
              <div className="fw-semibold mb-1">Không tìm thấy danh mục phù hợp</div>
              <button
                className="btn btn-sm btn-outline-secondary mt-2"
                onClick={() => setQuery("")}
              >
                Xóa từ khóa
              </button>
            </div>
          )}

          {!loading && !err && filtered.length > 0 && (
            <div className="d-flex flex-column gap-2">
              {filtered.map((cat) => (
                <CategoryItem
                  key={cat.category_id}
                  category={cat}
                  onDelete={handleDelete}
                  onSelect={onChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DROPDOWN ADD CATEGORY */}
      <div className="dropdown text-start mt-3">
        <button
          className="btn btn-outline-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          Thêm danh mục mới
        </button>

        <ul className="dropdown-menu p-3" style={{ minWidth: 280 }}>
          <li className="mb-2">
            <label className="form-label small mb-1">Tên danh mục</label>
            <input
              type="text"
              className="form-control"
              placeholder="VD: Bàn học sinh"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </li>

          <li className="mb-2">
            <label className="form-label small mb-1">Danh mục cha (tuỳ chọn)</label>
            <select
              className="form-select"
              value={parentId ?? ""}
              onChange={(e) =>
                setParentId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">— Không chọn —</option>
              {categories.map((p) => (
                <option key={p.category_id} value={p.category_id}>
                  {p.categoryName}
                </option>
              ))}
            </select>
          </li>

          <li>
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
              Thêm danh mục
            </button>
          </li>
        </ul>
      </div>

      {/* CSS – SCROLLBAR + SKELETON */}
      <style>{`
        .card-body::-webkit-scrollbar { width: 8px; }
        .card-body::-webkit-scrollbar-thumb { background:#e6e6e6; border-radius: 8px; }

        .skeleton-row {
          background: var(--bs-body-bg);
          border: 1px solid #eee;
        }
        .skeleton-line, .skeleton-pill {
          background: #f1f3f5;
          position: relative;
          overflow: hidden;
        }
        .skeleton-line { height: 10px; border-radius: 6px; }
        .skeleton-pill { height: 26px; width: 96px; border-radius: 999px; }

        .skeleton-line::after,
        .skeleton-pill::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
          animation: sk 1.3s infinite;
        }
        @keyframes sk { 100% { transform: translateX(100%); } }
      `}</style>
    </>
  );
}

// Skeleton loader
function CatSkeleton() {
  return (
    <div className="skeleton-row rounded-3 p-2">
      <div className="skeleton-line w-50 mb-2" />
      <div className="d-flex gap-2">
        <div className="skeleton-pill" />
        <div className="skeleton-pill" />
        <div className="skeleton-pill" />
      </div>
    </div>
  );
}

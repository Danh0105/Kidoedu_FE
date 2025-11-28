import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import CategoryItem from "./CategoryItemEdit";

export default function CategoryEdit({ onChange, categoryId }) {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [parentId, setParentId] = useState(null);

    // UI/UX states
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [query, setQuery] = useState("");

    // ===== Fetch roots (không đổi API/luồng) =====
    const fetchRoots = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
            const raw = res.data || [];

            const roots = raw.filter((cat) => cat.parent === null);

            const normalized = roots.map((r) => ({
                // CHUẨN HOÁ ID & NAME
                category_id: r.category_id ?? r.categoryId ?? r.id,
                categoryName: r.categoryName ?? r.name,
                children: r.children ?? [],   // nếu API chưa trả children thì để []
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ===== Delete (không đổi logic) =====
    const handleDelete = async (id, isParent = false) => {
        const confirmMsg = isParent
            ? "Danh mục này là danh mục cha. Xoá nó sẽ xoá luôn các danh mục con. Bạn có chắc chắn không?"
            : "Bạn có chắc chắn muốn xoá danh mục này?";
        if (!window.confirm(confirmMsg)) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/categories/${id}`);
            await fetchRoots();
        } catch (error) {
            console.error("Xoá thất bại:", error);
            alert("Không thể xoá danh mục!");
        }
    };

    // ===== Create (không đổi API/luồng) =====
    const handleSubmit = async () => {
        if (!categoryName.trim()) {
            alert("Vui lòng nhập tên danh mục!");
            return;
        }

        try {
            const dto = {
                categoryName: categoryName,
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
            console.error("Lỗi khi thêm danh mục:", err);
            alert("Thêm danh mục thất bại!");
        }
    };


    // ===== Search (lọc theo tên cha và tên con nếu có) =====
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return categories;
        return categories
            .map((p) => {
                const matchParent = (p.categoryName || "").toLowerCase().includes(q);
                const kids = (p.children || []).filter((c) =>
                    (c.categoryName || "").toLowerCase().includes(q)
                );
                if (matchParent || kids.length) return { ...p, children: kids };
                return null;
            })
            .filter(Boolean);
    }, [categories, query]);

    return (
        <>
            <div className="card shadow-sm" >
                {/* Header: tiêu đề + ô tìm kiếm + refresh */}
                <div
                    className="card-header bg-white d-flex align-items-center gap-2 sticky-top"
                    style={{ top: 0, zIndex: 1 }}
                >
                    <span className="fw-semibold">Danh mục</span>
                    <div className="ms-auto d-flex gap-2" style={{ minWidth: 180 }}>
                        <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder="Tìm danh mục…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Tìm danh mục"
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title="Tải lại"
                            onClick={fetchRoots}
                        >
                            ⟳
                        </button>
                    </div>
                </div>

                {/* Body: danh sách + form thêm */}
                <div
                    className="card-body p-2"
                    style={{ maxHeight: 420, overflow: "auto" }}
                    aria-live="polite"
                >
                    {/* Loading */}
                    {loading && (
                        <div className="d-flex flex-column gap-2 p-2">
                            <CatSkeleton />
                            <CatSkeleton />
                            <CatSkeleton />
                        </div>
                    )}

                    {/* Error */}
                    {!loading && err && (
                        <div className="alert alert-danger d-flex align-items-center justify-content-between py-2 px-3" role="alert">
                            <span className="small">{err}</span>
                            <button type="button" className="btn btn-sm btn-light" onClick={fetchRoots}>
                                Thử lại
                            </button>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && !err && filtered.length === 0 && (
                        <div className="text-center text-muted p-4 border rounded-3 bg-light-subtle">
                            <div className="fw-semibold mb-1">Không tìm thấy danh mục phù hợp</div>
                            <div className="small mb-2">Hãy thử từ khóa khác hoặc xóa bộ lọc.</div>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setQuery?.("")}>
                                Xóa từ khóa
                            </button>
                        </div>
                    )}

                    {/* List */}
                    {!loading && !err && filtered.length > 0 && (
                        <div className="d-flex flex-column gap-2">
                            {filtered.map((cat) => (
                                <CategoryItem
                                    key={cat.category_id}
                                    categoryId={categoryId}
                                    category={cat}
                                    onDelete={handleDelete}
                                    onSelect={onChange}
                                />
                            ))}
                        </div>
                    )}
                </div>


                {/* CSS nhỏ để hiển thị gọn */}
                <style>{`
        .card-body::-webkit-scrollbar{width:8px}
        .card-body::-webkit-scrollbar-thumb{background:#e6e6e6;border-radius:8px}
      `}</style>
            </div>
            <div className="dropdown text-start mt-3">
                <button
                    className="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
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
                        <button type="button" className="btn btn-primary w-100" onClick={handleSubmit}>
                            Thêm danh mục
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}
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
<style>{`
  .skeleton-row { background: var(--bs-body-bg); border: 1px solid #eee; }
  .skeleton-line, .skeleton-pill {
    position: relative; overflow: hidden; background: #f1f3f5;
  }
  .skeleton-line { height: 10px; border-radius: 6px; }
  .skeleton-pill { height: 26px; width: 96px; border-radius: 999px; }
  .skeleton-line::after, .skeleton-pill::after {
    content: ""; position: absolute; inset: 0; transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
    animation: sk 1.2s infinite;
  }
  @keyframes sk { 100% { transform: translateX(100%); } }

  /* scrollbar nhẹ nhàng */
  .card-body::-webkit-scrollbar{ width: 8px; }
  .card-body::-webkit-scrollbar-thumb{ background:#e6e6e6; border-radius: 8px; }
`}</style>

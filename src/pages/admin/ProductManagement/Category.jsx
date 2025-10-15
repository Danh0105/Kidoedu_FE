import axios from "axios";
import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";

export default function Category({ onChange }) {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [parentId, setParentId] = useState(null);
  useEffect(() => {
    axios.get("${process.env.react_app_api_url}/categories").then((res) => {
      const roots = res.data.filter((cat) => cat.parent === null);
      setCategories(roots);
    });
  }, [setCategories]);

  const handleDelete = async (id, isParent = false) => {
    const confirmMsg = isParent
      ? "Danh mục này là danh mục cha. Xoá nó sẽ xoá luôn các danh mục con. Bạn có chắc chắn không?"
      : "Bạn có chắc chắn muốn xoá danh mục này?";

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      await axios.delete(`{process.env.react_app_api_url}/categories/${id}`);

      const res = await axios.get(`{process.env.react_app_api_url}/categories`);
      const roots = res.data.filter((cat) => cat.parent === null);
      setCategories(roots);
    } catch (error) {
      console.error("Xoá thất bại:", error);
      alert("Không thể xoá danh mục!");
    }
  };



  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      const dto = {
        category_name: categoryName,
        parent_category_id: parentId || null,
      };
      const res = await axios.post(`{process.env.react_app_api_url}/categories`, dto);
      const newCat = res.data;
      if (newCat.parent) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.category_id === newCat.parent.category_id
              ? { ...cat, children: [...cat.children, newCat] }
              : cat
          )
        );
      } else {
        // Nếu là danh mục gốc
        setCategories((prev) => [...prev, { ...newCat, children: [] }]);
      }

      setCategoryName("");
      setParentId(null);
    } catch (err) {
      console.error("Lỗi khi thêm danh mục:", err);
      alert("Thêm danh mục thất bại!");
    }
  };


  return (
    <div >
      <div className="d-flex flex-column justify-content-start p-2 border-2 border gap-2 scrollspy-example" style={{ height: "400px" }}>
        {categories.map((cat) => (
          <CategoryItem
            key={cat.category_id}
            category={cat}
            onDelete={handleDelete}
            onSelect={onChange}
          />
        ))}

        {/* Form thêm danh mục */}
        <div className="dropdown text-start">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Thêm danh mục mới
          </button>
          <ul className="dropdown-menu p-3" style={{ minWidth: "250px" }}>
            <li className="mb-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên danh mục mới"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}

                />
              </div>
            </li>
            <li className="dropdown dropend">
              <select
                className="form-select"
                value={parentId ?? ""}
                onChange={(e) =>
                  setParentId(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="" disabled>
                  Chọn danh mục cha
                </option>
                {categories.map((p) => (
                  <option key={p.category_id} value={p.category_id}>
                    {p.category_name}
                  </option>
                ))}
              </select>
            </li>
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={handleSubmit}
            >
              Thêm danh mục mới
            </button>
          </ul>
        </div>
      </div>
    </div>
  );
}

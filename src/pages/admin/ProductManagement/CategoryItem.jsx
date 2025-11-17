import React from "react";

function CategoryItem({ category, onDelete, onSelect }) {

  return (
    <div className="text-start mt-2">
      {/* Hàng tiêu đề danh mục cha: tên + nút xóa */}
      <div className="d-flex align-items-center justify-content-between">
        <label
          className="fw-bold mb-0"
          htmlFor={`cat-${category.category_id}`}
        >
          {category.categoryName}
        </label>

        <button
          type="button"
          className="btn-close ms-2"
          title="Xóa danh mục cha"
          aria-label="Xóa danh mục cha"
          style={{
            width: "0.75rem",
            height: "0.75rem",
            padding: "0.25rem",
            transform: "scale(0.85)",
            filter:
              "invert(34%) sepia(94%) saturate(7476%) hue-rotate(353deg) brightness(100%) contrast(110%)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category.category_id, true);
          }}
        />
      </div>

      {/* Danh mục con */}
      {Array.isArray(category.children) && category.children.length > 0 && (
        <div className="ms-3 mt-2">
          <div className="vstack gap-2">
            {category.children.map((child) => {
              // 🔑 CHUẨN HOÁ ID Ở ĐÂY
              const childId =
                child.category_id ?? child.categoryId; // hỗ trợ cả 2 kiểu

              return (
                <div
                  key={childId}
                  className="d-flex align-items-center justify-content-between border rounded-pill px-2 py-1"
                >
                  <div className="d-flex align-items-center gap-2">
                    <input
                      className="form-check-input m-0"
                      type="radio"
                      name="category-radio"
                      value={childId}
                      id={`cat-${childId}`}
                      onChange={() => onSelect(childId)}
                    />
                    <label
                      className="form-check-label mb-0 text-truncate"
                      htmlFor={`cat-${childId}`}
                      title={child.categoryName}
                      style={{ maxWidth: 240 }}
                    >
                      {child.categoryName}
                    </label>
                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    title="Xóa danh mục con"
                    aria-label="Xóa danh mục con"
                    style={{
                      width: "0.6rem",
                      height: "0.6rem",
                      transform: "scale(0.9)",
                      filter:
                        "invert(34%) sepia(94%) saturate(7476%) hue-rotate(353deg) brightness(100%) contrast(110%)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onDelete(childId, false); // dùng childId luôn
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryItem;




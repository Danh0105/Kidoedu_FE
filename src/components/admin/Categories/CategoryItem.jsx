import React from "react";

function CategoryItem({ category, onDelete, onSelect, onEdit }) {
  const [editing, setEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(category.categoryName);
  const [childEditing, setChildEditing] = React.useState(null); // id đang sửa
  const [childEditName, setChildEditName] = React.useState("");

  return (
    <div className="text-start mt-2">
      {/* Hàng tiêu đề danh mục cha: tên + nút xóa */}
      <div className="d-flex align-items-center justify-content-between">
        {!editing ? (
          <>
            <label className="fw-bold mb-0" htmlFor={`cat-${category.category_id}`}>
              {category.categoryName}
            </label>

            <div className="d-flex align-items-center gap-2">
              {/* Nút sửa */}
              <button
                className="btn btn-sm btn-outline-primary py-0"
                onClick={() => {
                  setEditName(category.categoryName);
                  setEditing(true);
                }}
              >
                ✎
              </button>

              {/* Nút xóa */}

              <button
                type="button"
                className="btn btn-sm btn-outline-danger border-0 d-flex align-items-center justify-content-center"
                style={{ width: 26, height: 26, padding: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(category.category_id, true);
                }}
              >
                ✕
              </button>
            </div>
          </>
        ) : (
          // UI edit
          <div className="d-flex align-items-center gap-2 w-100">
            <input
              type="text"
              className="form-control form-control-sm"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            {/* Lưu */}
            <button
              className="btn btn-sm btn-primary py-0"
              onClick={() => {
                setEditing(false);
                onEdit(category.category_id, editName);
              }}
            >
              Lưu
            </button>

            {/* Hủy */}
            <button
              className="btn btn-sm btn-light py-0"
              onClick={() => setEditing(false)}
            >
              Hủy
            </button>
          </div>
        )}
      </div>


      {/* Danh mục con */}
      {Array.isArray(category.children) && category.children.length > 0 && (
        <div className="ms-3 mt-2">
          <div className="vstack gap-2">
            {category.children.map((child) => {
              const childId = child.category_id ?? child.categoryId;

              const isEditingChild = childEditing === childId;

              return (
                <div
                  key={childId}
                  className="d-flex align-items-center justify-content-between border rounded-pill px-2 py-1"
                >
                  {!isEditingChild ? (
                    <>
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

                      <div className="d-flex align-items-center gap-2">
                        {/* Nút sửa */}
                        <button
                          className="btn btn-sm btn-outline-primary py-0"
                          onClick={() => {
                            setChildEditName(child.categoryName);
                            setChildEditing(childId);
                          }}
                        >
                          ✎
                        </button>

                        {/* Nút xóa */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger border-0 d-flex align-items-center justify-content-center"
                          style={{ width: 26, height: 26, padding: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(childId, false);
                          }}
                        >
                          ✕
                        </button>

                      </div>
                    </>
                  ) : (
                    // UI editing
                    <div className="d-flex align-items-center gap-2 w-100">
                      <input
                        className="form-control form-control-sm"
                        value={childEditName}
                        onChange={(e) => setChildEditName(e.target.value)}
                      />

                      <button
                        className="btn btn-sm btn-primary py-0"
                        onClick={() => {
                          onEdit(childId, childEditName);
                          setChildEditing(null);
                        }}
                      >
                        Lưu
                      </button>

                      <button
                        className="btn btn-sm btn-light py-0"
                        onClick={() => setChildEditing(null)}
                      >
                        Hủy
                      </button>
                    </div>
                  )}
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




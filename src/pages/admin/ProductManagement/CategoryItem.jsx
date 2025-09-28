import React from "react";

function CategoryItem({ category, onDelete, onSelect }) {
  return (
    <div className="form-check text-start mt-2 p-0">
      <label
        className="form-check-label fw-bold"
        htmlFor={`cat-${category.category_id}`}
      >
        {category.category_name}
      </label>
      <a
        type="button"
        className="btn-close ms-2"
        style={{
          width: "0.75rem",
          height: "0.75rem",
          padding: "0.25rem",
          transform: "scale(0.8)",
          filter:
            "invert(34%) sepia(94%) saturate(7476%) hue-rotate(353deg) brightness(100%) contrast(110%)"
        }}
        onClick={() => onDelete(category.category_id, true)}
      ></a>

      {category.children && category.children.length > 0 && (
        <div className="container mt-2 ms-3">
          <div className="row row-cols-3">
            {category.children.map((child) => (
              <div className="col text-start" key={child.category_id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="category-radio"
                  value={child.category_id}
                  id={`cat-${child.category_id}`}
                  onChange={(e) => onSelect(child.category_id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`cat-${child.category_id}`}
                >
                  {child.category_name}
                  <a
                    type="button"
                    className="btn-close"
                    style={{
                      width: "0.6rem",
                      height: "0.6rem",
                      transform: "scale(0.8)",
                      filter:
                        "invert(34%) sepia(94%) saturate(7476%) hue-rotate(353deg) brightness(100%) contrast(110%)"
                    }}
                    onClick={() => onDelete(child.category_id, false)}
                  ></a>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryItem;

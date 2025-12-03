import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Search, X, ChevronDown, Check, Layers } from "lucide-react";
import "../../styles/user/SidebarCategories.css";

/** Normalize category object */
const normalizeNode = (node) => ({
  id: node.categoryId ?? node.category_id ?? node.id,
  name: node.categoryName ?? node.name,
  children: Array.isArray(node.children)
    ? node.children.map(normalizeNode)
    : [],
});

/** Filter with search query */
const filterTree = (nodes, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;

  const walk = (node) => {
    const nameMatch = node.name.toLowerCase().includes(q);
    const children = node.children.map(walk).filter(Boolean);

    if (nameMatch) return { ...node };
    if (children.length) return { ...node, children };
    return null;
  };

  return nodes.map(walk).filter(Boolean);
};

/** Component */
export default function SidebarCategories({
  roots = [],
  selectedCatId,
  onSelect = () => { },
  onClear = () => { },
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const containerRef = useRef(null);

  /** Normalize once */
  const normalized = useMemo(
    () => (Array.isArray(roots) ? roots.map(normalizeNode) : []),
    [roots]
  );

  /** Apply filter */
  const filtered = useMemo(
    () => filterTree(normalized, query),
    [normalized, query]
  );

  /** Auto open parent if a child is selected */
  useEffect(() => {
    if (!selectedCatId) return;

    filtered.forEach((parent) => {
      const match = parent.children.some(
        (c) => String(c.id) === String(selectedCatId)
      );
      if (match) setOpenId(parent.id);
    });
  }, [filtered, selectedCatId]);

  /** Close dropdown on outside click */
  useEffect(() => {
    const close = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenId(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggleOpen = useCallback(
    (id) => setOpenId((current) => (current === id ? null : id)),
    []
  );

  return (
    <div className="modern-cat-container" ref={containerRef}>
      {/* SEARCH BAR */}
      <div className="cat-top-bar">
        {selectedCatId && (
          <div className="active-filter-badge animate-fade-in">
            <span>Đang lọc: <b>#{selectedCatId}</b></span>
            <button onClick={onClear} className="remove-filter-btn">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* MAIN LIST */}
      {!filtered.length ? (
        <div className="empty-state">Không tìm thấy danh mục nào</div>
      ) : (
        <div className="d-flex justify-content-center align-item-center gap-2 p-2">
          <div className="scroll-track ">
            {filtered.map((cat) => {
              const { id, name, children } = cat;
              const hasChildren = children.length > 0;
              const isOpen = openId === id;
              const childSelected = children.some(
                (c) => String(c.id) === String(selectedCatId)
              );

              return (
                <div key={id} className="cat-group">
                  {/* PARENT CHIP */}
                  <button
                    className={`cat-chip ${isOpen ? "active" : ""} ${childSelected ? "has-selection" : ""
                      }`}
                    onClick={() =>
                      hasChildren ? toggleOpen(id) : onSelect(id)
                    }
                  >
                    <Layers size={16} className="cat-icon" />
                    <span className="cat-name">{name}</span>
                    {hasChildren && (
                      <ChevronDown
                        size={14}
                        className={`arrow-icon ${isOpen ? "rotate" : ""}`}
                      />
                    )}
                  </button>

                  {/* DROPDOWN */}
                  {isOpen && hasChildren && (
                    <div className="cat-dropdown-menu animate-slide-down">
                      <div className="dropdown-arrow"></div>

                      <div className="dropdown-grid">
                        {children.map((child) => {
                          const selected =
                            String(child.id) === String(selectedCatId);
                          return (
                            <div
                              key={child.id}
                              className={`sub-cat-item ${selected ? "selected" : ""
                                }`}
                              onClick={() => onSelect(child.id)}
                            >
                              <div className="d-flex align-items-center gap-2 w-100">
                                <div
                                  className={`custom-radio ${selected ? "checked" : ""
                                    }`}
                                >
                                  {selected && <div className="radio-dot" />}
                                </div>

                                <span className="sub-name">{child.name}</span>

                                {selected && (
                                  <Check
                                    size={16}
                                    className="ms-auto text-primary"
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
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

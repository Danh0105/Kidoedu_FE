import { ChevronRight, Cpu, Menu } from "lucide-react";
import React from "react";

const CategorySidebar = ({
    rootCats = [],
    hoverCatId,
    setHoverCatId,
    setShowHoverPanel,
    setSelectedCatId,
}) => (
    <div
        className="bg-white border rounded shadow-sm position-relative d-flex flex-column"
        style={{ minWidth: 260 }}
    >
        <div className="bg-danger text-white fw-bold d-flex align-items-center px-3 py-2">
            <Menu size={20} className="me-2" /> MENU
        </div>

        <ul className="list-group list-group-flush overflow-auto flex-grow-1">
            {rootCats.length > 0 ? (
                rootCats.map((cat) => {
                    const id = cat._id;
                    const isHover = String(hoverCatId) === String(id);

                    return (
                        <li
                            key={id}
                            className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between 
                ${isHover ? "bg-danger-subtle text-danger fw-semibold" : ""}`}
                            onMouseEnter={() => {
                                setHoverCatId(id);
                                setShowHoverPanel(true);
                                setSelectedCatId(null);
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <Cpu
                                    size={18}
                                    className={`me-2 ${isHover ? "text-danger" : "text-primary"}`}
                                />
                                <span>{cat._name}</span>
                            </div>
                            <ChevronRight size={16} className="text-muted" />
                        </li>
                    );
                })
            ) : (
                Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="list-group-item placeholder-glow">
                        <span className="placeholder col-8" />
                    </li>
                ))
            )}
        </ul>
    </div>
);

export default CategorySidebar;

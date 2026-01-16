import { ChevronRight, Cpu, Layers } from "lucide-react";

const SubcategoryPanel = (rootCats, hoverCatId, childrenOfHover, setSelectedCatId, setShowHoverPanel, setHoverCatId) => {
    const title =
        rootCats.find((r) => String(r._id) === String(hoverCatId))?._name ||
        "Danh mục";
    return (
        <div className="ps-3 w-100" style={{ minHeight: "450px" }}>
            <div
                className="card border-0 shadow-sm rounded-4"
                style={{
                    minHeight: 260,
                    transition: "opacity 160ms ease, transform 160ms ease",
                    opacity: 1,
                    transform: "translateY(0)",
                }}
            >
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        <div
                            className="me-2 d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle"
                            style={{ width: 36, height: 36 }}
                        >
                            <Layers size={18} className="text-danger" />
                        </div>
                        <div>
                            <h5 className="mb-0">{title}</h5>
                            <small className="text-muted">
                                Chọn danh mục con để xem sản phẩm
                            </small>
                        </div>
                    </div>

                    {/* Grid danh mục con: 2–3 cột tự co giãn */}
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
                        {childrenOfHover.length > 0 ? (
                            childrenOfHover.map((child) => (
                                <div key={child._id} className="col">
                                    <button
                                        className="w-100 btn btn-light border d-flex align-items-center justify-content-between rounded-4 py-3 px-3 shadow-sm"
                                        onClick={() => {
                                            setSelectedCatId(child._id); // chuyển sang chế độ sản phẩm
                                            setShowHoverPanel(false);
                                            setHoverCatId(null);
                                        }}
                                    >
                                        <span className="d-flex align-items-center">
                                            <Cpu size={18} className="me-2 text-primary" />
                                            <span className="fw-semibold">{child._name}</span>
                                        </span>
                                        <ChevronRight size={16} className="text-muted" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col">
                                <div className="alert alert-light border rounded-4 mb-0">
                                    Chưa có danh mục con.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SubcategoryPanel;
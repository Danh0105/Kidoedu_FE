export default function VariantSelector({ variants, activeVariant, onSelect }) {
    return (
        <div className="mt-2">
            <div className="fw-semibold mb-1">Chọn phiên bản</div>

            <div className="d-flex flex-wrap gap-2">
                {variants.map((v) => (
                    <button
                        key={v.variantId}
                        className={`btn btn-sm ${activeVariant?.variantId === v.variantId
                                ? "btn-primary"
                                : "btn-outline-secondary"
                            }`}
                        onClick={() => onSelect(v)}
                    >
                        {v.variantName}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function AttributeSelector({ attributes, selected, onSelect }) {
    return (
        <div className="mt-3 p-3 border rounded bg-light-subtle">
            <div className="fw-semibold mb-2">Thuộc tính</div>

            <div className="d-flex flex-wrap gap-2">
                {Object.entries(attributes).flatMap(([key, values]) => {
                    const list = Array.isArray(values) ? values : [values];

                    return list.map((val) => {
                        const k = `${key}:${val}`;
                        const checked = selected === k;

                        return (
                            <button
                                key={k}
                                className={`btn btn-sm rounded-pill ${checked ? "btn-danger" : "btn-outline-secondary"
                                    }`}
                                onClick={() => onSelect(checked ? null : k)}
                            >
                                {key}: {val}
                            </button>
                        );
                    });
                })}
            </div>
        </div>
    );
}

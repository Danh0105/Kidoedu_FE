export default function QuantitySelector({ quantity, setQuantity }) {
    return (
        <div className="mt-3 d-flex align-items-center gap-2">
            <div className="input-group" style={{ maxWidth: 140 }}>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                    −
                </button>

                <input
                    className="form-control text-center"
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(Math.max(1, Number(e.target.value) || 1))
                    }
                />

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                >
                    +
                </button>
            </div>
        </div>
    );
}

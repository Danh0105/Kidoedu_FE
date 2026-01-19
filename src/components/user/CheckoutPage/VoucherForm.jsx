import React from "react";

const VoucherForm = ({ value, onChange, onApply }) => {
    return (
        <div>
            <div className="row align-items-center g-2">
                {/* Input + Icon */}
                <div className="col">
                    <div className="input-group">
                        <span className="input-group-text bg-danger text-white">
                            <i className="bi bi-ticket-perforated"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập mã Voucher"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Button */}
                <div className="col-auto">
                    <button
                        className="btn btn-outline-secondary"
                        disabled={!value.trim()}
                        onClick={onApply}
                    >
                        ÁP DỤNG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoucherForm;

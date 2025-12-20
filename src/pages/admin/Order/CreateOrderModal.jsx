import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ProductDropdown from "./ProductDropdown";

const API_BASE = process.env.REACT_APP_API_URL;

export default function CreateOrderModal({ show, onClose }) {
    // ==========================
    // SẢN PHẨM ĐÃ CHỌN
    // ==========================
    const [items, setItems] = useState([]);
    const removeItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    // ==========================
    // FORM THÔNG TIN NGƯỜI DÙNG
    // ==========================
    const [activeTab, setActiveTab] = useState("personal");

    const [form, setForm] = useState({
        full_name_personal: "",
        full_name_business: "",
        phone_number_personal: "",
        phone_number_buiness: "",
        email_personal: "",
        email_business: "",
        companyName: "",
        taxId: "",
        street: "",
        city: "",
        district: "",
        ward: "",
        dateOfBirth: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ==========================
    // ĐỊA CHỈ TỈNH / HUYỆN / XÃ
    // ==========================
    const [citys, setCitys] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [shippingInfo, setShippingInfo] = useState([]);

    useEffect(() => {
        fetchCitys();

        const saved = Cookies.get("shippingInfo");
        if (saved) {
            try {
                setShippingInfo(JSON.parse(saved));
            } catch { }
        }
    }, []);

    const fetchCitys = async () => {
        const res = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
        setCitys(res.data.data);
    };

    const fetchDistricts = async (cityId) => {
        const res = await axios.get(`https://esgoo.net/api-tinhthanh/2/${cityId}.htm`);
        setDistricts(res.data.data);
        setWards([]);
    };

    const fetchWards = async (districtId) => {
        const res = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
        setWards(res.data.data);
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        const cityName = citys.find(c => c.id === cityId)?.full_name || "";
        setForm({ ...form, city: cityName, district: "", ward: "" });
        fetchDistricts(cityId);
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const districtName = districts.find(d => d.id === districtId)?.full_name || "";
        setForm({ ...form, district: districtName, ward: "" });
        fetchWards(districtId);
    };

    const handleWardChange = (e) => {
        const wardId = e.target.value;
        const wardName = wards.find(w => w.id === wardId)?.full_name || "";
        setForm({ ...form, ward: wardName });
    };

    // ==========================
    // CHỌN ĐỊA CHỈ MẶC ĐỊNH
    // ==========================
    const onchangeAddress = (id) => {
        const list = JSON.parse(Cookies.get("shippingInfo") || "[]");
        const selected = list.find(item => item.id === id);

        if (selected) {
            setForm({
                ...form,
                full_name_personal: selected.address.full_name,
                phone_number_personal: selected.address.phone_number,
                street: selected.address.street,
                ward: selected.address.ward,
                district: selected.address.district,
                city: selected.address.city,
            });
        }
    };

    const handleSetDefault = (id) => {
        let list = JSON.parse(Cookies.get("shippingInfo") || "[]");

        const updated = list.map(item => ({
            ...item,
            address: {
                ...item.address,
                is_default: item.id === id
            }
        }));

        Cookies.set("shippingInfo", JSON.stringify(updated), { expires: 7 });
        setShippingInfo(updated);
    };

    const handleDelete = (id) => {
        let list = JSON.parse(Cookies.get("shippingInfo") || "[]");

        let updated = list.filter(item => item.id !== id);

        Cookies.set("shippingInfo", JSON.stringify(updated), { expires: 7 });
        setShippingInfo(updated);
    };

    // ==========================
    // BUILD PAYLOAD USER
    // ==========================
    const buildUserPayload = () => {
        if (activeTab === "personal") {
            return {
                username: form.full_name_personal,
                email: form.email_personal,
                fullName: form.full_name_personal,
                dateOfBirth: form.dateOfBirth,
                address: {
                    full_name: form.full_name_personal,
                    phone_number: form.phone_number_personal,
                    street: form.street,
                    ward: form.ward,
                    district: form.district,
                    city: form.city,
                    is_default: false
                }
            };
        }

        return {
            username: form.companyName,
            email: form.email_business,
            companyName: form.companyName,
            taxId: form.taxId,
            businessEmail: form.email_business,
            address: {
                full_name: form.full_name_business,
                phone_number: form.phone_number_buiness,
                street: form.street,
                ward: form.ward,
                district: form.district,
                city: form.city,
                is_default: false
            }
        };
    };

    const getRegisterApi = () => {
        if (activeTab === "personal")
            return `${process.env.REACT_APP_API_URL}/users/register-individual`;

        return `${process.env.REACT_APP_API_URL}/users/register-business`;;
    };

    // ==========================
    // SUBMIT FORM → GỬI USER PAYLOAD
    // ==========================
    const submit = async () => {
        try {
            const userPayload = buildUserPayload();

            const payload = {
                username: userPayload.username,
                email: userPayload.email,
                address: userPayload.address,
                items: items.map(it => ({
                    variantId: it.variantId || null,
                    productId: it.productId,
                    quantity: it.quantity,
                    pricePerUnit: Number(it.price),
                    attributes: it.attributes || {}
                }))
            };

            const url = getRegisterApi();

            console.log("SENDING PAYLOAD:", payload);

            await axios.post(url, payload);

            alert("Gửi dữ liệu thành công!");
            onClose();
        } catch (err) {
            console.error(err);
            alert("Lỗi gửi dữ liệu!");
        }
    };


    if (!show) return null;

    return (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">Tạo đơn hàng mới</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body">

                        {/* ============= CHỌN SẢN PHẨM ============= */}
                        <ProductDropdown
                            onChange={(item) => {
                                setItems(prev => {
                                    const index = prev.findIndex(x =>
                                        x.productId === item.productId &&
                                        x.variantId === item.variantId &&
                                        JSON.stringify(x.attributes) === JSON.stringify(item.attributes)
                                    );

                                    if (index !== -1) {
                                        const updated = [...prev];
                                        updated[index].quantity += item.quantity;
                                        return updated;
                                    }

                                    return [...prev, item];
                                });
                            }}
                        />

                        {/* ============= LIST SẢN PHẨM ============= */}
                        {items.length > 0 && (
                            <div className="mt-3">
                                <h6>Sản phẩm đã chọn:</h6>

                                <div className="overflow-x-auto" style={{ whiteSpace: "nowrap" }}>
                                    {items.map((it, index) => (
                                        <div
                                            key={index}
                                            className="border rounded p-2 mb-2 d-inline-flex gap-3 align-items-center"
                                            style={{ minWidth: 280 }}
                                        >
                                            <div>
                                                <strong>{it.productName}</strong>
                                                <div className="small text-muted">Biến thể: {it.variantName}</div>
                                                {Object.keys(it.attributes || {}).length > 0 && (
                                                    <div className="small">
                                                        {Object.entries(it.attributes)
                                                            .map(([k, v]) => `${k}: ${v}`)
                                                            .join(", ")}
                                                    </div>
                                                )}
                                                <div>SL: {it.quantity}</div>
                                                <div className="text-danger fw-bold">
                                                    {(it.price * it.quantity).toLocaleString()} đ
                                                </div>
                                            </div>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeItem(index)}
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ================= ĐỊA CHỈ ================= */}
                        <h6 className="mt-3">Địa chỉ nhận hàng</h6>

                        <div className="d-flex gap-3 mb-3">
                            <div className="flex-fill">
                                <select className="form-select" onChange={handleCityChange}>
                                    <option>Chọn Tỉnh/Thành phố</option>
                                    {citys.map(c => (
                                        <option key={c.id} value={c.id}>{c.full_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-fill">
                                <select className="form-select" onChange={handleDistrictChange}>
                                    <option>Chọn Quận/Huyện</option>
                                    {districts.map(d => (
                                        <option key={d.id} value={d.id}>{d.full_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-fill">
                                <select className="form-select" onChange={handleWardChange}>
                                    <option>Chọn Phường/Xã</option>
                                    {wards.map(w => (
                                        <option key={w.id} value={w.id}>{w.full_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <input
                            className="form-control mb-3"
                            placeholder="Số nhà, đường"
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                        />

                        {/* ================= TAB NGƯỜI DÙNG ================= */}
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "personal" ? "active" : ""}`}
                                    onClick={() => setActiveTab("personal")}
                                >
                                    Cá nhân
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "business" ? "active" : ""}`}
                                    onClick={() => setActiveTab("business")}
                                >
                                    Doanh nghiệp
                                </button>
                            </li>
                        </ul>

                        {/* ================= FORM CÁ NHÂN ================= */}
                        {activeTab === "personal" && (
                            <div className="mt-3">
                                <input
                                    className="form-control mb-2"
                                    name="full_name_personal"
                                    placeholder="Họ và tên"
                                    value={form.full_name_personal}
                                    onChange={handleChange}
                                />
                                <input
                                    className="form-control mb-2"
                                    name="email_personal"
                                    placeholder="Email"
                                    value={form.email_personal}
                                    onChange={handleChange}
                                />
                                <input
                                    type="date"
                                    className="form-control mb-2"
                                    name="dateOfBirth"
                                    value={form.dateOfBirth}
                                    onChange={handleChange}
                                />
                                <input
                                    className="form-control mb-2"
                                    name="phone_number_personal"
                                    placeholder="Số điện thoại"
                                    value={form.phone_number_personal}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* ================= FORM DOANH NGHIỆP ================= */}
                        {activeTab === "business" && (
                            <div className="mt-3">
                                <input
                                    className="form-control mb-2"
                                    name="companyName"
                                    placeholder="Tên công ty"
                                    value={form.companyName}
                                    onChange={handleChange}
                                />
                                <input
                                    className="form-control mb-2"
                                    name="taxId"
                                    placeholder="Mã số thuế"
                                    value={form.taxId}
                                    onChange={handleChange}
                                />
                                <input
                                    className="form-control mb-2"
                                    name="email_business"
                                    placeholder="Email nhận hóa đơn"
                                    value={form.email_business}
                                    onChange={handleChange}
                                />
                                <input
                                    className="form-control mb-2"
                                    name="full_name_business"
                                    placeholder="Tên người nhận"
                                    value={form.full_name_business}
                                    onChange={handleChange}
                                />
                                <input
                                    className="form-control mb-2"
                                    name="phone_number_buiness"
                                    placeholder="Số điện thoại nhận hàng"
                                    value={form.phone_number_buiness}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* ================= LIST ĐỊA CHỈ TỪ COOKIE ================= */}
                        <h6 className="mt-4">Địa chỉ đã lưu</h6>

                        {shippingInfo?.map(s => (
                            <div className="border-top p-2 row" key={s.id}>
                                <div className="col-md-7">
                                    <strong>{s.address.full_name}</strong> – {s.address.phone_number}
                                    <div>{s.address.street}, {s.address.ward}, {s.address.district}, {s.address.city}</div>
                                </div>

                                <div className="col-md-2">
                                    <input
                                        type="radio"
                                        name="selectAddress"
                                        onChange={() => onchangeAddress(s.id)}
                                    />
                                </div>

                                <div className="col-md-3">
                                    {s.address.is_default ? (
                                        <span className="badge bg-danger">Mặc định</span>
                                    ) : (
                                        <button
                                            className="btn btn-outline-success btn-sm me-2"
                                            onClick={() => handleSetDefault(s.id)}
                                        >
                                            Chọn làm mặc định
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleDelete(s.id)}
                                    >
                                        Xoá
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>

                        <button className="btn btn-primary" onClick={submit}>
                            Gửi người dùng
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

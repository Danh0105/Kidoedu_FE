import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../user/css/ModalInfo.css";

/* ================== CONSTANT & UTILS ================== */
const CITY_API = "https://esgoo.net/api-tinhthanh";
const fakeNames = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D"];

const generateFakeName = () =>
  fakeNames[Math.floor(Math.random() * fakeNames.length)];

const generateFakeEmail = () =>
  `guest_${Date.now()}@noemail.local`;

/* ================== COMPONENT ================== */
export default function ModalInfo({ onUpdate, onClose }) {
  /* ================== STATE ================== */
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [shippingInfo, setShippingInfo] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [form, setForm] = useState({
    full_name_personal: "",
    full_name_business: "",
    phone_number_personal: "",
    phone_number_buiness: "",
    email_personal: "",
    email_business: "",
    street: "",
    city: "",
    district: "",
    ward: "",
    dateOfBirth: "",
    companyName: "",
    taxId: "",
  });

  /* ================== EFFECT ================== */
  useEffect(() => {
    fetchCitys();
  }, []);

  useEffect(() => {
    const saved = Cookies.get("shippingInfo");
    if (!saved) {
      setShowForm(true);
      return;
    }
    try {
      const list = JSON.parse(saved);
      setShippingInfo(Array.isArray(list) ? list : []);
      if (!list.length) setShowForm(true);
    } catch {
      setShowForm(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  /* ================== API ================== */
  const fetchCitys = async () => {
    const res = await axios.get(`${CITY_API}/1/0.htm`);
    setCitys(res.data.data || []);
  };

  const fetchDistricts = async (cityId) => {
    const res = await axios.get(`${CITY_API}/2/${cityId}.htm`);
    setDistricts(res.data.data || []);
    setWards([]);
  };

  const fetchWards = async (districtId) => {
    const res = await axios.get(`${CITY_API}/3/${districtId}.htm`);
    setWards(res.data.data || []);
  };

  /* ================== HANDLER ================== */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const cityName = citys.find((c) => c.id === cityId)?.full_name || "";
    setForm({ ...form, city: cityName, district: "", ward: "" });
    fetchDistricts(cityId);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    const districtName =
      districts.find((d) => d.id === districtId)?.full_name || "";
    setForm({ ...form, district: districtName, ward: "" });
    fetchWards(districtId);
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    const wardName = wards.find((w) => w.id === wardId)?.full_name || "";
    setForm({ ...form, ward: wardName });
  };

  const resetForm = () => {
    setForm({
      full_name_personal: "",
      full_name_business: "",
      phone_number_personal: "",
      phone_number_buiness: "",
      email_personal: "",
      email_business: "",
      street: "",
      city: "",
      district: "",
      ward: "",
      dateOfBirth: "",
      companyName: "",
      taxId: "",
    });
    setEditingId(null);
    setDefaultAddress(false);
  };

  const validateForm = () => {
    const fields =
      activeTab === "personal"
        ? ["phone_number_personal", "street", "city", "district", "ward"]
        : [
          "companyName",
          "taxId",
          "full_name_business",
          "phone_number_buiness",
          "street",
          "city",
          "district",
          "ward",
        ];

    return fields.every((f) => form[f]?.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc");
      return;
    }

    const isPersonal = activeTab === "personal";
    const name = isPersonal
      ? form.full_name_personal
      : form.full_name_business;
    const email = isPersonal ? form.email_personal : form.email_business;

    const finalName = name?.trim() || generateFakeName();
    const finalEmail = email?.trim() || generateFakeEmail();

    const url = `${process.env.REACT_APP_API_URL}/users/${isPersonal ? "register-individual" : "register-business"
      }`;

    const payload = {
      id: editingId || Date.now(),
      username: finalEmail.split("@")[0],
      email: finalEmail,
      ...(isPersonal
        ? { fullName: finalName, dateOfBirth: form.dateOfBirth || null }
        : {
          companyName: form.companyName,
          taxId: form.taxId,
          businessEmail: finalEmail,
        }),
      address: {
        full_name: finalName,
        phone_number: isPersonal
          ? form.phone_number_personal
          : form.phone_number_buiness,
        street: form.street,
        ward: form.ward,
        district: form.district,
        city: form.city,
        is_default: defaultAddress,
      },
      API: url,
    };

    const updated = editingId
      ? shippingInfo.map((i) => (i.id === editingId ? payload : i))
      : [...shippingInfo, payload];

    setShippingInfo(updated);
    Cookies.set("shippingInfo", JSON.stringify(updated), { expires: 7 });
    onUpdate?.(payload);
    resetForm();
    onClose();
  };
  /* ================== EXTRA HANDLERS (FIX NO-UNDEF) ================== */

  // đổi tab cá nhân / doanh nghiệp
  const handleTabChange = (tab) => {
    resetForm();
    setActiveTab(tab);
  };

  // chọn địa chỉ để trả về Checkout
  const onchangeAddress = (id) => {
    const selected = shippingInfo.find((item) => item.id === id);
    if (selected && onUpdate) {
      onUpdate(selected);
    }
  };

  // set địa chỉ mặc định
  const handleSetDefault = (id) => {
    const updated = shippingInfo.map((item) => ({
      ...item,
      address: {
        ...item.address,
        is_default: item.id === id,
      },
    }));

    setShippingInfo(updated);
    Cookies.set("shippingInfo", JSON.stringify(updated), { expires: 7 });
  };

  // sửa địa chỉ
  const handleEdit = (item) => {
    setEditingId(item.id);
    setActiveTab(item.companyName ? "business" : "personal");

    setForm({
      full_name_personal: item.fullName || "",
      full_name_business: item.address?.full_name || "",
      phone_number_personal: item.address?.phone_number || "",
      phone_number_buiness: item.address?.phone_number || "",
      email_personal: item.email || "",
      email_business: item.businessEmail || "",
      street: item.address?.street || "",
      city: item.address?.city || "",
      district: item.address?.district || "",
      ward: item.address?.ward || "",
      dateOfBirth: item.dateOfBirth || "",
      companyName: item.companyName || "",
      taxId: item.taxId || "",
    });

    setDefaultAddress(item.address?.is_default || false);
    setShowForm(true);
  };

  // xóa địa chỉ
  const handleDelete = (id) => {
    let updated = shippingInfo.filter((item) => item.id !== id);

    // nếu xóa địa chỉ mặc định → gán mặc định cho item đầu tiên
    if (updated.length > 0 && !updated.some((i) => i.address.is_default)) {
      updated[0] = {
        ...updated[0],
        address: {
          ...updated[0].address,
          is_default: true,
        },
      };
    }

    setShippingInfo(updated);
    Cookies.set("shippingInfo", JSON.stringify(updated), { expires: 7 });
  };

  /* ================== RENDER ================== */
  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thông tin khách hàng</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="p-2 text-center">
              <button
                className="btn btn-outline-success"
                onClick={() => setShowForm((v) => !v)}
              >
                Thêm địa chỉ mới
              </button>
            </div>

            <div className={`collapse ${showForm ? "show" : ""}`}>
              <div className="card card-body rounded-0">
                <div className="modal-body">
                  <form
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-3"
                  >
                    {/* Select Tỉnh/Thành phố */}
                    <p className="text-start text-muted">Địa chỉ nhận hàng</p>
                    <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                      <div className="d-flex flex-column gap-3 w-50">
                        <select
                          name="city"
                          onChange={handleCityChange}
                          className="w-full p-2 border rounded-xl text-danger"
                          required
                        >
                          <option value="">Chọn Tỉnh/Thành phố*</option>
                          {citys.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.full_name}
                            </option>
                          ))}
                        </select>

                        <select
                          name="ward"
                          onChange={handleWardChange}
                          className="w-full p-2 border rounded-xl text-danger"
                          required
                        >
                          <option value="">Chọn Phường/Xã*</option>
                          {wards.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.full_name}
                            </option>
                          ))}
                        </select>

                      </div>

                      <div className="d-flex flex-column gap-3 w-50 ">

                        <select
                          name="district"
                          onChange={handleDistrictChange}
                          className="w-full p-2 border rounded-xl text-danger"
                          required
                        >
                          <option value="">Chọn Quận/Huyện*</option>
                          {districts.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.full_name}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          name="street"
                          placeholder="Số nhà, đường*"
                          value={form.street}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-xl text-danger"
                          required
                        />
                      </div>
                    </div>
                    <hr />
                    <nav>
                      <div className="nav nav-tabs justify-content-center" id="nav-tab" role="tablist">
                        <button
                          className={`nav-link ${activeTab === "personal" ? "active" : ""}`}
                          id="nav-home-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-home"
                          type="button"
                          role="tab"
                          aria-controls="nav-home"
                          aria-selected={activeTab === "personal"}
                          onClick={() => handleTabChange("personal")}
                        >
                          Người dùng cá nhân
                        </button>
                        <button
                          className={`nav-link ${activeTab === "business" ? "active" : ""}`}
                          id="nav-profile-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-profile"
                          type="button"
                          role="tab"
                          aria-controls="nav-profile"
                          aria-selected={activeTab === "business"}
                          onClick={() => handleTabChange("business")}
                        >
                          Người dùng doanh nghiệp
                        </button>
                      </div>
                    </nav>

                    <div className="tab-content" id="nav-tabContent">
                      {/* person */}
                      <div
                        className={`tab-pane fade ${activeTab === "personal" ? "show active" : ""}`}
                        id="nav-home"
                        role="tabpanel"
                        aria-labelledby="nav-home-tab"
                      >
                        <div className="d-flex justify-content-center align-items-center gap-3 mb-3 mt-3">
                          <div className="d-flex flex-column gap-3 w-50">
                            <input
                              type="text"
                              name="full_name_personal"
                              placeholder="Họ và tên"
                              value={form.full_name_personal}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-xl"

                            />
                            <input
                              type="email"
                              name="email_personal"
                              placeholder="Email"
                              value={form.email_personal}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-xl"

                            />
                          </div>
                          <div className="d-flex flex-column gap-3 w-50">
                            <input
                              type="date"
                              name="dateOfBirth"
                              placeholder="Ngày sinh"
                              value={form.dateOfBirth}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-xl"

                            />
                            <input
                              type="tel"
                              name="phone_number_personal"
                              placeholder="Số điện thoại *"
                              value={form.phone_number_personal}
                              onChange={handleChange}
                              className={`w-full p-2 border rounded-xl ${!form.phone_number_personal ? "text-danger border-danger" : "text-dark"
                                }`}
                              required={activeTab === "personal"}
                            />

                          </div>
                        </div>
                      </div>
                      {/* company */}
                      <div
                        className={`tab-pane fade ${activeTab === "business" ? "show active" : ""}`}
                        id="nav-profile"
                        role="tabpanel"
                        aria-labelledby="nav-profile-tab"
                      >
                        <div className="d-flex justify-content-center align-items-center gap-3 mb-3 mt-3">
                          <input
                            type="text"
                            name="companyName"
                            placeholder="Tên công ty"
                            value={form.companyName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-xl"

                          />
                          <input
                            type="text"
                            name="taxId"
                            placeholder="Mã số thuế"
                            value={form.taxId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-xl"

                          />
                          <input
                            type="text"
                            name="email_business"
                            placeholder="Email nhận hóa đơn"
                            value={form.email_business}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-xl"

                          />

                        </div>
                        <div className="d-flex justify-content-center align-items-center gap-3 mb-3 mt-3">
                          <input
                            type="text"
                            name="full_name_business"
                            placeholder="Tên người nhận hàng"
                            value={form.full_name_business}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-xl"

                          />
                          <input
                            type="text"
                            name="phone_number_buiness"
                            placeholder="Số điện thoại người nhận hàng"
                            value={form.phone_number_buiness}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-xl"
                            required={activeTab === "business"}

                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer d-flex justify-content-between">
                      {/* Nút xóa form */}
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={resetForm}
                      >
                        Xóa thông tin
                      </button>

                      {/* Nút lưu */}
                      <button
                        type="submit"
                        className="btn btn-success"
                      >
                        {editingId ? "Cập nhật" : "Lưu thông tin"}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
            {shippingInfo ? (
              shippingInfo.map((s) => (
                <>
                  <div className="row p-2 w-100 m-auto  border-top">
                    <div className="col-md-5 ">
                      <div className="fw-bold mb-2 text-wrap text-start">
                        {s.address?.full_name} - (+84){" "}
                        {s.address?.phone_number}
                      </div>
                      <div className="text-wrap text-start">
                        {s.address?.street},{" "}
                        {s.address?.ward},{" "}
                        {s.address?.district},{" "}
                        {s.address?.city}
                      </div>

                      {s.companyName && (
                        <div className="mt-2 small text-start">
                          <strong>Tên công ty:</strong> {s.companyName} |{" "}
                          <strong>Email:</strong> {s.businessEmail} |{" "}
                          <strong>MST:</strong> {s.taxId}
                        </div>
                      )}
                    </div>
                    <div className="col">
                      <input className="form-check-input border-danger" type="radio" name="radioDefault" id="radioDefault1" onChange={() => onchangeAddress(s.id)} />
                    </div>
                    <div className="col-md-6">
                      {s.address.is_default == true ?
                        (
                          <span className="btn btn-outline-danger me-2 disabled" type="button">
                            Mặc định
                          </span>
                        ) : (

                          <button className="btn btn-outline-success  me-2 " type="button" onClick={() => handleSetDefault(s.id)}>
                            Chọn làm mặc định
                          </button>
                        )
                      }
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => handleEdit(s)}
                      >
                        Sửa
                      </button>
                      <button className="btn btn-outline-danger " type="button" onClick={() => handleDelete(s.id)}>
                        X
                      </button>
                    </div>
                  </div>
                </>
              ))

            ) : (
              <>
              </>
            )}


          </div>
        </div>
      </div>
    </>
  );
}

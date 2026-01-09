import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
export default function ModalInfo({ onUpdate }) {
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [shippingInfo, setShippingInfo] = useState([]);
  const [defaultAddress, setDefaultAddresss] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
  });
  const [activeTab, setActiveTab] = useState("personal");

  const resetForm = () => {

    setForm({
      full_name_personal: "",
      email_personal: "",
      dateOfBirth: "",
      phone_number_personal: "",
      companyName: "",
      taxId: "",
      email_business: "",
      full_name_business: "",
      phone_number_buiness: "",
      street: "",      // reset
      city: "",        // reset
      district: "",    // reset
      ward: "",
    });
    setCitys([]);
    setDistricts([]);
    setWards([]);
    fetchCitys();
  };

  const handleTabChange = (tab) => {
    resetForm();
    setActiveTab(tab);
  };
  // Lấy danh sách tỉnh/thành khi load trang
  useEffect(() => {
    fetchCitys();
  }, []);

  const fetchCitys = async () => {
    try {
      const response = await axios.get(
        "https://esgoo.net/api-tinhthanh/1/0.htm"
      );
      setCitys(response.data.data);
    } catch (error) {
    }
  };

  const fetchDistricts = async (cityId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/2/${cityId}.htm`
      );
      setDistricts(response.data.data);
      setWards([]); // reset phường/xã
    } catch (error) {
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      );
      setWards(response.data.data);
    } catch (error) {
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
  // ====== Utils tạo dữ liệu giả ======
  const generateFakeName = () => {
    const names = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateFakeEmail = () => {
    return `guest_${Date.now()}@noemail.local`;
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    const wardName = wards.find((w) => w.id === wardId)?.full_name || "";
    setForm({ ...form, ward: wardName });
  };
  const validateForm = () => {
    const requiredFields = activeTab === "personal"
      ? [
        "phone_number_personal",
        "street",
        "city",
        "district",
        "ward",
      ]
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

    for (const field of requiredFields) {
      if (!form[field] || form[field].trim() === "") {
        alert("Vui lòng nhập đầy đủ các trường bắt buộc");
        return false;
      }
    }

    return true;
  };
  const handleEdit = (item) => {
    setEditingId(item.id);

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

    setDefaultAddresss(item.address?.is_default || false);

    // mở collapse
    const el = document.getElementById("1760319218204");
    if (el && !el.classList.contains("show")) {
      el.classList.add("show");
    }

    setActiveTab(item.companyName ? "business" : "personal");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let url = "";
      let payload = {};

      if (activeTab === "personal") {
        const finalName =
          form.full_name_personal?.trim() || generateFakeName();

        const finalEmail =
          form.email_personal?.trim() || generateFakeEmail();

        url = `${process.env.REACT_APP_API_URL}/users/register-individual`;

        payload = {
          id: Date.now(),
          username: finalEmail.split("@")[0],
          email: finalEmail,
          fullName: finalName,
          dateOfBirth: form.dateOfBirth || null,
          address: {
            full_name: finalName,
            phone_number: form.phone_number_personal,
            street: form.street,
            ward: form.ward,
            district: form.district,
            city: form.city,
            is_default: defaultAddress || false,
          },
          API: url,
        };
      }
      else {
        const finalName =
          form.full_name_business?.trim() || generateFakeName();

        const finalEmail =
          form.email_business?.trim() || generateFakeEmail();

        url = `${process.env.REACT_APP_API_URL}/users/register-business`;

        payload = {
          url,
          id: Date.now(),
          username: finalEmail.split("@")[0],
          email: finalEmail,
          companyName: form.companyName,
          taxId: form.taxId,
          businessEmail: finalEmail,
          address: {
            full_name: finalName,
            phone_number: form.phone_number_buiness,
            street: form.street,
            ward: form.ward,
            district: form.district,
            city: form.city,
            is_default: defaultAddress || false,
          },
          API: url,
        };
      }


      let list = [...shippingInfo];

      if (editingId) {
        list = list.map((item) =>
          item.id === editingId ? payload : item
        );
      } else {

        list.push(payload);
      }

      setShippingInfo(list);
      Cookies.set("shippingInfo", JSON.stringify(list), { expires: 7 });

      if (onUpdate) {
        onUpdate(payload);
      }

      setEditingId(null);
      resetForm();

      alert("Cập nhật thành công!");
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };

  useEffect(() => {

    const saved = Cookies.get("shippingInfo");

    if (saved) {
      try {
        setShippingInfo(JSON.parse(saved));
      } catch (err) {
        console.error("Không thể parse shippingInfo từ cookie:", err);
      }
    }
  }, []);
  const handleSetDefault = (id) => {
    // Đọc danh sách địa chỉ hiện có từ cookie
    let list = JSON.parse(Cookies.get('shippingInfo') || '[]');

    // Cập nhật: chỉ 1 địa chỉ có is_default = true
    const updatedList = list.map(item => ({
      ...item,
      address: {
        ...item.address,
        is_default: item.id === id
      }
    }));

    // Lưu lại cookie mới
    Cookies.set('shippingInfo', JSON.stringify(updatedList), { expires: 7 });

    // (Tùy chọn) Cập nhật lại state trong React nếu bạn có dùng
    setShippingInfo(updatedList);

  };
  const handleDelete = (id) => {
    setShippingInfo((prevList) => {
      // Xóa địa chỉ có id được chọn
      let updatedList = prevList.filter((item) => item.id !== id);

      // Kiểm tra xem có xóa địa chỉ mặc định không
      const deletedWasDefault = prevList.find((item) => item.id === id)?.address.is_default;

      // Nếu vừa xóa địa chỉ mặc định và còn phần tử khác trong danh sách
      if (deletedWasDefault && updatedList.length > 0) {
        // Chọn ngẫu nhiên 1 phần tử trong danh sách còn lại
        const randomIndex = Math.floor(Math.random() * updatedList.length);

        updatedList = updatedList.map((item, index) => ({
          ...item,
          address: {
            ...item.address,
            is_default: index === randomIndex, // chỉ 1 item ngẫu nhiên được chọn
          },
        }));
      }
      setShippingInfo(updatedList);
      // Nếu danh sách trống → không làm gì thêm
      Cookies.set("shippingInfo", JSON.stringify(updatedList), { expires: 7 });
      return updatedList;
    });

  };
  const onchangeAddress = (id) => {
    let list = JSON.parse(Cookies.get('shippingInfo') || '[]');
    const selectAddress = list.find(item => item.id === id);
    if (onUpdate) {
      onUpdate(selectAddress);
    }
  }
  const handleEditField = (id, field, value) => {
    setShippingInfo((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
            ...item,
            address: {
              ...item.address,
              [field]: value, // cập nhật field được chỉnh
            },
          }
          : item
      );
      const selectAddress = shippingInfo.find(item => item.id === id);
      if (onUpdate) {
        onUpdate(selectAddress);
      }
      Cookies.set("shippingInfo", JSON.stringify(updated), { expires: 7 });

      return updated;
    });
  };

  return (
    <div
      className="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Thông tin khách hàng
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="p-2 d-flex justify-content-center">
            <button className="btn btn-outline-success rounded-0 " type="button" data-bs-toggle="collapse" data-bs-target="#1760319218204" aria-expanded="false" aria-controls="collapseExample">
              Thêm địa chỉ mới
            </button>
          </div>
          <div className="collapse rounded-0" id="1760319218204">
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
  );
}

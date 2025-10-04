import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
export default function ModalInfo({ onUpdate }) {
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

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

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    const wardName = wards.find((w) => w.id === wardId)?.full_name || "";
    setForm({ ...form, ward: wardName });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = "";
      let payload = {};

      if (activeTab === "personal") {
        url = "https://kidoedu.vn/users/register-individual";
        payload = {
          username: form.email_personal.split("@")[0],
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
            is_default: true,
          },
          API: url,
        };
      } else if (activeTab === "business") {
        url = "https://kidoedu.vn/users/register-business";
        payload = {
          username: form.email_business.split("@")[0],
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
            is_default: true,
          },
          API: url,
        };
      }
      Cookies.set('shippingInfo', JSON.stringify(payload), { expires: 7 });
      if (onUpdate) {
        onUpdate(payload);
      }

      alert("Cập nhật thành công!");
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
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
                    className="w-full p-2 border rounded-xl"
                    required
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {citys.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.full_name}
                      </option>
                    ))}
                  </select>

                  {/* Select Quận/Huyện */}
                  <select
                    name="district"
                    onChange={handleDistrictChange}
                    className="w-full p-2 border rounded-xl"
                    required
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex flex-column gap-3 w-50">
                  {/* Select Phường/Xã */}
                  <select
                    name="ward"
                    onChange={handleWardChange}
                    className="w-full p-2 border rounded-xl"
                    required
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.full_name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="street"
                    placeholder="Số nhà, đường"
                    value={form.street}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-xl"
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

              <div class="tab-content" id="nav-tabContent">
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
                        required
                      />
                      <input
                        type="email"
                        name="email_personal"
                        placeholder="Email"
                        value={form.email_personal}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-xl"
                        required
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
                        required
                      />
                      <input
                        type="tel"
                        name="phone_number_personal"
                        placeholder="Số điện thoại"
                        value={form.phone_number_personal}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-xl"
                        required
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
                      required
                    />
                    <input
                      type="text"
                      name="taxId"
                      placeholder="Mã số thuế"
                      value={form.taxId}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-xl"
                      required
                    />
                    <input
                      type="text"
                      name="email_business"
                      placeholder="Email nhận hóa đơn"
                      value={form.email_business}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-xl"
                      required
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
                      required
                    />
                    <input
                      type="text"
                      name="phone_number_buiness"
                      placeholder="Số điện thoại người nhận hàng"
                      value={form.phone_number_buiness}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleSubmit}
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>


        </div>
      </div>
    </div>
  );
}

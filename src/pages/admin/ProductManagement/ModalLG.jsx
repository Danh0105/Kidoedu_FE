import React, { useState } from 'react';
import Category from './Category';
import Image from './Image';
import RichTextEditor from '../../../components/admin/RichTextEditor';
import axios from 'axios';
import ReactQuill from 'react-quill-new';

export default function ModalLG({ onProductAdded }) {
    const [categoryId, setCategoryId] = useState(null);
    const [count, setCount] = useState(1);
    const [shortDesc, setShortDesc] = useState("");
    const [userManual, setuserManual] = useState("");
    const [cautionNotes, setcautionNotes] = useState("");
    const [origin, setOrigin] = useState("");
    const [specs, setSpecs] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const [nameproduct, setNameproduct] = useState("");
    const [price, setPrice] = useState(0);
    const [status, setstatus] = useState("");
    const [files, setFiles] = useState([]);

    const stripHtml = (html) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };
    const handlestatus = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;

        setstatus((prev) => {
            let arr = prev.split("").filter(Boolean);

            if (checked) {
                if (!arr.includes(value)) arr.push(value);
            } else {
                arr = arr.filter((v) => v !== value);
            }

            return arr.sort().join("");
        });
    }

    const handleImageChange = (fd) => {
        setFiles(fd); // Lưu FormData
    };
    const handleImageRemove = (removedFile, idx) => {
        // bỏ file đã xóa khỏi state
        setFiles((prev) => prev.filter((f, i) => i !== idx));
        console.log("File đã xóa:", removedFile);
    };
    const handleSubmit = async () => {
        try {
            const CLOUD_NAME = "dlnkeb4dm";
            const UPLOAD_PRESET = "kidoedu";

            let uploadedUrls = [];

            for (let file of files) {
                const fd = new FormData();
                fd.append("file", file);
                fd.append("upload_preset", UPLOAD_PRESET);

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    {
                        method: "POST",
                        body: fd,
                    }
                );

                const data = await res.json();


                if (data.secure_url) {
                    uploadedUrls.push(data.secure_url);
                }
            }


            const dto = {
                productName: nameproduct?.trim() || "",
                sku: `SKU-${Date.now()}`,
                shortDescription: stripHtml(shortDesc) || null,
                longDescription: longDesc || null,
                specs: specs || null,
                userManual: userManual || null,
                cautionNotes: cautionNotes || null,
                origin: origin || null,
                status: status ? Number(status) : 4,
                price: Number(price) || 0,
                stock_quantity: Number(count) || 1,
                category_id: categoryId ? Number(categoryId) : null,
                images: uploadedUrls.map((url) => ({
                    image_url: url,
                })),
            };

            console.log("DTO gửi đến backend:", dto);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/products`, dto);
            if (onProductAdded) {
                console.log("Sản phẩm mới:", res.data.data);
                onProductAdded(res.data.data);
            }
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err);
            alert("Thêm sản phẩm thất bại!");
        }
    };


    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Sản phẩm mới</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container text-center">
                            <div className="row">
                                <div className="col-8">
                                    <div className="text-start">
                                        <div className="">Tên sản phẩm</div>
                                        <input onChange={(e) => setNameproduct(e.target.value)} type="text" className="form-control" />
                                    </div>
                                    <div className="text-start">
                                        <div>Mô tả dài</div>
                                        <ReactQuill
                                            placeholder="Mô tả dài"
                                            value={longDesc}
                                            onChange={setLongDesc}
                                        />

                                        <style>
                                            {`
                                            .ql-editor {
                                                line-height: 1.5em;
                                                max-height: 20em;   /* ~4 dòng */
                                                overflow-y: auto;  /* hiện thanh cuộn khi vượt quá */
                                            }
                                            `}
                                        </style>
                                    </div>

                                    <div className="text-start">
                                        <div>Mô tả ngắn</div>
                                        <RichTextEditor
                                            placeholder="Mô tả ngắn"
                                            value={shortDesc}
                                            onChange={(val) => setShortDesc(val)}
                                        />
                                    </div>
                                    <div className="text-start">
                                        <div>Thông số kĩ thuật</div>
                                        <RichTextEditor
                                            placeholder="Thông số kĩ thuật"
                                            value={specs}
                                            onChange={(val) => setSpecs(val)}
                                        />
                                    </div>
                                    <div className="text-start">
                                        <div>Hướng dẫn sử dụng</div>
                                        <RichTextEditor
                                            placeholder="Thông số kĩ thuật"
                                            value={specs}
                                            onChange={(val) => setuserManual(val)}
                                        />
                                    </div>
                                    <div className="text-start">
                                        <div>Lưu ý an toàn / cảnh báo khi dùng.</div>
                                        <RichTextEditor
                                            placeholder="Thông số kĩ thuật"
                                            value={specs}
                                            onChange={(val) => setcautionNotes(val)}
                                        />
                                    </div>
                                    <div className="text-start">
                                        <div className="">Dữ liệu sản phẩm</div>

                                        <div className="d-flex align-items-start border border-2" >
                                            <div style={{ fontSize: "15px" }}
                                                class="nav flex-column nav-pills border-end w-25  border-end-2"
                                                id="v-pills-tab" role="tablist"
                                                aria-orientation="vertical"
                                            >

                                                <button className="text-start nav-link rounded-0 active"
                                                    id="v-pills-home-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#v-pills-home"
                                                    type="button" role="tab"
                                                    aria-controls="v-pills-home"
                                                    aria-selected="true">
                                                    Tổng quan
                                                </button>

                                                <button className="text-start nav-link rounded-0"
                                                    id="v-pills-profile-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#v-pills-profile"
                                                    type="button" role="tab"
                                                    aria-controls="v-pills-profile"
                                                    aria-selected="false">
                                                    Kiểm kê kho hàng
                                                </button>

                                                <button className="text-start nav-link rounded-0"
                                                    id="v-pills-messages-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#v-pills-messages"
                                                    type="button" role="tab"
                                                    aria-controls="v-pills-messages"
                                                    aria-selected="false">
                                                    Giao hàng
                                                </button>

                                                <button className="text-start nav-link rounded-0"
                                                    id="v-pills-settings-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#v-pills-settings"
                                                    type="button" role="tab"
                                                    aria-controls="v-pills-settings"
                                                    aria-selected="false">
                                                    Các thuộc tính
                                                </button>

                                                <button className="text-start nav-link rounded-0"
                                                    id="v-pills-advanced-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#v-pills-advanced"
                                                    type="button" role="tab"
                                                    aria-controls="v-pills-advanced"
                                                    aria-selected="false">
                                                    Nâng cao
                                                </button>
                                            </div>

                                            <div className="tab-content  w-75 p-2" id="v-pills-tabContent" >
                                                {/* Tổng quan */}
                                                <div className="tab-pane fade active show h-100 p-2" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-4">
                                                        <div className="d-flex w-100 align-items-center mb-1">
                                                            <span className="w-25" style={{ fontSize: "15px" }}>Giá bán(₫)</span>
                                                            <input onChange={(e) => setPrice(e.target.value)} type="text" className="form-control w-75" placeholder="" />
                                                        </div>
                                                        <div className="d-flex w-100 align-items-center mb-1">
                                                            <span className="w-25" style={{ fontSize: "15px" }}>Xuất sứ</span>
                                                            <input onChange={(e) => setOrigin(e.target.value)} type="text" className="form-control w-75" placeholder="" />
                                                        </div>
                                                        <div className="d-flex w-100 align-items-center mb-2">
                                                            <span style={{ fontSize: "15px", width: "140px" }}>Số lượng</span>
                                                            <div className="form-check">
                                                                <div className='d-flex align-items-center justify-content-center'>
                                                                    <button
                                                                        style={{ width: '50px', height: "32px" }}
                                                                        className="btn border-0 rounded-0 btn-outline-secondary  d-flex align-items-center justify-content-center"
                                                                        onClick={() => setCount(count > 1 ? count - 1 : 1)}
                                                                    >
                                                                        -
                                                                    </button>

                                                                    <input
                                                                        type="number"
                                                                        className="form-control text-center rounded-0 border-0 "
                                                                        value={count}
                                                                        min={1}
                                                                        style={{
                                                                            width: '50px',
                                                                            height: "32px",
                                                                        }}
                                                                        onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
                                                                    />
                                                                    <button
                                                                        style={{ width: '50px', height: "32px" }}
                                                                        className="btn border-0 rounded-0 btn-outline-secondary  d-flex align-items-center justify-content-center"
                                                                        onClick={() => setCount(count + 1)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex w-100 align-items-center mb-2">
                                                            <span style={{ fontSize: "15px", width: "140px" }}>Tác vụ</span>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value="1"
                                                                    id="check1"
                                                                    onChange={handlestatus}
                                                                    checked={status.includes("1")}
                                                                />
                                                                <label className="form-check-label" htmlFor="check1">
                                                                    Mới
                                                                </label>
                                                            </div>

                                                            <div className="form-check ms-3">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value="2"
                                                                    id="check2"
                                                                    onChange={handlestatus}
                                                                    checked={status.includes("2")}
                                                                />
                                                                <label className="form-check-label" htmlFor="check2">
                                                                    Nổi bật
                                                                </label>
                                                            </div>

                                                            <div className="form-check ms-3">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    value="3"
                                                                    id="check3"
                                                                    onChange={handlestatus}
                                                                    checked={status.includes("3")}
                                                                />
                                                                <label className="form-check-label" htmlFor="check3">
                                                                    Hiển thị
                                                                </label>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Kiểm kê kho hàng */}
                                                <div className="tab-pane fade h-100 p-2" id="v-pills-profile" role="tabpanel">


                                                    {/* <div class="d-flex w-100 align-items-center mb-2">
                                                        <span style={{ fontSize: "15px", width: "140px" }}>Người kiểm kê</span>
                                                        <input type="text" class="form-control w-75 h-50" placeholder="" />
                                                    </div>
                                                    <div class="d-flex w-100 align-items-center">
                                                        <span style={{ fontSize: "15px", width: "140px" }}>Ghi chú</span>
                                                        <textarea class="form-control w-75 h-50" aria-label="With textarea"></textarea>

                                                    </div> */}

                                                </div>
                                                {/* Giao hàng */}
                                                <div className="tab-pane fade h-100" id="v-pills-messages" role="tabpanel"></div>
                                                {/* Thuộc tính sản phẩm */}
                                                <div className="tab-pane fade h-100" id="v-pills-settings" role="tabpanel">
                                                    <div className='bg-light border-start border-danger border-5'>
                                                        <p className='mx-2'>Thêm các thông tin mô tả mà khách hàng có thể sử dụng để tìm kiếm sản phẩm này trên cửa hàng của bạn, chẳng hạn như “Chất liệu” hoặc “Kích thước”.</p>

                                                    </div>
                                                    <div>
                                                        <button className='btn btn-outline-primary mb-2 mt-2'> Thêm mới</button>
                                                    </div>
                                                    <div className='d-flex flex-column gap-2'>
                                                        <div class="d-flex  align-items-center mb-2">
                                                            <span style={{ fontSize: "15px", width: "100px" }}>Tên: </span>

                                                            <input type="text" class="form-control" placeholder="Ví dụ: chiều dài hoặc trọng lượng" />
                                                        </div>
                                                        <div class="d-flex  align-items-center">
                                                            <span style={{ fontSize: "15px", width: "100px" }}>Giá trị (s)</span>

                                                            <textarea class="form-control " placeholder='Nhập một số văn bản mô tả. Sử dụng "|" để phân tách các giá trị khác nhau ' aria-label="With textarea"></textarea>

                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button className='btn btn-outline-primary mb-2 mt-2'>Lưu thuộc tính</button>
                                                    </div>
                                                </div>
                                                <div className="tab-pane fade h-100" id="v-pills-advanced" role="tabpanel"></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-4">
                                    <Image onChange={handleImageChange} onRemove={handleImageRemove} />
                                    <Category onChange={setCategoryId} />
                                    <div className='d-flex flex-start mt-2 mb-2'> <span >Thẻ sản phẩm </span></div>
                                    <div className='d-flex justify-content-center p-2 border-2 border gap-2 w-100'>

                                        <input type="text" className="form-control " placeholder="Phân cách các thẻ bằng dấu ," />


                                        <button className='btn btn-outline-primary w-25'>
                                            Thêm
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// import React, { useState } from "react";
// import axios from "axios";
import '../../App.css';
import CDS from '../../assets/user/CDS.png'
import STEM from '../../assets/user/STEM.png'
import ROBOT from '../../assets/user/ROBOT.png'
import DIENLANH from '../../assets/user/DIENLANH.png'
import MAYTINH from '../../assets/user/MAYTINH.png'
import DCHT from '../../assets/user/DCHT.png'
import Carousel from '../../components/user/Carousel';

export default function Home() {

    // const [previewUrl, setPreviewUrl] = useState("");
    // const [uploading, setUploading] = useState(false);

    // const handleUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file || !file.name.endsWith(".zip")) {
    //         alert("Vui lòng chọn file .zip");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append("zipfile", file);

    //     setUploading(true);
    //     try {
    //         const res = await axios.post("http://localhost:5000/upload", formData);
    //         console.log(res);
    //         setPreviewUrl(res.data.url);
    //     } catch (err) {
    //         alert("Tải lên thất bại: " + err.message);
    //     } finally {
    //         setUploading(false);
    //     }
    // };

    return (
        <div>
            <Carousel />
            <div className='container' >
                <div className="flex flex-col justify-center items-center" >
                    <div >
                        <h2 style={{ marginLeft: "0px", textAlign: "center" }}>
                            <span style={{ fontSize: "35px" }}>
                                <strong>Ai cũng có thể trở thành </strong>
                            </span>
                            <span style={{ color: "hsl(0,75%,60%)", fontSize: "35px" }}>
                                <strong>người đặc biệt</strong>
                            </span>
                        </h2>
                        <p style={{ marginLeft: "0px", textAlign: "center" }}>
                            <span style={{ fontSize: "21px" }}>Và </span>
                            <span style={{ color: "hsl(0,75%,60%)", fontSize: "21px" }}>bạn</span>
                            <span style={{ fontSize: "21px" }}>
                                {" "}cũng có thể là người tiếp theo
                            </span>
                        </p>
                        <p>&nbsp;</p>
                    </div>
                </div>
                <div className='mb-2'>
                    <p style={{
                        fontFamily: '"Barlow", Sans-serif',
                        fontSize: "48px",
                        fontWeight: 700
                    }}
                    >Sản phẩm</p>
                    <div class="row">
                        <div class="col">
                            <a href='/'>
                                <img className='img-fluid' style={{ width: "300px", height: "250px" }} src={ROBOT} alt="Logo ROBOT" />
                            </a>
                        </div>
                        <div class="col">
                            <a href='/'>
                                <img className='img-fluid' style={{ width: "300px", height: "250px" }} src={DIENLANH} alt="Logo DIENLANH" />
                            </a>
                        </div>
                        <div class="col">
                            <a href='/'>
                                <img className='img-fluid' style={{ width: "300px", height: "250px" }} src={MAYTINH} alt="Logo MAYTINH" />
                            </a>
                        </div>
                        <div class="col">
                            <a href='/'>
                                <img className='img-fluid' style={{ width: "300px", height: "250px" }} src={DCHT} alt="Logo DCHT" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className='mb-2'>
                    <p style={{
                        fontFamily: '"Barlow", Sans-serif',
                        fontSize: "48px",
                        fontWeight: 700
                    }}
                    >Khóa học</p>
                    <div class="row">
                        <div class="col">
                            <div className='mt-2 mb-2'>
                                <img className='img-fluid' style={{ width: "350px", height: "300px" }} src={CDS} alt="Logo công dân số" />
                            </div>


                        </div>
                        <div class="col">
                            <div className='mt-2 mb-2'>
                                <img className='img-fluid' style={{ width: "350px", height: "300px" }} src={STEM} alt="Logo STEM" />
                            </div>
                        </div>
                        <div class="col">
                            <div className='mt-2 mb-2'>
                                <img className='img-fluid' style={{ width: "350px", height: "300px" }} src={ROBOT} alt="Logo ROBOT" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >

        // <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        //     <h2>🗂️ Tải và hiển thị file .zip xuất từ Storyline</h2>
        //     <input type="file" accept=".zip" onChange={handleUpload} />
        //     {uploading && <p>⏳ Đang tải lên...</p>}
        //     {
        //         previewUrl && (
        //             <>
        //                 <h3 style={{ marginTop: 20 }}>🖥️ Kết quả hiển thị:</h3>
        //                 <iframe
        //                     src={previewUrl}
        //                     style={{ width: "100%", height: "85vh", border: "1px solid #ccc" }}
        //                     title="Storyline Web"
        //                 />
        //             </>
        //         )
        //     }
        // </div >
    );
}

// import React, { useState } from "react";
// import axios from "axios";
import '../../App.css';
import intro from '../../assets/user/intro.jpg';
import gv from '../../assets/user/gv.png';
import cup from '../../assets/user/cup.png';
import hc from '../../assets/user/hc.png';
import vs from '../../assets/user/vs.png';
import HDKH1 from '../../assets/user/HDKH1.jpg';
import HDKH2 from '../../assets/user/HDKH2.jpg';
import HDKH3 from '../../assets/user/HDKH3.jpg';
import HDKH4 from '../../assets/user/HDKH4.jpg';
import Carousel from '../../components/user/Carousel';

export default function About() {

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
            <div className='container'>
                <div className="d-flex justify-content-center">
                    <div className="p-2 bd-highlight intro" style={{ width: "570px" }}>
                        <h2 classNameName='mb-4 pt-2'>GIỚI THIỆU VỀ GENTECH </h2>
                        <div className="des-about">ICHI SKILL có tên đầy đủ là: CÔNG TY CỔ PHẦN GIÁO DỤC KHOA HỌC CÔNG NGHỆ&nbsp; ICHI SKILL được thành lập vào ngày 28/12/2020. Mã số thuế: 0316660845
                            Công ty chuyên về lĩnh vực giáo dục kỹ năng sống - Công dân số - STEM cho học sinh  từ cấp học mầm non, tiểu học, THCS và THPT.
                            ICHI SKILL đang bước những bước đầu tiên thật vững chắc với đội ngũ chuyên gia nhiều kinh nghiệm, tự tin mang lại chương trình giáo dục tiên tiến cho thế hệ trẻ về hành trang kỹ năng sống, đầy đủ để xây dựng ước mơ cho cuộc đời mình.</div>
                        <a>XEM THÊM</a>
                    </div>
                    <div className="p-2 bd-highlight">
                        <img src={intro} style={{ width: "550px", height: "auto" }} alt="Logo công ty Gentech" />
                    </div>
                </div>
            </div>
            <div className='bg-warning'>
                <div className='container'>
                    <div className='d-flex justify-content-center'>
                        <h2>Vì sao chọn GENTECH</h2>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <div className='p-2 bd-highlight intro'>
                            <div className='d-flex justify-content-center' style={{ width: "570px" }}>
                                <div className='p-2 bd-highlight intro'>
                                    <img src={gv} style={{ width: "50px", height: "auto" }} alt="Logo công ty Gentech" />
                                </div>
                                <div className='p-2 bd-highlight intro'>
                                    <div >
                                        <h2>Đội ngũ giáo viên chất lượng</h2>
                                        <div >Học sinh của chúng tôi sẽ được hướng dẫn bởi những giáo viên năng động, sáng tạo, được đào tạo bài bản về giáo dục kỹ năng sống cho trẻ.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='p-2 bd-highlight intro'>
                            <div className='d-flex justify-content-center' style={{ width: "570px" }}>
                                <div className='p-2 bd-highlight intro'>
                                    <img src={cup} style={{ width: "50px", height: "auto" }} alt="Logo công ty Gentech" />
                                </div>
                                <div className='p-2 bd-highlight intro'>
                                    <div>
                                        <h2>Phương pháp giảng dạy chuẩn</h2>
                                        <div >Ichi Skill chú trọng phương pháp học tập tương tác để giúp các em học sinh thực hành, phát huy tối đa tiềm năng của bản thân.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <div className='p-2 bd-highlight intro'>
                            <div className='d-flex justify-content-center' style={{ width: "570px" }}>
                                <div className='p-2 bd-highlight intro'>
                                    <img src={hc} style={{ width: "50px", height: "auto" }} alt="Logo công ty Gentech" />
                                </div>
                                <div className='p-2 bd-highlight intro'>
                                    <div >
                                        <h2>Môi trường học tập tốt</h2>
                                        <div>Ichi Skill trang bị cho các em học sinh đầy đủ kiến thức, kỹ năng, năng động, sáng tạo và có năng lực nền tảng vững chắc cho tương lai.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='p-2 bd-highlight intro'>
                            <div className='d-flex justify-content-center' style={{ width: "570px" }}>
                                <div className='p-2 bd-highlight intro'>
                                    <img src={vs} style={{ width: "50px", height: "auto" }} alt="Logo công ty Gentech" />
                                </div>
                                <div className='p-2 bd-highlight intro'>
                                    <div>
                                        <h2>Giáo trình độc quyền</h2>
                                        <div class="des-tsc">ICHI SKILL đã xây dựng chương trình giáo dục Kỹ năng sống cho học sinh trên nền tảng phần mềm đạt tiêu chuẩn quốc tế với đầy đủ, video, hình ảnh, âm thanh,…sống động và hấp dẫn.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <div class="bd-highlight p-1">
                    <img src={HDKH1} style={{ width: "auto", height: "580px" }} alt="Logo công ty Gentech" />
                </div>
                <div className="bd-highlight p-1">
                    <div
                        className="d-flex flex-column justify-content-between align-items-center"
                        style={{ height: "580px" }}
                    >
                        <div className="bd-highlight">
                            <img
                                src={HDKH2}
                                style={{ width: "395px", height: "auto" }}
                                alt="Logo công ty Gentech"
                            />
                        </div>
                        <div className="bd-highlight">
                            <img
                                src={HDKH3}
                                style={{ width: "395px", height: "auto" }}
                                alt="Logo công ty Gentech"
                            />
                        </div>
                    </div>
                </div>

                <div class="bd-highlight p-1">
                    <img src={HDKH4} style={{ width: "auto", height: "580px" }} alt="Logo công ty Gentech" />
                </div>
            </div>
        </div>

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

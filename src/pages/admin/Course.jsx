import React, { useState } from "react";
import axios from "axios";

export default function Home() {
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.name.endsWith(".zip")) {
            alert("Vui lòng chọn file .zip");
            return;
        }

        const formData = new FormData();
        formData.append("zipfile", file);

        setUploading(true);
        try {
            const res = await axios.post("http://localhost:5000/upload", formData);
            console.log(res);
            setPreviewUrl(res.data.url);
        } catch (err) {
            alert("Tải lên thất bại: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>🗂️ Tải và hiển thị file .zip xuất từ Storyline</h2>
            <input type="file" accept=".zip" onChange={handleUpload} />
            {uploading && <p>⏳ Đang tải lên...</p>}
            {
                previewUrl && (
                    <>
                        <h3 style={{ marginTop: 20 }}>🖥️ Kết quả hiển thị:</h3>
                        <iframe
                            src={previewUrl}
                            style={{ width: "100%", height: "85vh", border: "1px solid #ccc" }}
                            title="Storyline Web"
                        />
                    </>
                )
            }
        </div >
    );
}

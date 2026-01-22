import { useEffect, useRef, useState } from "react";

export default function CheckinPage() {
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");
    const [participant, setParticipant] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [preview, setPreview] = useState(null); // ảnh preview (blob URL)
    const [imageBlob, setImageBlob] = useState(null);
    const [uploading, setUploading] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    /* =========================
       1. CHECK-IN BẰNG QR
    ========================== */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
            setStatus("error");
            setMessage("QR không hợp lệ");
            return;
        }

        fetch("http://localhost:3000/participants/checkin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qrCode: code }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setParticipant(data);
                setStatus("success");
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.message);
            });
    }, []);

    /* =========================
       2. MỞ CAMERA
    ========================== */
    useEffect(() => {
        if (status !== "success") return;

        startCamera();

        return () => {
            streamRef.current?.getTracks().forEach(t => t.stop());
        };
    }, [status]);


    /* =========================
       3. CHỤP ẢNH (CHỈ PREVIEW)
    ========================== */
    const capture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !cameraReady) {
            alert("Camera chưa sẵn sàng");
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (canvas.width === 0 || canvas.height === 0) {
            alert("Không chụp được ảnh, thử lại");
            return;
        }

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) {
                alert("Không tạo được ảnh, vui lòng chụp lại");
                return;
            }

            const url = URL.createObjectURL(blob);
            setPreview(url);
            setImageBlob(blob);
        }, "image/jpeg", 0.9);
    };

    const retake = async () => {
        setPreview(null);
        setImageBlob(null);
        setCameraReady(false);

        await startCamera(); // 🔥 BẬT LẠI CAMERA
    };

    /* =========================
       4. UPLOAD SAU KHI XÁC NHẬN
    ========================== */
    const uploadImage = async () => {
        if (!imageBlob) return;

        setUploading(true);
        try {
            const form = new FormData();
            form.append("file", imageBlob, "checkin.jpg");

            const res = await fetch(
                `http://localhost:3000/participants/checkin/avatar/${participant.id}`,
                {
                    method: "POST",
                    body: form,
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setParticipant((p) => ({
                ...p,
                avatar: data.avatar,
            }));

            // clear preview
            setPreview(null);
            setImageBlob(null);
        } catch {
            alert("Upload ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    /* =========================
       UI
    ========================== */
    if (status === "loading") {
        return <h3 style={{ textAlign: "center" }}>⏳ Đang check-in...</h3>;
    }

    if (status === "error") {
        return (
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <h3 style={{ color: "red" }}>❌ Check-in thất bại</h3>
                <p>{message}</p>
            </div>
        );
    }
    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
    };

    return (
        <div style={{ textAlign: "center", marginTop: 30 }}>
            <h3 style={{ color: "green" }}>✅ Check-in thành công</h3>

            <p>
                Xin chào <b>{participant.fullName}</b>
            </p>

            {/* CAMERA */}
            {!preview && (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        onLoadedMetadata={() => setCameraReady(true)}
                        style={{
                            width: 280,
                            borderRadius: 10,
                            border: "2px solid #ccc",
                        }}
                    />


                    <canvas ref={canvasRef} hidden />
                    <br />
                    <button
                        onClick={capture}
                        disabled={!cameraReady}
                        style={{ marginTop: 10, padding: "10px 20px" }}
                    >
                        📸 Chụp ảnh
                    </button>

                </>
            )}

            {/* PREVIEW */}
            {preview && (
                <div style={{ marginTop: 15 }}>
                    <img
                        src={preview}
                        width={200}
                        style={{
                            borderRadius: 10,
                            border: "2px solid #4caf50",
                        }}
                    />

                    <div style={{ marginTop: 10 }}>
                        <button
                            onClick={uploadImage}
                            disabled={uploading}
                            style={{
                                marginRight: 10,
                                padding: "8px 16px",
                            }}
                        >
                            {uploading ? "⏳ Đang upload..." : "✅ Xác nhận"}
                        </button>
                        <button
                            onClick={retake}
                            style={{ padding: "8px 16px" }}
                        >
                            🔄 Chụp lại
                        </button>

                    </div>
                </div>
            )}


        </div>
    );
}

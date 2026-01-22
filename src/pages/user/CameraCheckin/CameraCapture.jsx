import { useEffect, useRef, useState } from "react";

export default function CameraCapture({ participantId, onUploaded }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((s) => {
                setStream(s);
                videoRef.current.srcObject = s;
            });

        return () => {
            stream?.getTracks().forEach(t => t.stop());
        };
    }, []);

    const capture = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
            const form = new FormData();
            form.append("file", blob, "checkin.jpg");

            const res = await fetch(
                `http://localhost:3000/participants/checkin/avatar/${participantId}`,
                {
                    method: "POST",
                    body: form,
                }
            );

            const data = await res.json();
            onUploaded(data.avatar);
        }, "image/jpeg");
    };

    return (
        <div style={{ textAlign: "center" }}>
            <video ref={videoRef} autoPlay playsInline width={300} />
            <canvas ref={canvasRef} hidden />
            <br />
            <button onClick={capture}>📸 Chụp & lưu ảnh</button>
        </div>
    );
}

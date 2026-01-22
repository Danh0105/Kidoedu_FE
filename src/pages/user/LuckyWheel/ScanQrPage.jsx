import { useState } from "react";
import QrScanner from "../../../components/user/LuckyWheel/QrScanner";

export default function ScanQrPage() {
    const [result, setResult] = useState("");

    return (
        <div className="container mt-3">
            <h4>Quét mã QR</h4>

            <QrScanner
                onResult={(text) => {
                    setResult(text);
                    console.log("QR:", text);
                }}
            />

            {result && (
                <div className="alert alert-success mt-3">
                    <b>Kết quả:</b> {result}
                </div>
            )}
        </div>
    );
}

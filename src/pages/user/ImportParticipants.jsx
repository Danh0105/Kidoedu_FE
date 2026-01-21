import { useState } from "react";

export default function ImportParticipants() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleUpload = async () => {
        if (!file) {
            setError("Vui lòng chọn file Excel");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(
                "http://localhost:3000/participants/import-file",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Upload thất bại");
            }

            const data = await res.json();
            setResult(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h4>Import khách mời từ Excel</h4>

            <input
                type="file"
                accept=".xlsx,.xls"
                className="form-control mt-3"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button
                className="btn btn-primary mt-3"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Đang import..." : "Upload"}
            </button>

            {error && (
                <div className="alert alert-danger mt-3">{error}</div>
            )}

            {result && (
                <div className="alert alert-success mt-3">
                    <p><b>Import thành công:</b> {result.imported}</p>
                    <p><b>Còn lại:</b> {result.remaining?.length}</p>
                </div>
            )}
        </div>
    );
}

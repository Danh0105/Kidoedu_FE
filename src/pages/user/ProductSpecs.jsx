// ---- ProductSpecs.jsx (có thể đặt chung file cho nhanh) ----
import React, { useMemo } from "react";

/**
 * Nhận vào:
 *  - specs: có thể là object, array, hoặc HTML string (ol/li từ editor)
 * Trả về UI 2 cột theo nhóm (mục nào <strong>... </strong> xem như header nhóm).
 */
export function ProductSpecs({ specs }) {
    const sections = useMemo(() => {
        // 1) Nếu là object {key: value}
        if (specs && typeof specs === "object" && !Array.isArray(specs)) {
            return [
                {
                    title: "Thông số kỹ thuật",
                    rows: Object.entries(specs).map(([k, v]) => ({
                        label: k,
                        value: typeof v === "string" ? v : JSON.stringify(v),
                    })),
                },
            ];
        }

        // 2) Nếu là array [{label, value}] hoặc ["k","v","k2","v2",...]
        if (Array.isArray(specs)) {
            if (specs.length && typeof specs[0] === "object") {
                return [
                    {
                        title: "Thông số kỹ thuật",
                        rows: specs.map((r, i) => ({
                            label: String(r.label ?? r.key ?? `Mục ${i + 1}`),
                            value: String(r.value ?? ""),
                        })),
                    },
                ];
            } else {
                // Là mảng chuỗi, ghép cặp 2-2
                const rows = [];
                for (let i = 0; i < specs.length; i += 2) {
                    rows.push({ label: String(specs[i] ?? ""), value: String(specs[i + 1] ?? "") });
                }
                return [{ title: "Thông số kỹ thuật", rows }];
            }
        }

        // 3) Nếu là HTML string (ol/li) từ WYSIWYG
        if (typeof specs === "string") {
            try {
                const doc = new DOMParser().parseFromString(specs, "text/html");
                const liNodes = Array.from(doc.querySelectorAll("li"));
                const out = [];
                let current = null;
                let buffer = [];

                const flushPairsToCurrent = () => {
                    for (let i = 0; i < buffer.length; i += 2) {
                        const label = (buffer[i] ?? "").trim();
                        const value = (buffer[i + 1] ?? "").trim();
                        if (label) current.rows.push({ label, value });
                    }
                    buffer = [];
                };

                liNodes.forEach((li, idx) => {
                    const hasStrong = !!li.querySelector("strong, b");
                    const text = li.textContent?.trim() ?? "";

                    if (hasStrong) {
                        // gặp header mới => đẩy nhóm cũ
                        if (current) {
                            flushPairsToCurrent();
                            out.push(current);
                        }
                        current = { title: text.replace(/^\d+\.\s*/, ""), rows: [] };
                    } else {
                        // dồn vào buffer để ghép 2-2
                        buffer.push(text);
                    }

                    // cuối danh sách => flush
                    if (idx === liNodes.length - 1) {
                        if (!current) current = { title: "Thông số kỹ thuật", rows: [] };
                        flushPairsToCurrent();
                        out.push(current);
                    }
                });

                // fallback khi không có <strong>
                if (!out.length) {
                    const plain = (doc.body.textContent || "").split(/\n+/).map(s => s.trim()).filter(Boolean);
                    const rows = [];
                    for (let i = 0; i < plain.length; i += 2) {
                        rows.push({ label: plain[i], value: plain[i + 1] ?? "" });
                    }
                    return [{ title: "Thông số kỹ thuật", rows }];
                }

                return out;
            } catch {
                // Không parse được -> hiển thị HTML thô
                return [{ title: "Thông số kỹ thuật", rawHtml: specs, rows: [] }];
            }
        }

        return [];
    }, [specs]);

    if (!sections.length) {
        return <p className="text-muted m-0">Chưa có thông số kỹ thuật.</p>;
    }

    return (
        <div className="vstack gap-3">
            {sections.map((sec, i) => (
                <div key={i} className="spec-card border rounded-3 shadow-sm">
                    <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom bg-light">
                        <span className="spec-dot" aria-hidden="true" />
                        <h6 className="mb-0">{sec.title || "Thông số"}</h6>
                    </div>

                    {sec.rawHtml ? (
                        <div className="p-3" dangerouslySetInnerHTML={{ __html: sec.rawHtml }} />
                    ) : sec.rows?.length ? (
                        <div className="p-2">
                            <div className="row row-cols-1 row-cols-md-2 g-2">
                                {sec.rows.map((r, idx) => (
                                    <div key={idx} className="col">
                                        <div className="d-flex justify-content-between align-items-start spec-row p-2 rounded-2">
                                            <div className="text-secondary small me-3">{r.label}</div>
                                            <div className="fw-semibold text-wrap text-end">
                                                {r.value || <span className="text-muted">—</span>}
                                                {r.value && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link btn-sm text-decoration-none ms-2 p-0"
                                                        title="Sao chép"
                                                        onClick={() => navigator.clipboard.writeText(r.value)}
                                                    >
                                                        <i className="bi bi-clipboard-check" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted px-3 py-2 mb-0">Chưa có dữ liệu.</p>
                    )}
                </div>
            ))}

            {/* Hành động nhanh */}
            <div className="d-flex gap-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => window.print()}
                >
                    <i className="bi bi-printer me-1" /> In / PDF
                </button>
            </div>
        </div>
    );
}

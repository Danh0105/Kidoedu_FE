import React, { useMemo } from "react";

/**
 * ProductSpecs
 * - specs: object | array | html string
 */
export function ProductSpecs({ specs }) {
    const sections = useMemo(() => {
        // helper: pretty value
        const formatValue = (v) => {
            if (v == null) return "";
            if (Array.isArray(v)) return v.map((x) => String(x)).join(", ");
            if (typeof v === "object") {
                try {
                    const s = JSON.stringify(v, null, 2);
                    // truncate long JSON for UI clarity
                    return s.length > 400 ? s.slice(0, 400) + "… (truncated)" : s;
                } catch {
                    return String(v);
                }
            }
            return String(v);
        };

        // 1) Object {k: v}
        if (specs && typeof specs === "object" && !Array.isArray(specs)) {
            const rows = Object.entries(specs)
                .map(([k, v]) => ({ label: String(k).trim(), value: formatValue(v) }))
                .filter((r) => r.label); // drop empty labels
            return [{ title: "Thông số kỹ thuật", rows }];
        }

        // 2) Array
        if (Array.isArray(specs)) {
            if (specs.length && typeof specs[0] === "object") {
                const rows = specs.map((r, i) => ({
                    label: String(r.label ?? r.key ?? `Mục ${i + 1}`).trim(),
                    value: formatValue(r.value ?? r.val ?? ""),
                })).filter(r => r.label);
                return [{ title: "Thông số kỹ thuật", rows }];
            } else {
                // mảng chuỗi: ghép cặp
                const rows = [];
                for (let i = 0; i < specs.length; i += 2) {
                    const label = String(specs[i] ?? "").trim();
                    const value = formatValue(specs[i + 1] ?? "");
                    if (label) rows.push({ label, value });
                }
                return [{ title: "Thông số kỹ thuật", rows }];
            }
        }

        // 3) HTML string (li/ol). Guard DOMParser for SSR.
        if (typeof specs === "string") {
            try {
                if (typeof DOMParser === "undefined") {
                    // SSR/Node: fallback simple parsing
                    const lines = specs.replace(/<[^>]+>/g, " ").split(/\n+/).map(s => s.trim()).filter(Boolean);
                    const rows = [];
                    for (let i = 0; i < lines.length; i += 2) {
                        const label = lines[i], value = lines[i + 1] ?? "";
                        if (label) rows.push({ label, value });
                    }
                    return [{ title: "Thông số kỹ thuật", rows }];
                }

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
                    const hasHeader =
                        !!li.querySelector("strong, b, h1, h2, h3, h4, h5, h6") ||
                        /\b(header|title)\b/i.test(li.className || "");

                    const text = li.textContent?.trim() ?? "";

                    if (hasHeader) {
                        if (current) {
                            flushPairsToCurrent();
                            out.push(current);
                        }
                        // header text: remove leading numbers "1. "
                        const headerText = text.replace(/^\d+\.\s*/, "");
                        current = { title: headerText || "Thông số", rows: [] };
                    } else {
                        // push into buffer
                        buffer.push(text);
                    }

                    if (idx === liNodes.length - 1) {
                        if (!current) current = { title: "Thông số kỹ thuật", rows: [] };
                        flushPairsToCurrent();
                        out.push(current);
                    }
                });

                // fallback: parse plain text when no liNodes or out empty
                if (!out.length) {
                    const plain = (doc.body.textContent || "").split(/\n+/).map(s => s.trim()).filter(Boolean);
                    const rows = [];
                    for (let i = 0; i < plain.length; i += 2) {
                        const label = plain[i], value = plain[i + 1] ?? "";
                        if (label) rows.push({ label, value });
                    }
                    return [{ title: "Thông số kỹ thuật", rows }];
                }
                return out;
            } catch {
                return [{ title: "Thông số kỹ thuật", rawHtml: specs, rows: [] }];
            }
        }

        return [];
    }, [specs]);

    if (!sections.length) {
        return <p className="text-muted m-0">Chưa có thông số kỹ thuật.</p>;
    }

    const handleCopy = async (text) => {
        if (!text) return;
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // fallback for insecure contexts: create temp textarea
                const ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
        } catch (e) {
            console.warn("Copy failed", e);
        }
    };

    return (
        <div className="vstack gap-3">
            {sections.map((sec, i) => (
                <div key={sec.title ?? i} className="spec-card border rounded-3 shadow-sm">
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
                                    <div key={r.label || idx} className="col">
                                        <div className="d-flex justify-content-between align-items-start spec-row p-2 rounded-2">
                                            <div className="text-secondary small me-3">{r.label}</div>
                                            <div className="fw-semibold text-wrap text-end">
                                                {r.value || <span className="text-muted">—</span>}
                                                {r.value && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link btn-sm text-decoration-none ms-2 p-0"
                                                        title="Sao chép"
                                                        onClick={() => handleCopy(r.value)}
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

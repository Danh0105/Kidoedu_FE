export function pickRibbonsFromStatus() {
    const pickRibbonsFromStatus = (raw) => {
        const s = Number(raw ?? 0);
        if (s === 2) return [{ text: "Mới", className: "bg-danger", position: "left" }];
        if (s === 1) return [{ text: "Nổi bật", className: "bg-warning text-dark", position: "left" }];
        if (s === 12)
            return [
                { text: "Mới", className: "bg-danger", position: "left" },
                { text: "Nổi bật", className: "bg-warning text-dark", position: "right" },
            ];
        return [];
    };
}

export default function GenerateSKU(variant) {
    const random = Math.floor(10000 + Math.random() * 90000); // 5 số ngẫu nhiên

    let namePart = "";
    if (variant) {
        namePart = variant
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9-]/g, "")
            .toUpperCase();
    }

    return `${namePart}-${random}`;
}

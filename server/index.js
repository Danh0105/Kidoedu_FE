const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 4000;

// ====== LOAD BUILD FILE 1 LẦN (tăng tốc) ======
const indexPath = path.resolve(__dirname, "../build/index.html");
const indexFile = fs.readFileSync(indexPath, "utf8");

// ====== STATIC FILES ======
app.use(express.static(path.resolve(__dirname, "../build")));

// ====== HELPER: remove html tag ======
function stripHtml(html = "") {
    return html.replace(/<[^>]+>/g, "");
}

// ===================================================
// PRODUCT DETAIL SSR
// ===================================================
app.get("/productdetail/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;

        // GỌI BACKEND NỘI BỘ (KHÔNG gọi domain public)
        const response = await axios.get(
            `http://127.0.0.1:3000/products/slug/${slug}`
        );

        const product = response.data.data;

        if (!product) {
            return res.status(404).send("Product not found");
        }

        // ====== MAP DATA ĐÚNG THEO API ======
        const title = product.productName || "";
        const description = stripHtml(product.shortDescription || "");

        // ẢNH PRIMARY
        const primaryImageObj =
            product.images?.find(i => i.isPrimary) ||
            product.images?.[0];

        let image = "https://kidoedu.vn/default.jpg";

        if (primaryImageObj?.imageUrl) {
            image = `https://kidoedu.vn${primaryImageObj.imageUrl}`;
        }

        // GIÁ (nếu cần cho schema)
        const price =
            product.variants?.[0]?.currentPrice || "0";

        const currency =
            product.variants?.[0]?.currency || "VND";

        const url = `https://www.kidoedu.edu.vn/productdetail/${slug}`;
        // ====== SCHEMA PRODUCT ======
        const schema = `
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${title}",
      "image": "${image}",
      "description": "${description}",
      "brand": {
        "@type": "Brand",
        "name": "KIDO EDU"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "${currency}",
        "price": "${price}",
        "availability": "https://schema.org/InStock"
      }
    }
    `;

        // ====== INJECT HTML ======
        let html = indexFile
            .replace(/__TITLE__/g, title)
            .replace(/__DESCRIPTION__/g, description)
            .replace(/__CANONICAL__/g, url)
            .replace(/__OG_TYPE__/g, "product")
            .replace(/__OG_TITLE__/g, title)
            .replace(/__OG_DESCRIPTION__/g, description)
            .replace(/__OG_URL__/g, url)
            .replace(/__OG_IMAGE__/g, image)
            .replace(/__OG_IMAGE_ALT__/g, title)
            .replace(
                /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
                `<script type="application/ld+json">${schema}</script>`
            );

        res.send(html);

    } catch (err) {
        console.error("SSR ERROR:", err.message);
        res.status(404).send("Not found");
    }
});

// ===================================================
// HOMEPAGE SSR
// ===================================================
app.get("/", (req, res) => {
    const url = "https://www.kidoedu.edu.vn/";

    let html = indexFile
        .replace(/__TITLE__/g, "KIDO EDU | Giải pháp công nghệ – giáo dục – chuyển đổi số")
        .replace(/__DESCRIPTION__/g,
            "KIDO EDU cung cấp giải pháp công nghệ, giáo dục và chuyển đổi số toàn diện cho trường học và doanh nghiệp tại Việt Nam.")
        .replace(/__CANONICAL__/g, url)
        .replace(/__OG_TYPE__/g, "website")
        .replace(/__OG_TITLE__/g,
            "CÔNG TY TNHH KIDO EDU | Giải pháp công nghệ – giáo dục – chuyển đổi số")
        .replace(/__OG_DESCRIPTION__/g,
            "KIDO EDU cung cấp giải pháp công nghệ, giáo dục và chuyển đổi số toàn diện cho trường học và doanh nghiệp tại Việt Nam.")
        .replace(/__OG_URL__/g, url)
        .replace(/__OG_IMAGE__/g,
            "https://res.cloudinary.com/dlnkeb4dm/image/upload/v1762094683/osbrzz4oxpvtymdfb0lu.png")
        .replace(/__OG_IMAGE_ALT__/g, "Logo KIDO EDU");

    res.send(html);
});

// ===================================================
// REACT ROUTER FALLBACK (Express 5 safe)
// ===================================================
app.use((req, res) => {
    res.send(indexFile);
});

// ===================================================
app.listen(PORT, "0.0.0.0", () => {
    console.log("SSR running on port", PORT);
});
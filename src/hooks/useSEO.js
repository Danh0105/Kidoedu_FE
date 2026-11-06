import { useEffect } from "react";

export const useSEO = ({
    title,
    description,
    canonical,
    ogType = "website",
    ogImage = "https://kidoedu.vn/default-share.jpg",
}) => {
    useEffect(() => {
        document.title = title;

        const setMeta = (attr, value, isProperty = false) => {
            const selector = isProperty
                ? `meta[property="${attr}"]`
                : `meta[name="${attr}"]`;

            let element = document.querySelector(selector);

            if (!element) {
                element = document.createElement("meta");
                if (isProperty) element.setAttribute("property", attr);
                else element.setAttribute("name", attr);
                document.head.appendChild(element);
            }

            element.setAttribute("content", value);
        };

        setMeta("description", description);
        setMeta("og:title", title, true);
        setMeta("og:description", description, true);
        setMeta("og:type", ogType, true);
        setMeta("og:url", canonical, true);
        setMeta("og:image", ogImage, true);

        // canonical
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "canonical");
            document.head.appendChild(link);
        }
        link.setAttribute("href", canonical);
    }, [title, description, canonical, ogType, ogImage]);
};
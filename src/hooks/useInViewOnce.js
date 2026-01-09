// hooks/useInViewOnce.js
import { useEffect, useState } from "react";

export default function useInViewOnce(ref, options = {}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || visible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el); // 👈 QUAN TRỌNG
                }
            },
            {
                root: null,
                rootMargin: "0px 0px -120px 0px", // 👈 trigger sớm hơn
                threshold: 0.1,
                ...options,
            }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [ref, visible, options]);

    return visible;
}

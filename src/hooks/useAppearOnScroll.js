// src/hooks/useAppearOnScroll.js
import { useEffect, useRef, useState } from "react";

export default function useAppearOnScroll(scrollRootRef) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        const root = scrollRootRef?.current || null;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            {
                root,                // 🔥 QUAN TRỌNG
                threshold: 0.15,
                rootMargin: "0px 0px -60px 0px",
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [scrollRootRef]);

    return { ref, visible };
}

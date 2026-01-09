// components/AnimateCard.jsx
import useAppearOnScroll from "../../hooks/useAppearOnScroll";

export default function AnimateCard({ children, className = "", scrollRootRef }) {
    const { ref, visible } = useAppearOnScroll(scrollRootRef);

    return (
        <div
            ref={ref}
            className={`appear ${visible ? "is-visible" : ""} ${className}`}
        >
            {children}
        </div>
    );
}


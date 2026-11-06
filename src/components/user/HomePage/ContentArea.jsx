import { useNavigate } from "react-router-dom";
import Carousel from "../Carousel";
import SubcategoryPanel from "./SubcategoryPanel";

const ContentArea = ({
    showHoverPanel,
    hoverPanel,
    hoverCatId,
    setShowHoverPanel,
    setHoverCatId,
    rootCats,
    childrenOfHover,
    bannersSlide
}) => {
    const navigate = useNavigate();

    // Khi click danh mục → chuyển sang trang Store
    const handleSelectCategory = (catId) => {
        setShowHoverPanel(false);
        setHoverCatId(null);
        navigate(`/store?cat=${catId}`);
    };

    // 1) Hover menu → hiển thị panel danh mục con
    if ((showHoverPanel || hoverPanel) && hoverCatId) {
        return (
            <SubcategoryPanel
                rootCats={rootCats}
                hoverCatId={hoverCatId}
                childrenOfHover={childrenOfHover}
                onSelectCategory={handleSelectCategory}
                setShowHoverPanel={setShowHoverPanel}
                setHoverCatId={setHoverCatId}
            />
        );
    }

    // 2) Mặc định → Carousel
    return (

        <Carousel banners={bannersSlide} />

    );
};

export default ContentArea;

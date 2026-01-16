import { Ribbon } from "lucide-react";
import { pickRibbonsFromStatus } from "../../../utils/pickRibbonsFromStatus";
import AnimateCard from "../AnimateCard";
import Carousel from "../Carousel";
import ProductHome from "../ProductHome";
import SubcategoryPanel from "./SubcategoryPanel";
import SkeletonCard from "./SkeletonCard"
const ContentArea = ({
    selectedCatId,
    loading,
    items,
    showHoverPanel,
    hoverPanel,
    hoverCatId,
    setSelectedCatId,
    setShowHoverPanel,
    setHoverCatId,
    rootCats,
    childrenOfHover,
}) => {
    // 1) Đã chọn danh mục → hiển thị sản phẩm
    if (selectedCatId != null) {
        return (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 flex-grow-1 ps-3">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="col d-flex justify-content-center">
                            <SkeletonCard />
                        </div>
                    ))
                    : items.length > 0
                        ? items.map((prod) => {
                            const ribbons = pickRibbonsFromStatus(prod?.status);

                            return (
                                <AnimateCard
                                    key={prod.productId}
                                    className="col position-relative"
                                >
                                    {ribbons.map((rb, i) => (
                                        <Ribbon key={i} {...rb} />
                                    ))}

                                    <ProductHome
                                        prod={prod}
                                    />
                                </AnimateCard>
                            );
                        })
                        : (
                            <p className="text-center text-muted">
                                Chưa có sản phẩm trong danh mục này.
                            </p>
                        )}
            </div>
        );
    }

    // 2) Đang hover menu → hiển thị panel danh mục con (ẩn Carousel)
    if ((showHoverPanel || hoverPanel) && hoverCatId) {
        return <SubcategoryPanel rootCats={rootCats} hoverCatId={hoverCatId} childrenOfHover={childrenOfHover} setSelectedCatId={setSelectedCatId} setShowHoverPanel={setShowHoverPanel} setHoverCatId={setHoverCatId} />;
    }

    // 3) Mặc định → Carousel
    return (
        <div className=" w-100" >
            <Carousel />
        </div>
    );
};
export default ContentArea;

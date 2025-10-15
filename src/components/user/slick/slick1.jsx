import Slider from "react-slick";
import "../../../../node_modules/slick-carousel/slick/slick.css";
import "../../../../node_modules/slick-carousel/slick/slick-theme.css";
import Button from "./Button";
import axios from "axios";
import { useEffect, useState } from "react";
const bootstrapBtnColors = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "dark",
];

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
export default function Slick1() {
    const settings = {
        speed: 100,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '50px',
                    slidesToShow: 1
                }
            }
        ]
    };
    const shuffledColors = shuffleArray(bootstrapBtnColors);
    const [categories, setCategories] = useState([]);

    const fetchCategory = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
            const roots = res.data.filter((cat) => cat.parent === null);
            const rootsWithCount = roots.map((cat) => ({
                ...cat,
                childCount: cat.children ? cat.children.length : 0,
            }));
            setCategories(rootsWithCount);

        } catch (err) {
            console.error("Lỗi khi lấy danh mục:", err);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);
    return (
        <div className="p-2" >
            <Slider {...settings}>
                {categories.length > 0 ? (
                    categories.map((c, index) => {
                        const color = shuffledColors[index % shuffledColors.length];
                        return (
                            <div className='me-1' key={c.id}>
                                <Button
                                    detail={`${c.childCount} mục con`}
                                    key={c.cat}
                                    name={`${c.category_name}`}
                                    classname={`btn btn-${color}`}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div>Không có danh mục nào</div>
                )}
            </Slider >

        </div >
    )
}


import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const ProfitProductChart = () => {

    const [categories, setCategories] = useState([]);
    const [profitData, setProfitData] = useState([]);
    const [colors, setColors] = useState([]);
    const [range, setRange] = useState("month");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [range]);

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const getDateRange = () => {

        const today = new Date();
        let from;

        if (range === "7days") {
            from = new Date();
            from.setDate(today.getDate() - 7);
        }

        if (range === "30days") {
            from = new Date();
            from.setDate(today.getDate() - 30);
        }

        if (range === "month") {
            from = new Date(today.getFullYear(), today.getMonth(), 1);
        }

        if (range === "year") {
            from = new Date(today.getFullYear(), 0, 1);
        }

        return {
            from: formatDate(from),
            to: formatDate(today),
        };
    };

    const fetchData = async () => {

        setLoading(true);

        try {

            const { from, to } = getDateRange();

            const res = await axios.get(
                `${API}/orders/profit-by-product?from=${from}&to=${to}`
            );
            console.log("Lợi nhuận theo sản phẩm:", res.data);
            const data = res.data || [];

            const products = data.map(i => i.product);

            const profits = data.map(i =>
                Math.round(Number(i.profit))
            );

            const barColors = profits.map(v =>
                v >= 0 ? "#28a745" : "#dc3545"
            );

            setCategories(products);
            setProfitData(profits);
            setColors(barColors);

        } catch (error) {

            console.error("Lỗi tải chart:", error);

        } finally {

            setLoading(false);

        }
    };

    const formatMoney = (value) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0
        }).format(value);

    const options = {

        chart: {
            type: "bar",
            toolbar: { show: false }
        },

        xaxis: {
            categories: categories
        },

        yaxis: {
            labels: {
                formatter: (val) => formatMoney(val)
            }
        },

        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "45%",
                distributed: true
            }
        },

        colors: colors,

        tooltip: {
            y: {
                formatter: (val) => formatMoney(val)
            }
        }

    };

    const series = [
        {
            name: "Lợi nhuận",
            data: profitData
        }
    ];

    return (
        <div className="card shadow-sm">

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">Lỗ / Lãi theo sản phẩm</h5>

                <select
                    className="form-select w-auto"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                >
                    <option value="7days">7 ngày</option>
                    <option value="30days">30 ngày</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm nay</option>
                </select>

            </div>

            <div className="card-body">

                {loading ? (
                    <div className="text-center py-5">
                        Đang tải dữ liệu...
                    </div>
                ) : (
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        height={350}
                    />
                )}

            </div>

        </div>
    );

};

export default ProfitProductChart;
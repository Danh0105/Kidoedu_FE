import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const PriceChartCard = () => {

    const [categories, setCategories] = useState([]);
    const [sellData, setSellData] = useState([]);
    const [costData, setCostData] = useState([]);

    const [range, setRange] = useState("month");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChart();
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

    const fetchChart = async () => {

        setLoading(true);

        try {

            const { from, to } = getDateRange();

            const res = await axios.get(
                `${API}/orders/price-chart?from=${from}&to=${to}`
            );

            const data = res.data.data || [];

            const dates = data.map(item => item.date);

            const sell = data.map(item =>
                Math.round(Number(item.avgSellPrice))
            );

            const cost = data.map(item =>
                Math.round(Number(item.avgCostPrice))
            );

            setCategories(dates);
            setSellData(sell);
            setCostData(cost);

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
            id: "price-chart",
            toolbar: { show: false },
            zoom: { enabled: false }
        },

        stroke: {
            curve: "smooth",
            width: 3
        },

        markers: {
            size: 4
        },

        grid: {
            borderColor: "#eee"
        },

        xaxis: {
            categories: categories
        },

        yaxis: {
            labels: {
                formatter: (val) => formatMoney(val)
            }
        },

        tooltip: {
            y: {
                formatter: (val) => formatMoney(val)
            }
        },

        colors: ["#0d6efd", "#dc3545"]

    };

    const series = [
        {
            name: "Giá bán",
            data: sellData
        },
        {
            name: "Giá nhập",
            data: costData
        }
    ];

    return (

        <div className="card mb-4 shadow-sm">

            <div className="card-header d-flex justify-content-between align-items-center">

                <h5 className="mb-0">Biểu đồ giá nhập / giá bán</h5>

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
                        type="line"
                        height={320}
                    />
                )}

            </div>

        </div>

    );

};

export default PriceChartCard;
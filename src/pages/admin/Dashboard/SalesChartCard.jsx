import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const SalesChartCard = () => {

    const [categories, setCategories] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const [range, setRange] = useState("month");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRevenue();
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

    const fetchRevenue = async () => {

        setLoading(true);

        try {

            const { from, to } = getDateRange();

            const res = await axios.get(
                `${API}/orders/revenue?from=${from}&to=${to}`
            );

            const data = res.data || [];

            const dates = data.map(item => item.date);

            const revenues = data.map(item =>
                Math.round(Number(item.revenue))
            );

            const total = revenues.reduce((sum, val) => sum + val, 0);

            setCategories(dates);
            setSeriesData(revenues);
            setTotalRevenue(total);

        } catch (error) {

            console.error("Lỗi tải doanh thu:", error);

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
            id: "revenue-chart",
            toolbar: { show: false },
            zoom: { enabled: false },
        },

        dataLabels: { enabled: false },

        stroke: {
            curve: "smooth",
            width: 3,
        },

        grid: {
            borderColor: "#eee",
        },

        xaxis: {
            categories: categories,
        },

        yaxis: {
            labels: {
                formatter: (val) => formatMoney(val),
            },
        },

        tooltip: {
            y: {
                formatter: (val) => formatMoney(val),
            },
        },

        colors: ["#0d6efd"],

        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
            },
        },

    };

    const series = [
        {
            name: "Doanh thu",
            data: seriesData,
        },
    ];

    return (

        <div className="card mb-4 shadow-sm">

            <div className="card-header d-flex justify-content-between align-items-center">

                <div>
                    <h5 className="mb-0">Doanh thu</h5>
                    <small className="text-muted">
                        Tổng: {formatMoney(totalRevenue)}
                    </small>
                </div>

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
                        type="area"
                        height={300}
                    />
                )}

            </div>

        </div>

    );

};

export default SalesChartCard;
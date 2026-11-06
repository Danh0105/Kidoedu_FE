import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const VisitorsChartCard = () => {
    const [categories, setCategories] = useState([]);
    const [thisWeekData, setThisWeekData] = useState([]);
    const [lastWeekData, setLastWeekData] = useState([]);
    const [total, setTotal] = useState(0);
    const [growth, setGrowth] = useState(0);

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const res = await axios.get(`${API}/tracking/visitors`);
            const { thisWeek, lastWeek } = res.data;

            const dates = thisWeek.map(item =>
                new Date(item.date).getDate() + "th"
            );

            const thisCounts = thisWeek.map(item => Number(item.count));
            const lastCounts = lastWeek.map(item => Number(item.count));

            const thisTotal = thisCounts.reduce((a, b) => a + b, 0);
            const lastTotal = lastCounts.reduce((a, b) => a + b, 0);

            const percent =
                lastTotal === 0 ? 100 : ((thisTotal - lastTotal) / lastTotal) * 100;

            setCategories(dates);
            setThisWeekData(thisCounts);
            setLastWeekData(lastCounts);
            setTotal(thisTotal);
            setGrowth(percent);
        } catch (err) {
            console.error("Lỗi tải visitor:", err);
        }
    };

    const options = {
        chart: {
            id: "visitors-chart",
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        stroke: { curve: "smooth", width: 3 },
        dataLabels: { enabled: false },
        xaxis: {
            categories: categories,
        },
        colors: ["#0d6efd", "#adb5bd"],
        legend: { show: false },
    };

    const series = [
        {
            name: "This Week",
            data: thisWeekData,
        },
        {
            name: "Last Week",
            data: lastWeekData,
        },
    ];

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="d-flex">
                    <p className="d-flex flex-column">
                        <span className="fw-bold fs-5">{total}</span>
                        <span>Visitors Over Time</span>
                    </p>
                    <p className="ms-auto d-flex flex-column text-end">
                        <span className={growth >= 0 ? "text-success" : "text-danger"}>
                            <i
                                className={`bi ${growth >= 0 ? "bi-arrow-up" : "bi-arrow-down"
                                    }`}
                            ></i>{" "}
                            {Math.abs(growth).toFixed(1)}%
                        </span>
                        <span className="text-secondary">So với tuần trước</span>
                    </p>
                </div>

                <div className="position-relative mb-4">
                    <Chart
                        options={{ ...options, chart: { ...options.chart, type: "bar" } }}
                        series={series}
                        type="bar"
                        height={215}
                    />
                </div>

                <div className="d-flex flex-row justify-content-end">
                    <span className="me-2">
                        <i className="bi bi-square-fill text-primary"></i> This Week
                    </span>
                    <span>
                        <i className="bi bi-square-fill text-secondary"></i> Last Week
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VisitorsChartCard;
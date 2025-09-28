import React from 'react';
import Chart from 'react-apexcharts';

const VisitorsChartCard = () => {
    const options = {
        chart: {
            id: 'visitors-chart',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        stroke: { curve: 'smooth', width: 3 },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['22th', '23th', '24th', '25th', '26th', '27th', '28th']
        },
        colors: ['#0d6efd', '#adb5bd'],
        legend: { show: false }
    };

    const series = [
        {
            name: 'High - 2023',
            data: [120, 210, 160, 180, 90, 110, 80]
        },
        {
            name: 'Low - 2023',
            data: [80, 90, 100, 95, 80, 85, 70]
        }
    ];

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="d-flex">
                    <p className="d-flex flex-column">
                        <span className="fw-bold fs-5">820</span>
                        <span>Visitors Over Time</span>
                    </p>
                    <p className="ms-auto d-flex flex-column text-end">
                        <span className="text-success">
                            <i className="bi bi-arrow-up"></i> 12.5%
                        </span>
                        <span className="text-secondary">Since last week</span>
                    </p>
                </div>
                <div className="position-relative mb-4">
                    <Chart options={{ ...options, chart: { ...options.chart, type: 'bar' } }} series={series} type="bar" height={215} />
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

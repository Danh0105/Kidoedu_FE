import React from 'react';
import Chart from 'react-apexcharts';

const SalesChartCard = () => {
    const options = {
        chart: {
            id: 'revenue-chart',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: {
            categories: ["Jan '23", "Feb '23", "Mar '23", "Apr '23", "May '23", "Jun '23"]
        },
        yaxis: {
            title: { text: 'Sales ($)' }
        },
        colors: ['#0d6efd', '#20c997'],
        legend: { position: 'top' }
    };

    const series = [
        {
            name: 'Digital Goods',
            data: [100, 80, 60, 40, 20, 0]
        },
        {
            name: 'Electronics',
            data: [80, 100, 60, 70, 40, 60]
        }
    ];

    return (
        <div className="card mb-4">
            <div className="card-header" style={{ cursor: 'move' }}>
                <h3 className="card-title">Sales Value</h3>
            </div>
            <div className="card-body">
                <Chart options={options} series={series} type="area" height={280} />
            </div>
        </div>
    );
};

export default SalesChartCard;

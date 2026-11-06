import React, { Component } from "react";
import axios from "axios";
import SalesChartCard from "./SalesChartCard";
import DashboardWidgets from "./DashboardWidgets";
import PriceChartCard from "./PriceChartCard";
import ProfitProductChart from "./ProfitProductChart";

const API = process.env.REACT_APP_API_URL;

export default class Dashboard extends Component {
    state = {
        overview: {
            totalRevenue: 0,
            totalOrders: 0,
            paidOrders: 0,
            successRate: 0,
            totalUsers: 0,
        },
        loading: true,
    };

    componentDidMount() {
        this.fetchOverview();
    }

    fetchOverview = async () => {
        try {
            const res = await axios.get(`${API}/orders/overview`);
            this.setState({
                overview: res.data,
                loading: false,
            });
        } catch (error) {
            console.error("Lỗi tải dashboard:", error);
        }
    };

    render() {
        const { overview, loading } = this.state;

        if (loading) {
            return <div className="p-5 text-center">Đang tải dữ liệu...</div>;
        }

        return (
            <main className="app-main" id="main" tabIndex="-1">
                <div className="container-fluid">

                    {/* ===== KPI BOX ===== */}
                    <div className="row">

                        {/* Đơn hàng */}
                        <div className="col-lg-3 col-6">
                            <div className="small-box text-bg-primary">
                                <div className="inner">
                                    <h3>{overview.totalOrders}</h3>
                                    <p>Tổng đơn hàng</p>
                                </div>
                                <div className="small-box-footer">
                                    Đã thanh toán: {overview.paidOrders}
                                </div>
                            </div>
                        </div>

                        {/* Doanh thu */}
                        <div className="col-lg-3 col-6">
                            <div className="small-box text-bg-success">
                                <div className="inner">
                                    <h3>
                                        {overview.totalRevenue?.toLocaleString()}₫
                                    </h3>
                                    <p>Tổng doanh thu</p>
                                </div>
                                <div className="small-box-footer">
                                    Tổng giảm giá: {overview.totalDiscount?.toLocaleString()}₫
                                </div>
                            </div>
                        </div>

                        {/* Tỷ lệ thành công */}
                        <div className="col-lg-3 col-6">
                            <div className="small-box text-bg-warning">
                                <div className="inner">
                                    <h3>{overview.successRate?.toFixed(1)}%</h3>
                                    <p>Tỷ lệ thanh toán</p>
                                </div>
                            </div>
                        </div>

                        {/* Giá trị trung bình */}
                        <div className="col-lg-3 col-6">
                            <div className="small-box text-bg-danger">
                                <div className="inner">
                                    <h3>
                                        {(
                                            overview.totalRevenue / overview.totalOrders || 0
                                        ).toLocaleString()}₫
                                    </h3>
                                    <p>Giá trị TB / đơn (AOV)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== BIỂU ĐỒ + WIDGET ===== */}
                    <div className="row mt-4">
                        <div className="col-lg-6 connectedSortable">
                            <SalesChartCard />
                        </div>

                        <div className="col-lg-6 connectedSortable">
                            <DashboardWidgets />
                        </div>
                        <div className="col-lg-6 connectedSortable">
                            <PriceChartCard />
                        </div>
                        <div className="col-lg-6 connectedSortable">
                            <ProfitProductChart />
                        </div>
                    </div>

                </div>
            </main>
        );
    }
}
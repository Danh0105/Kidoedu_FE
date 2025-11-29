import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";

// Layouts
import Login from "../pages/user/Login";
// Pages - User
import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../layouts/admin/Layout";
import ProductManagement from "../pages/admin/ProductManagement/ProductManagement";
import OrderManagement from "../pages/admin/OrderManagement/OrderManagement";
import Payment from "../pages/admin/Payment";
import ReportsAnalytics from "../pages/admin/ReportsAnalytics";
import UserManagement from "../pages/admin/UserManagement";
import SystemSettings from "../pages/admin/SystemSettings";
import Shipping from "../pages/admin/Shipping";
import CouponManagement from "../pages/admin/CouponManagement";
import PrivateRoute from "../components/user/PrivateRoute";
import PolicyManagerPage from "../pages/admin/policy/PolicyManagerPage";
import InventoryManager from "../pages/admin/Inventory/InventoryManager";
export default function AppRoutes() {

    return (
        <BrowserRouter basename="/admin">
            <Routes>
                <Route path="/dashboard" element={
                    <PrivateRoute allowedRoles={['admin']}>
                        <AdminLayout title="Dashboard" />
                    </PrivateRoute>
                }>
                    <Route index element={<Dashboard />} />
                </Route>
                <Route path="/products" element={<AdminLayout title="Product Management" />}>
                    <Route index element={<ProductManagement />} />
                </Route>
                <Route path="/orders" element={<AdminLayout title="Order" />}>
                    <Route index element={<OrderManagement />} />
                </Route>
                <Route path="/users" element={<AdminLayout title="User" />}>
                    <Route index element={<UserManagement />} />
                </Route>
                <Route path="/coupons" element={<AdminLayout title="Coupon" />}>
                    <Route index element={<CouponManagement />} />
                </Route>
                <Route path="/reports" element={<AdminLayout title="Report" />}>
                    <Route index element={<ReportsAnalytics />} />
                </Route>
                <Route path="/payments" element={<AdminLayout title="Payment" />}>
                    <Route index element={<Payment />} />
                </Route>
                <Route path="/shipping" element={<AdminLayout title="Shipping" />}>
                    <Route index element={<Shipping />} />
                </Route>
                <Route path="/settings" element={<AdminLayout title="Setting" />}>
                    <Route index element={<SystemSettings />} />
                </Route>
                <Route path="/inventory" element={<AdminLayout title="Invenory Manager" />}>
                    <Route index element={<InventoryManager />} />
                </Route>

            </Routes>
        </BrowserRouter >
    );
}

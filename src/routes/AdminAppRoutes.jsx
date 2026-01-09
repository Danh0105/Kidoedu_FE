import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import Login from "../pages/user/Login";
// Pages - User
import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../layouts/admin/Layout";
import ProductManagement from "../pages/admin/Product/ProductManagement";
import OrderManagement from "../pages/admin/Order/OrderManagement";
import Payment from "../pages/admin/Payment";
import ReportsAnalytics from "../pages/admin/ReportsAnalytics";
import UserManagementPage from "../pages/admin/RolePermission/UserManagement";
import SystemSettings from "../pages/admin/SystemSettings/SystemSettings";
import Shipping from "../pages/admin/Shipping";
import CouponManagement from "../pages/admin/CouponManagement";
import PrivateRoute from "./PrivateRoute";
import PolicyManagerPage from "../pages/admin/policy/PolicyManagerPage";
import InventoryManager from "../pages/admin/Inventory/InventoryManager";
import BannerManagement from "../pages/admin/Banner/BannerManagement";
import ChatbotScriptManager from "../pages/admin/Chatbot";
export default function AppRoutes() {

    return (
        <Routes>
            <Route path="/dashboard" element={
                <PrivateRoute allowedRoles={['ADMIN', 'STAFF']}>
                    <AdminLayout title="Dashboard" />
                </PrivateRoute>
            }>
                <Route index element={<Dashboard />} />
            </Route>
            <Route path="/products" element={<AdminLayout title="Product Management" />}>
                <Route index element={<ProductManagement />} />
            </Route>
            <Route path="/orders" element={
                <PrivateRoute
                    allowedRoles={['ADMIN', 'STAFF']}
                    requiredPermissions={["order.read"]}
                >
                    <AdminLayout title="Order" />
                </PrivateRoute>


            }>
                <Route index element={<OrderManagement />} />
            </Route>
            <Route path="/users" element={<AdminLayout title="User" />}>
                <Route index element={<UserManagementPage />} />
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
            <Route path="/banners" element={<AdminLayout title="Banner Manager" />}>
                <Route index element={<BannerManagement />} />
            </Route>
            <Route path="/chatbotscripts" element={<AdminLayout title="Chatbot Script Manager" />}>
                <Route index element={<ChatbotScriptManager />} />
            </Route>
        </Routes>
    );
}

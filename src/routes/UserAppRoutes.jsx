import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import Login from "../pages/user/Login";
// Pages - User
import Home from "../pages/user/Home";
import Dashboard from "../pages/user/Dashboard";
import UserLayout from "../layouts/user/Layout";
import Register from "../pages/user/Register";
import PrivateRoute from "../components/user/PrivateRoute";
import Lesson from "../pages/user/Lesson";
import Store from "../pages/user/Store";
import Cart from "../pages/user/Cart";
import About from "../pages/user/About";
import ProductDetail from "../pages/user/ProductDetail";
import Checkout from "../pages/user/Checkout";
import Order from "../pages/user/Order";
import Invoice from "../pages/user/Invoice";

export default function AppRoutes() {

    return (
        <BrowserRouter basename="">

            <Routes>
                {/* Public routes */}
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<Home />} />
                </Route>
                <Route path="/login" element={<UserLayout />}>
                    <Route index element={<Login />} />
                </Route>
                <Route path="/register" element={<UserLayout />}>
                    <Route index element={<Register />} />
                </Route>
                <Route path="/about" element={<UserLayout />}>
                    <Route index element={<About />} />
                </Route>
                {/* Private routes */}
                <Route path="/dashboard" element={
                    <PrivateRoute allowedRoles={['customer']}>
                        <UserLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Dashboard />} />
                </Route>
                <Route path="/lesson" element={
                    <PrivateRoute allowedRoles={['customer']}>
                        <UserLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Lesson />} />
                </Route>
                {/*  <Route path="/store" element={
                    <PrivateRoute allowedRoles={['customer']}>
                        <UserLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Store />} />
                </Route> */}
                <Route path="/store" element={<UserLayout />}>
                    <Route index element={<Store />} />
                </Route>
                {/*    <Route path="/cart" element={
                    <PrivateRoute allowedRoles={['customer']}>
                        <UserLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Cart />} />
                </Route> */}
                <Route path="/cart" element={<UserLayout />}>
                    <Route index element={<Cart />} />
                </Route>
                <Route path="/checkout" element={<UserLayout />}>
                    <Route index element={<Checkout />} />
                </Route>
                <Route path="/order" element={<UserLayout />}>
                    <Route index element={<Order />} />
                </Route>
                <Route path="/invoice" element={<UserLayout />}>
                    <Route index element={<Invoice />} />
                </Route>
                {/*   <Route path="/productdetail" element={
                    <PrivateRoute allowedRoles={['customer']}>
                        <UserLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<ProductDetail />} />
                </Route> */}
                <Route path="/productdetail/:id" element={<UserLayout />}>
                    <Route index element={<ProductDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

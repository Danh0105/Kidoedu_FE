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
import ChatBox from "../components/user/ChatBox";
import SearchProducts from "../pages/user/Search";
import Quotation from "../pages/user/Quotation";
import NewProducts from "../pages/user/NewProducts";
import FeaturedProducts from "../pages/user/FeaturedProducts";
import WarrantyPolicy from "../pages/user/customerSupport/WarrantyPolicy";
import ReturnPolicyGuide from "../pages/user/customerSupport/showReturnPolicyGuide";
import RepairServicePage from "../pages/user/customerSupport/RepairServicePage";
import PaymentPolicy from "../pages/user/customerSupport/PaymentPolicy";
import ContactFeedbackPage from "../pages/user/customerSupport/ContactFeedbackPage";
import ComplaintHandlingPolicyPage from "../pages/user/policy/ComplaintHandlingPolicyPage";
import MaintenancePolicyPage from "../pages/user/policy/MaintenancePolicyPage";
import PaymentPolicyPage from "../pages/user/PoliciesandRegulations/PaymentPolicyPage";
import VTKC from "../pages/user/VTKC";

import ReturnPolicyPage from "../pages/user/policy/ReturnPolicyPage";
import ShippingPolicyPage from "../pages/user/PoliciesandRegulations/ShippingPolicyPage";
import PolicyManagerPage from "../pages/admin/policy/PolicyManagerPage";
import PriceInfoPage from "../pages/user/PoliciesandRegulations/PriceInfoPage";
import InspectionPolicyPage from "../pages/user/PoliciesandRegulations/InspectionPolicyPage";
import ReturnsRefundsPolicyPage from "../pages/user/PoliciesandRegulations/ReturnsRefundsPolicyPage";
import PrivacyPolicyPage from "../pages/user/PoliciesandRegulations/PrivacyPolicyPage";
import PoliciesPage from "../pages/user/PoliciesandRegulations/Overview";
import Rental from "../pages/user/Rental";
import CheckoutRental from "../pages/user/CheckoutRental";

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
                <Route path="/quotation" element={<UserLayout />}>
                    <Route index element={<Quotation />} />
                </Route>
                <Route path="/newproduct" element={<UserLayout />}>
                    <Route index element={<NewProducts />} />
                </Route>
                <Route path="/featuredproducts" element={<UserLayout />}>
                    <Route index element={<FeaturedProducts />} />
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
                <Route path="/checkoutrental" element={<UserLayout />}>
                    <Route index element={<CheckoutRental />} />
                </Route>
                <Route path="/order" element={<UserLayout />}>
                    <Route index element={<Order />} />
                </Route>

                {/*     CustomerSupport */}
                <Route path="/warrantypolicy" element={<UserLayout />}>
                    <Route index element={<WarrantyPolicy />} />
                </Route>
                <Route path="/ReturnPolicyGuide" element={<UserLayout />}>
                    <Route index element={<ReturnPolicyGuide />} />
                </Route>
                <Route path="/RepairServicePage" element={<UserLayout />}>
                    <Route index element={<RepairServicePage />} />
                </Route>
                <Route path="/PaymentPolicy" element={<UserLayout />}>
                    <Route index element={<PaymentPolicy />} />
                </Route>
                <Route path="/ContactFeedbackPage" element={<UserLayout />}>
                    <Route index element={<ContactFeedbackPage />} />
                </Route>
                {/*     CustomerSupport */}
                {/*     Policy */}
                <Route path="/ComplaintHandlingPolicyPage" element={<UserLayout />}>
                    <Route index element={<ComplaintHandlingPolicyPage />} />
                </Route>
                <Route path="/MaintenancePolicyPage" element={<UserLayout />}>
                    <Route index element={<MaintenancePolicyPage />} />
                </Route>
                {/* <Route path="/PaymentPolicyPage" element={<UserLayout />}>
                    <Route index element={<PaymentPolicyPage />} />
                </Route> */}
                <Route path="/ReturnPolicyPage" element={<UserLayout />}>
                    <Route index element={<ReturnPolicyPage />} />
                </Route>

                {/*     Policy */}
                <Route path="/search" element={<UserLayout />}>
                    <Route index element={<SearchProducts />} />
                </Route>
                <Route path="/invoice" element={<UserLayout />}>
                    <Route index element={<Invoice />} />
                </Route>
                <Route path="/chatbot" element={<UserLayout />}>
                    <Route index element={<ChatBox />} />
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
                <Route path="/PolicyManagerPage" element={<UserLayout />}>
                    <Route index element={<PolicyManagerPage />} />
                </Route>
                <Route path="/PriceInfoPage" element={<UserLayout />}>
                    <Route index element={<PriceInfoPage />} />
                </Route>
                <Route path="/PaymentPolicyPage" element={<UserLayout />}>
                    <Route index element={<PaymentPolicyPage />} />
                </Route>
                <Route path="/ShippingPolicyPage" element={<UserLayout />}>
                    <Route index element={<ShippingPolicyPage />} />
                </Route>
                <Route path="/InspectionPolicyPage" element={<UserLayout />}>
                    <Route index element={<InspectionPolicyPage />} />
                </Route>
                <Route path="/ReturnsRefundsPolicyPage" element={<UserLayout />}>
                    <Route index element={<ReturnsRefundsPolicyPage />} />
                </Route>
                <Route path="/PrivacyPolicyPage" element={<UserLayout />}>
                    <Route index element={<PrivacyPolicyPage />} />
                </Route>
                <Route path="/overview" element={<UserLayout />}>
                    <Route index element={<PoliciesPage />} />
                </Route>
                <Route path="/rental" element={<UserLayout />}>
                    <Route index element={<Rental />} />
                </Route>
                <Route path="/vtkc" element={<UserLayout />}>
                    <Route index element={<VTKC />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

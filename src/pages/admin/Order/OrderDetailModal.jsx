import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default function OrderDetailModal({ show, onClose, order }) {
    if (!show || !order) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            Chi tiết đơn hàng {`DH${String(order.orderId).padStart(4, "0")}`}
                        </h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">

                        {/* Thông tin khách */}
                        <h6 className="fw-bold mb-2">Thông tin khách hàng</h6>
                        <p className="mb-1"><strong>Họ tên:</strong> {order.shippingAddress?.full_name}</p>
                        <p className="mb-1"><strong>Email:</strong> {order.user?.email}</p>
                        <p className="mb-3"><strong>SĐT:</strong> {order.shippingAddress?.phone_number}</p>
                        <p className="mb-3"><strong>Địa chỉ:</strong> {order.shippingAddress?.street} {order.shippingAddress?.ward} {order.shippingAddress?.district} {order.shippingAddress?.city}</p>
                        {/* Sản phẩm */}
                        <h6 className="fw-bold mt-3">Danh sách sản phẩm</h6>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th className="text-center">SL</th>
                                    <th className="text-end">Giá</th>
                                    <th className="text-end">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item) => (
                                    <tr key={item.itemId}>
                                        <td>{item.variant?.product?.productName} {item.variant?.variantName}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-end">
                                            {new Intl.NumberFormat("vi-VN").format(item.pricePerUnit)} đ
                                        </td>
                                        <td className="text-end">
                                            {new Intl.NumberFormat("vi-VN").format(item.pricePerUnit * item.quantity)} đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Tổng tiền */}
                        <h5 className="text-end fw-bold">
                            Tổng cộng:{" "}
                            {new Intl.NumberFormat("vi-VN").format(order.totalAmount)} đ
                        </h5>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}


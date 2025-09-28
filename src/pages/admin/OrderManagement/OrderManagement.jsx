import React, { Component } from 'react'
import product from '../../../assets/admin/product1.png'
import { Link } from 'react-router-dom'

export default class OrderManagement extends Component {
    render() {
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        };
        return (
            <div className="container-fluid mt-2">
                <div class="card mb-4">
                    <div class="p-2 d-flex justify-content-between align-items-center ">
                        <div className='flex-fill'>
                            <h3 class="card-title ">Danh sách đơn hàng</h3>
                        </div>
                        <div className='p-2 w-50 flex-fill d-flex justify-content-center'>
                            <input type="search" class="form-control w-50" placeholder="Search..." aria-label="Search"></input>
                        </div>
                        <div class=" p-2 flex-fill card-tools">
                            <ol class="breadcrumb float-sm-end">
                                <li class="breadcrumb-item"><a href="#">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">ProductManagement</li>
                            </ol>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <table class="table" role="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "10px" }} scope="col"><div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="checkDefault" />
                                    </div>
                                    </th>
                                    <th className='align-middle' scope="col" style={{ width: "120px" }}>Mã đơn hàng </th>
                                    <th className='align-middle'>Tên khách hàng</th>
                                    <th className='align-middle'>Số điện thoại</th>
                                    <th className='align-middle' scope="col">Ngày đặt hàng</th>
                                    <th className='align-middle'>Trạng thái</th>
                                    <th className='align-middle'>Phhương thức thanh toán</th>
                                    <th className='align-middle'>Tổng tiền</th>
                                    <th className='align-middle text-center' scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="align-middle">
                                    <td><input class="form-check-input" type="checkbox" value="" id="checkDefault" /></td>
                                    <td><Link to="/order-detail">DH0001</Link></td>
                                    <td>Khách 1</td>
                                    <td className='align-middle'>
                                        0950061089
                                    </td>
                                    <td>2025-07-25</td>
                                    <td className='align-middle'>Đã xác nhận</td>
                                    <td className='text-center'>Ví điện tử</td>
                                    <td><span>{formatCurrency(1250000)}</span> </td>
                                    <td style={{ width: "165px" }} >
                                        <button className='btn btn-primary me-2'>
                                            Edit
                                        </button>
                                        <button className='btn btn-danger'>
                                            Delete
                                        </button>
                                    </td>

                                </tr>

                            </tbody>
                            <thead>
                                <tr>
                                    <th style={{ width: "10px" }} scope="col"><div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="checkDefault" />
                                    </div>
                                    </th>
                                    <th className='align-middle' scope="col" style={{ width: "120px" }}>Mã đơn hàng </th>
                                    <th className='align-middle'>Tên khách hàng</th>
                                    <th className='align-middle'>Số điện thoại</th>
                                    <th className='align-middle' scope="col">Ngày đặt hàng</th>
                                    <th className='align-middle'>Trạng thái</th>
                                    <th className='align-middle'>Phhương thức thanh toán</th>
                                    <th className='align-middle'>Tổng tiền</th>
                                    <th className='align-middle text-center' scope="col">Actions</th>
                                </tr>
                            </thead>
                        </table>
                        <div className='d-flex mx-4 mt-2 mb-2 align-items-center justify-content-between gap-2'>

                            <div class="dropdown d-flex  mb-2 align-items-center">
                                <input class="form-check-input me-2 " type="checkbox" value="" id="checkDefault" />
                                <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Hành động hàng loạt
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Action</a></li>
                                    <li><a class="dropdown-item" href="#">Another action</a></li>
                                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </div>
                            <div >
                                <ul class="pagination pagination-sm float-end">
                                    <li class="page-item"><a class="page-link" href="#">«</a></li>
                                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                                    <li class="page-item"><a class="page-link" href="#">»</a></li>
                                </ul>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

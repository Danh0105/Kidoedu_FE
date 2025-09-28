import SalesChartCard from '../../components/admin/SalesChartCard'
import DashboardWidgets from '../../components/admin/DashboardWidgets'
import React, { Component } from 'react'

export default class Dashboard extends Component {
    render() {
        return (
            <main class="app-main" id="main" tabindex="-1">
                <div className='container-fluid'>
                    <div class="row">
                        <div class="col-lg-3 col-6">
                            <div class="small-box text-bg-primary">
                                <div class="inner">
                                    <h3>150</h3>
                                    <p>Đơn hàng mới</p>
                                </div>
                                <svg class="small-box-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                                </svg>
                                <a href="#" class="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover">
                                    More info <i class="bi bi-link-45deg"></i>
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-3 col-6">
                            <div class="small-box text-bg-success">
                                <div class="inner">
                                    <h3>53<sup class="fs-5">%</sup></h3>
                                    <p>Bounce Rate</p>
                                </div>
                                <svg class="small-box-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
                                </svg>
                                <a href="#" class="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover">
                                    More info <i class="bi bi-link-45deg"></i>
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-3 col-6">
                            <div class="small-box text-bg-warning">
                                <div class="inner">
                                    <h3>44</h3>
                                    <p>Người dùng</p>
                                </div>
                                <svg class="small-box-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
                                </svg>
                                <a href="#" class="small-box-footer link-dark link-underline-opacity-0 link-underline-opacity-50-hover">
                                    More info <i class="bi bi-link-45deg"></i>
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-3 col-6">
                            <div class="small-box text-bg-danger">
                                <div class="inner">
                                    <h3>65</h3>
                                    <p>Số lượt truy cập</p>
                                </div>
                                <svg class="small-box-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"></path>
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"></path>
                                </svg>
                                <a href="#" class="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover">
                                    More info <i class="bi bi-link-45deg"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-6 connectedSortable'>
                            <SalesChartCard />
                            <div class="card mb-4">
                                <div class="card-header border-0">
                                    <h3 class="card-title">Products</h3>
                                    <div class="card-tools">
                                        <a href="#" class="btn btn-tool btn-sm"> <i class="bi bi-download"></i> </a>
                                        <a href="#" class="btn btn-tool btn-sm"> <i class="bi bi-list"></i> </a>
                                    </div>
                                </div>
                                <div class="card-body table-responsive p-0">
                                    <table class="table table-striped align-middle" role="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Product</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Sales</th>
                                                <th scope="col">More</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <img src="./assets/img/default-150x150.png" alt="Product 1" class="rounded-circle img-size-32 me-2" />
                                                    Some Product
                                                </td>
                                                <td>$13 USD</td>
                                                <td>
                                                    <small class="text-success me-1">
                                                        <i class="bi bi-arrow-up"></i>
                                                        12%
                                                    </small>
                                                    12,000 Sold
                                                </td>
                                                <td>
                                                    <a href="#" class="text-secondary"> <i class="bi bi-search"></i> </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <img src="./assets/img/default-150x150.png" alt="Product 1" class="rounded-circle img-size-32 me-2" />
                                                    Another Product
                                                </td>
                                                <td>$29 USD</td>
                                                <td>
                                                    <small class="text-info me-1">
                                                        <i class="bi bi-arrow-down"></i>
                                                        0.5%
                                                    </small>
                                                    123,234 Sold
                                                </td>
                                                <td>
                                                    <a href="#" class="text-secondary"> <i class="bi bi-search"></i> </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <img src="./assets/img/default-150x150.png" alt="Product 1" class="rounded-circle img-size-32 me-2" />
                                                    Amazing Product
                                                </td>
                                                <td>$1,230 USD</td>
                                                <td>
                                                    <small class="text-danger me-1">
                                                        <i class="bi bi-arrow-down"></i>
                                                        3%
                                                    </small>
                                                    198 Sold
                                                </td>
                                                <td>
                                                    <a href="#" class="text-secondary"> <i class="bi bi-search"></i> </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <img src="./assets/img/default-150x150.png" alt="Product 1" class="rounded-circle img-size-32 me-2" />
                                                    Perfect Item
                                                    <span class="badge text-bg-danger">NEW</span>
                                                </td>
                                                <td>$199 USD</td>
                                                <td>
                                                    <small class="text-success me-1">
                                                        <i class="bi bi-arrow-up"></i>
                                                        63%
                                                    </small>
                                                    87 Sold
                                                </td>
                                                <td>
                                                    <a href="#" class="text-secondary"> <i class="bi bi-search"></i> </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                        <div className='col-lg-6 connectedSortable'>
                            <DashboardWidgets />
                            <div class="card mb-4">
                                <div class="card-header border-0">
                                    <h3 class="card-title">Online Store Overview</h3>
                                    <div class="card-tools">
                                        <a href="#" class="btn btn-sm btn-tool"> <i class="bi bi-download"></i> </a>
                                        <a href="#" class="btn btn-sm btn-tool"> <i class="bi bi-list"></i> </a>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center border-bottom mb-3">
                                        <p class="text-success fs-2">
                                            <svg height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"></path>
                                            </svg>
                                        </p>
                                        <p class="d-flex flex-column text-end">
                                            <span class="fw-bold">
                                                <i class="bi bi-graph-up-arrow text-success"></i> 12%
                                            </span>
                                            <span class="text-secondary">CONVERSION RATE</span>
                                        </p>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center border-bottom mb-3">
                                        <p class="text-info fs-2">
                                            <svg height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
                                            </svg>
                                        </p>
                                        <p class="d-flex flex-column text-end">
                                            <span class="fw-bold">
                                                <i class="bi bi-graph-up-arrow text-info"></i> 0.8%
                                            </span>
                                            <span class="text-secondary">SALES RATE</span>
                                        </p>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center mb-0">
                                        <p class="text-danger fs-2">
                                            <svg height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                                            </svg>
                                        </p>
                                        <p class="d-flex flex-column text-end">
                                            <span class="fw-bold">
                                                <i class="bi bi-graph-down-arrow text-danger"></i>
                                                1%
                                            </span>
                                            <span class="text-secondary">REGISTRATION RATE</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        )
    }
}

import React, { Component } from 'react'
import './css/Dropdown.css';
export default class Dropdown extends Component {
    render() {
        return (
            <div className="dropdown">
                <button style={{ color: "rgba(0,0,0,.54)", fontSize: "14px", lineHeight: "16px" }} className="btn dropdown-toggle border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Phân loại hàng:
                </button>
                <ul className="dropdown-menu" style={{ width: "400px" }}>
                    <li className='p-2'>
                        <div className='d-flex flex-row bd-highlight mb-3'>
                            <p className='me-2'>Loại hàng: </p>
                            <button className='btn btn-secondary me-2'>Có thể sạc lại</button>
                            <button className='btn btn-secondary me-2'>Một bộ</button>
                        </div>
                    </li>
                    <li>
                        <div class="d-flex justify-content-evenly">
                            <button className='btn btn-light border-2' style={{ width: "140px" }}>Trở lại</button>
                            <button className='btn btn-danger' style={{ width: "140px" }}>Xác nhận</button>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

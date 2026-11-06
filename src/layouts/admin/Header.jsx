import Logo from '../../assets/admin/Logo.png';
import React, { Component } from 'react';
import LogoutButton from '../../components/user/LogoutButton';
import ActivityLogModal from '../../components/admin/ActivityLogModal';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLog: false
        };
    }


    openLog = (e) => {
        e.preventDefault();
        this.setState({ showLog: true });
    };

    closeLog = () => {
        this.setState({ showLog: false });
    };

    render() {
        return (
            <>
                <nav
                    className="app-header navbar navbar-expand bg-body mb-2"
                    id="navigation"
                >
                    <div className="container-fluid">
                        <div className="d-flex align-items-center gap-2">
                            <button
                                className="btn btn-light border d-flex align-items-center gap-1"
                                onClick={() => window.history.back()}
                            >
                                <i className="bi bi-arrow-left"></i>
                            </button>
                            <button
                                className="btn btn-light border d-flex align-items-center"
                                onClick={() => window.history.forward()}
                            >
                                <i className="bi bi-arrow-right"></i>
                            </button>

                        </div>
                        <div className='d-flex flex-column ms-2'>
                            <div>
                                <h3 className="mb-0">{this.props.title}</h3>
                            </div>
                            {/*     <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 mt-1">
                                    <li className="breadcrumb-item">
                                        <a href="/admin/inventory" className="text-decoration-none">
                                            Kho
                                        </a>
                                    </li>

                                    <li className="breadcrumb-item">
                                        HCM
                                    </li>

                                    <li className="breadcrumb-item active" aria-current="page">
                                        Phiếu xuất
                                    </li>
                                </ol>
                            </nav> */}
                        </div>
                        <ul className="navbar-nav ms-auto" role="navigation">

                            {/* 🔥 ICON ĐỒNG HỒ */}
                            <li className="nav-item position-relative">
                                <a
                                    href="#"
                                    className="nav-link d-flex align-items-center justify-content-center rounded-circle"
                                    style={{ width: "40px", height: "40px" }}
                                    onClick={this.openLog}
                                >
                                    <i className="bi bi-clock-history fs-3 text-danger"></i>
                                </a>
                            </li>



                            {/* USER MENU */}
                            <li className="nav-item dropdown user-menu">
                                <a
                                    href="#"
                                    className="nav-link dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                >
                                    <img
                                        src={Logo}
                                        className="user-image rounded-circle shadow"
                                        alt="User"
                                    />
                                    <span className="d-none d-md-inline"> Admin</span>
                                </a>

                                <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                                    <li className="user-header text-bg-primary">
                                        <img src={Logo} className="rounded-circle shadow" alt="User" />
                                        <p>
                                            Admin
                                            <small>Member since Nov. 2023</small>
                                        </p>
                                    </li>

                                    <li className="user-footer">
                                        <a href="#" className="btn btn-default btn-flat">Profile</a>
                                        <LogoutButton />
                                    </li>
                                </ul>
                            </li>

                        </ul>
                    </div>
                </nav>

                {/* 🔥 MODAL LOG */}
                {this.state.showLog && (
                    <ActivityLogModal onClose={this.closeLog} />
                )}
            </>
        );
    }
}

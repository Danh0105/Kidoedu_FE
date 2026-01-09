import Logo from '../../assets/admin/Logo.png';
import React, { Component } from 'react';
import LogoutButton from '../../components/user/LogoutButton';
import * as bootstrap from 'bootstrap';

export default class Header extends Component {

    componentDidMount() {
        // 🔥 INIT BOOTSTRAP DROPDOWN CHO SPA (React Router)
        const dropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdowns.forEach(el => {
            bootstrap.Dropdown.getOrCreateInstance(el);
        });
    }

    render() {
        return (
            <nav
                className="app-header navbar navbar-expand bg-body mb-2"
                id="navigation"
            >
                <div className="container-fluid">
                    <div>
                        <h3 className="mb-0">{this.props.title}</h3>
                    </div>

                    <ul className="navbar-nav ms-auto" role="navigation" aria-label="Navigation 2">

                        {/* Search */}
                        <li className="nav-item">
                            <a className="nav-link" href="#" role="button">
                                <i className="bi bi-search"></i>
                            </a>
                        </li>

                        {/* Messages */}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                <i className="bi bi-chat-text"></i>
                                <span className="navbar-badge badge text-bg-danger">3</span>
                            </a>

                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                                <a href="#" className="dropdown-item dropdown-footer">
                                    See All Messages
                                </a>
                            </div>
                        </li>

                        {/* Notifications */}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                <i className="bi bi-bell-fill"></i>
                                <span className="navbar-badge badge text-bg-warning">15</span>
                            </a>

                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                                <span className="dropdown-item dropdown-header">15 Notifications</span>
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item dropdown-footer">
                                    See All Notifications
                                </a>
                            </div>
                        </li>

                        {/* Fullscreen */}
                        <li className="nav-item">
                            <a className="nav-link" href="#" data-lte-toggle="fullscreen">
                                <i className="bi bi-arrows-fullscreen"></i>
                            </a>
                        </li>

                        {/* User menu */}
                        <li className="nav-item dropdown user-menu">
                            {/* 🔥 GIỮ GIAO DIỆN – CHỈ SỬA button → a */}
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

                                <li className="user-body">
                                    <div className="row">
                                        <div className="col-4 text-center"><a href="#">Followers</a></div>
                                        <div className="col-4 text-center"><a href="#">Sales</a></div>
                                        <div className="col-4 text-center"><a href="#">Friends</a></div>
                                    </div>
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
        );
    }
}

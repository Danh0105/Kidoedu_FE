import React from 'react'
import SidebarMenu from '../../components/admin/SidebarMenu';
import Logo from '../../assets/admin/Logo.png'
import { Link } from 'react-router-dom';
export default function Sidebar() {
  return (
    <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
      <div className="sidebar-brand">
        <Link to="/admin/dashboard" className="brand-link">
          <img src={Logo} alt="AdminLTE Logo" className="brand-image opacity-75 shadow" />
        </Link>
      </div>
      <div className="sidebar-wrapper" data-overlayscrollbars="host">
        <nav className="mt-2">
          <SidebarMenu />
        </nav>
      </div>
    </aside>

  )
}

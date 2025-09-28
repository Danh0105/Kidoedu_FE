import React from 'react'
import SidebarMenu from '../../components/admin/SidebarMenu';
import Logo from '../../assets/admin/Logo.png'
export default function Sidebar() {
  return (
    <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
      <div class="sidebar-brand">
        <a href="#" class="brand-link">
          <img src={Logo} alt="AdminLTE Logo" class="brand-image opacity-75 shadow" />
        </a>
      </div>
      <div className="sidebar-wrapper" data-overlayscrollbars="host">
        <nav className="mt-2">
          <SidebarMenu />
        </nav>
      </div>
    </aside>

  )
}

import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
// đảm bảo bạn đã load bootstrap.bundle.min.js ở index.html hoặc entry (có Popper)

export default function MenuCompactFixed() {
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const placeholderRef = useRef(null); // giữ chỗ khi đem menu ra body

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // helper: move menu to body & position it
    const placeMenuToBody = () => {
      const btn = btnRef.current;
      const menu = menuRef.current;
      if (!btn || !menu) return;

      // tạo placeholder để trả menu về đúng chỗ khi đóng
      if (!placeholderRef.current) {
        placeholderRef.current = document.createComment("menu-placeholder");
        menu.parentNode.insertBefore(placeholderRef.current, menu);
      }

      // Đưa menu lên body để thoát clipping của header
      document.body.appendChild(menu);

      // Tính vị trí theo viewport
      const r = btn.getBoundingClientRect();
      const offsetY = 8; // khoảng cách với nút
      menu.style.position = "fixed";
      menu.style.top = `${r.bottom + offsetY}px`;
      menu.style.left = `${r.left + r.width / 2}px`;
      menu.style.transform = "translateX(-50%)";
      menu.style.zIndex = "1080";
      menu.style.margin = "0"; // tránh margin mặc định
      menu.style.maxWidth = "min(92vw, 360px)"; // giới hạn chiều rộng
    };

    // helper: return menu back to original place & clean styles
    const returnMenu = () => {
      const menu = menuRef.current;
      if (!menu || !placeholderRef.current) return;
      placeholderRef.current.parentNode.insertBefore(menu, placeholderRef.current);
      menu.removeAttribute("style");
    };

    // Bootstrap dropdown events
    const onShown = () => placeMenuToBody();
    const onHide = () => returnMenu();

    wrap.addEventListener("shown.bs.dropdown", onShown);
    wrap.addEventListener("hide.bs.dropdown", onHide);

    // cleanup
    return () => {
      wrap.removeEventListener("shown.bs.dropdown", onShown);
      wrap.removeEventListener("hide.bs.dropdown", onHide);
      // đảm bảo trả menu về chỗ cũ nếu component unmount
      onHide();
    };
  }, []);

  return (
    <div ref={wrapRef} className="dropdown">
      {/* Trigger */}
      <button
        ref={btnRef}
        className="btn btn-light rounded-circle shadow-sm"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-display="static"         // không auto-flip
        aria-expanded="false"
        aria-label="Mở menu"
        style={{ width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        <i className="bi bi-list fs-4" aria-hidden="true" />
      </button>

      {/* Menu (sẽ được di dời lên body khi mở) */}
      <ul ref={menuRef} className="dropdown-menu shadow menu-fixed-escape">
        <li><NavLink to="/" className="dropdown-item" data-bs-dismiss="dropdown">Trang chủ</NavLink></li>
        <li><NavLink to="/store" className="dropdown-item" data-bs-dismiss="dropdown">Cửa hàng</NavLink></li>
        <li><NavLink to="/quotation" className="dropdown-item" data-bs-dismiss="dropdown">Báo giá</NavLink></li>
        <li><NavLink to="/newproduct" className="dropdown-item" data-bs-dismiss="dropdown">Sản phẩm mới</NavLink></li>
        <li><NavLink to="/featuredproducts" className="dropdown-item" data-bs-dismiss="dropdown">Sản phẩm nổi bật</NavLink></li>
        <li><NavLink to="/about" className="dropdown-item" data-bs-dismiss="dropdown">Giới thiệu</NavLink></li>

      </ul>
    </div>
  );
}

import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('Authorization') || null;
  if (typeof token === 'string' && token.trim() !== '') {
    const decoded = jwtDecode(token);
    const BASENAME = '';
    if (!decoded.role || !allowedRoles.includes(decoded.role)) {
      return window.location.href = `${BASENAME}/login`;
    }
    return children;
  }
  return window.location.href = `/login`;;
}

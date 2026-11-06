import { Navigate } from "react-router-dom";
import { getAuthInfo } from "../utils/getAuthInfo";
import { hasPermission } from "../utils/permission";

export default function PrivateRoute({
  children,
  allowedRoles,
  requiredPermissions,
}) {
  const auth = getAuthInfo();

  // ❌ Chưa đăng nhập
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Không đúng ROLE
  if (
    allowedRoles &&
    (!auth.role || !allowedRoles.includes(auth.role.name))
  ) {
    return <Navigate to="/403" replace />;
  }

  // ❌ Không đủ PERMISSION (dùng helper)
  if (
    requiredPermissions &&
    !hasPermission(requiredPermissions)
  ) {
    return <Navigate to="/403" replace />;
  }

  // ✅ OK
  return children;
}

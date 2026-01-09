import { jwtDecode } from "jwt-decode";

export function getAuthInfo() {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("access_token");
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
}

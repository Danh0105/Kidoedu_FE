import { getAuthInfo } from "./getAuthInfo";

export const hasPermission = (requiredPermissions = []) => {
    const auth = getAuthInfo();

    if (!auth || !Array.isArray(auth.permissions)) return false;

    return requiredPermissions.every((p) =>
        auth.permissions.includes(p)
    );
};

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
export const AuthService = {
    login: (token) => {
        Cookies.set('user-info', token, { expires: 7, secure: true, sameSite: 'None' });
    },
    logout: () => {
        // Xóa cookie khi người dùng đăng xuất
        Cookies.remove('user-info');
    },
    register: (token) => {
        Cookies.set('user-info', token, { expires: 7, secure: true, sameSite: 'None' });
    },
    isAuthenticated: () => {
        const token = Cookies.get("user-info");
        return !!token;
    },
    getAuthToken: () => {
        // Trả về token từ cookie
        return Cookies.get("user-info");
    },

    getUserRole: () => {
        // Trả về role từ token
        const token = Cookies.get("user-info");
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.role;
        } catch (err) {
            console.error("token kkhông hợp lệ!!", err);
            return null;
        }
    },

    isLoggedIn: () => {
        const token = Cookies.get("user-info");
        return !!token;
    },

    getUser: () => {
        // Trả về role từ token
        const token = Cookies.get("user-info");
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            console.log(decoded);
            return decoded;
        } catch (err) {
            console.error("token kkhông hợp lệ!!", err);
            return null;
        }
    },
};

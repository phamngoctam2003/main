import { Navigate } from "react-router-dom";
import { AuthService } from "../services/authservice";

const ProtectedRoute = ({ children, role }) => {
    const AuthLogin = AuthService.isLoggedIn();

    const isAuthenticated = AuthService.getUser();
    const userRole = AuthService.getUserRole();

    if(!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (!role.includes(userRole)) {
        return <Navigate to="/" replace />;
    }
    return children;
};
export default ProtectedRoute;




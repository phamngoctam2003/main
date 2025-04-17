import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { calllogin } from "../../services/api";
import { message, notification as Notification } from "antd";
import { AuthService } from "../../services/authservice";

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = AuthService.isLoggedIn();
        if (token) {
            navigate("/");
        }
    }, []);


    const [isSubmit, setIsSubmit] = useState(false);
    const onFinish = async (event) => {
        event.preventDefault();
        const { email, password } = event.target;
        setIsSubmit(true);
        const res = await calllogin(email.value, password.value);
        setIsSubmit(false);
        if (res) {
            if (res.data.status == 1) {
                console.log(res.data.role);
                onLogin(res.token);
                message.success("Đăng nhập thành công");
                const role = res.data.role;
                (role === "admin" || role === "editor" || role === "moderator") ? navigate("/dashboard") : navigate("/");
            } else {
                Notification.error({
                    message: "Tài khoản của bạn đã bị khóa",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                })
            };
        } else {
            Notification.error({
                message: "Có lỗi xảy ra",
                description: res?.message || "Vui lòng thử lại sau",
                duration: 5,
            });
        }
    };
    return (
        <>
            <div className="body-login">
                <div className="background-login" />
                <div className="login-container">
                    <h2>Đăng nhập</h2>
                    <p>
                        Bạn chưa có tài khoản?
                        <Link to="/register" style={{ color: "#4285f4" }}>
                            Đăng ký tại đây
                        </Link>
                    </p>
                    <button className="btn-google">
                        <i className="fab fa-google" /> Đăng nhập bằng Google
                    </button>
                    <div className="divider">HOẶC</div>
                    <form method="post" onSubmit={onFinish}>
                        <div className="form-outline">
                            <label htmlFor="" className="form-label">
                                Email của bạn
                            </label>
                            <input
                                placeholder="email@địa chỉ.com"
                                className="input-group"
                                type="email"
                                name="email"
                            />
                        </div>
                        <div className="form-outline">
                            <div className="auth">
                                <label htmlFor="" className="form-label df-flex">
                                    Mật khẩu
                                </label>
                                <Link className="forgot-password df-flex" to="#">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <input
                                placeholder="Yêu cầu 8+ ký tự"
                                className="input-group"
                                name="password"
                                type="password"
                            />
                        </div>
                        <div className="remember-me">
                            <input id="remember-me" type="checkbox" />
                            <label htmlFor="remember-me">Nhớ tài khoản</label>
                        </div>
                        <button className="btn-login">Đăng nhập</button>
                    </form>
                </div>
            </div>
        </>
    );
};
export default Login;

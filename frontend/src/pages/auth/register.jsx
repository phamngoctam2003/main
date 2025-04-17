import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";
import { message, notification as Notification } from "antd";
import { AuthService } from "../../services/authservice";

export const Register = ({ onRegister }) => {
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
        const { name, email, password } = event.target;
        setIsSubmit(true);
        const res = await callRegister(name.value, email.value, password.value);
        setIsSubmit(false);
        if (res) {
            onRegister(res.token);
            message.success("Đăng ký thành công");
            navigate("/");
        } else {
            Notification.error({
                message: "Có lỗi xảy ra",
                description: res?.message || "Vui lòng thử lại sau",
                duration: 5,
            });
        }
    };

    return (
        <div className="body-login">
            <div className="background-login" />
            <div className="login-container">
                <h2>Đăng Ký</h2>

                <p>
                    Đã có tài khoản? <Link to="/login" style={{ color: "#4285f4" }}>Đăng nhập tại đây</Link>
                </p>
                <button className="btn-google">
                    <i className="fab fa-google" /> Đăng ký bằng Google
                </button>
                <div className="divider">HOẶC</div>
                <form onSubmit={onFinish} method="post">
                    <div className="form-outline">
                        <label htmlFor="name" className="form-label">Họ Tên đầy đủ</label>
                        <input name="name" className="input-group" placeholder="Họ và tên" type="text" />
                    </div>
                    <div className="form-outline">
                        <label htmlFor="email" className="form-label">Email của bạn</label>
                        <input name="email" className="input-group" placeholder="email@địa chỉ.com" type="email" />
                    </div>
                    <div className="form-outline">
                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input name="password" className="input-group" placeholder="Yêu cầu 8+ ký tự" type="password" />
                    </div>
                    <div className="form-outline">
                        <label htmlFor="re_password" className="form-label">Xác nhận mật khẩu</label>
                        <input name="re_password" className="input-group" placeholder="Xác nhận mật khẩu" type="password" />
                    </div>
                    <div className="remember-me">
                        <input id="remember-me" type="checkbox" />
                        <label htmlFor="remember-me">
                            Tôi chấp nhận{" "}
                            <Link className="a-link" to="#">các điều khoản và điều kiện</Link>
                        </label>
                    </div>
                    <button type="submit" className="btn-login">Đăng ký</button>
                </form>
            </div>
        </div>
    );
};


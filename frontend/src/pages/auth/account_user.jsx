import { useEffect, useState } from "react";
import { getAccount, updatePassword, updateAccount } from "../../services/api-user";
import { AuthService } from "../../services/authservice";
import { notification as Notification } from "antd";
import { useNavigate } from 'react-router-dom';

export function Account_user() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [account, setAccount] = useState({ name: '', email: '' });
    const [userID, setUserID] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = AuthService.getUser(); 
                setUserID(user.sub);
                if (user.sub) {
                    const response = await getAccount({ id: user.sub });
                    setAccount(response || {});
                } else {
                    Notification.error({
                        message: "Có lỗi xảy ra",
                        description: res?.message || "Vui lòng thử lại sau",
                        duration: 5,
                    });
                }
            } catch (err) {
                setError(err.message || "Không thể tải dữ liệu.");
            }
        };

        fetchUser(); 
    }, []);

    const toggleChangePassword = () => {
        setShowChangePassword(!showChangePassword);
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            Notification.warning({
                message: "Mật khẩu không khớp",
                duration: 3,
            });
            return;
        }
        try {
            const response = await updatePassword({ userID, newPassword, oldPassword });
            if (response?.status === 200) {
                Notification.success({
                    message: "Cập nhật mật khẩu thành công",
                    description: response?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                Notification.error({
                    message: "Có lỗi xãy ra",
                    description: response?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });;
            }
        } catch (error) {
            Notification.error({
                message: "Lỗi trong quá trình gọi api",
                description: error.message || "Vui lòng thử lại sau",
                duration: 5,
            });
        }
    };
    const handleAccountChange = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (!formData.get('name')) {
            Notification.error({
                message: "Thông tin không đầy đủ",
                description: "Vui lòng điền đầy đủ các trường bắt buộc",
                duration: 5,
            });
            return;
        }
        try {
            const res = await updateAccount(formData);
            console.log('formData:', Object.fromEntries(formData.entries()));
            console.log('res:', res);
            if (res?.status === 200) {
                Notification.success({
                    message: "Cập nhật thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
                navigate('/');
            } else {
                Notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        } catch (error) {
            Notification.error({
                message: "Lỗi trong quá trình gọi api",
                description: error.message || "Vui lòng thử lại sau",
                duration: 5,
            });
        }
    };
    return (
        <div className="w-8/12 mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Tài Khoản</h1>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông Tin Người Dùng</h2>
                <form onSubmit={handleAccountChange} method="post">
                    <input type="hidden" name="id" value={userID} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    <div className="mb-4">
                        <label className="block text-gray-600">Họ và Tên:</label>
                        <input type="text" name="name" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600">Email:</label>
                        <input type="email" disabled className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={account.email} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600">Hình ảnh:</label>
                        <input type="file" name="image" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>

                    <div className="flex justify-between mt-6">
                        <div>
                            <button type="submit" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Lưu Thay Đổi</button>
                            <a onClick={toggleChangePassword} className="cursor-pointer bg-green-500 text-white font-semibold ml-4 py-2 px-4 rounded hover:bg-green-600">Đổi mật khẩu</a>
                        </div>
                        <a className="cursor-pointer bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600">Đăng Xuất</a>
                    </div>
                </form>

                {showChangePassword && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Đổi Mật Khẩu</h2>
                        <div className="mb-4">
                            <label className="block text-gray-600">Mật Khẩu Cũ:</label>
                            <input
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                type="password" className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Nhập mật khẩu mới" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600">Nhập Mật Khẩu Mới:</label>
                            <input
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password" className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Nhập mật khẩu mới" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600">Xác Nhận Mật Khẩu Mới:</label>
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password" className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Xác nhận mật khẩu mới" />
                        </div>
                        <button onClick={handlePasswordChange} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Lưu Mật Khẩu Mới</button>
                    </div>
                )}
            </div>
        </div>
    );
}

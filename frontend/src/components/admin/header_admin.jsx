import { useState, useEffect } from "react";
import { message, notification as Notification } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { getAccount } from "../../services/api-user";
import { AuthService } from "../../services/authservice";
const Header = ({ handleLogout }) => {
    const navigate = useNavigate();
    const [account, setAccount] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleUserLogout = ()=>{
        handleLogout();
        message.success("Đã đăng xuất");
        navigate("/login");
    }
    
    useEffect(() => {
        const fetchPostCategory = async () => {
            try {
                const getuser = AuthService.getUser(); 
                const user = await getAccount({ id: getuser.sub });
                setAccount(user);
            } catch (error) {
                Notification.error({
                    message: "Lỗi trong quá trình gọi api",
                    description: error.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        };
        fetchPostCategory();
    }, []);
    return (
        <div className="header">
            <div className="search-bar">
                <i className="fas fa-search" />
                <input type="text" placeholder="Search in front" />
            </div>
            <div className="relative inline-block text-left">
                    <button
                        type="button"
                        className="inline-flex w-full rounded-md items-center px-4 py-1 justify-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        id="menu-button"
                        aria-expanded={isOpen ? "true" : "false"}
                        aria-haspopup="true"
                        onClick={toggleMenu}
                    >
                        <img className="w-12 h-12 rounded-full" src={'http://localhost:8000/' + account.image} alt="" />
                        <p className="mx-4">{ account.name }</p>
                        <svg
                            className="-mr-1 size-6 text-gray-400 position-absolute "
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                {/* Menu dropdown */}
                {isOpen && (
                    <div
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                    >
                        <div className="py-1" role="none">
                            <Link
                                to="#"
                                className="block px-4 py-2 text-sm text-gray-700"
                                role="menuitem"
                                tabIndex={-1}
                                id="menu-item-0"
                            >
                                Account settings
                            </Link>
                            <Link
                                to="#"
                                className="block px-4 py-2 text-sm text-gray-700"
                                role="menuitem"
                                tabIndex={-1}
                                id="menu-item-1"
                            >
                                Support
                            </Link>
                            <Link
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700"
                                role="menuitem"
                                tabIndex={-1}
                                id="menu-item-2"
                            >
                                License
                            </Link>
                                <button
                                onClick={handleUserLogout}
                                    type="submit"
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                                    role="menuitem"
                                    tabIndex={-1}
                                    id="menu-item-3"
                                >
                                    Sign out
                                </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;

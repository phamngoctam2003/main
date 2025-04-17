import React, { useState, useEffect, useCallback } from "react";
import { message, notification as Notification } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { callNAV } from "../../services/api";
import { AuthService } from "../../services/authservice";
import { getAccount } from "../../services/api-user";

const UserHeader = ({ handleLogout }) => {
    const [account, setAccount] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const [category, setCategories] = useState([]);
    const [isLogin, setIslogin] = useState(false);
    const navigate = useNavigate();
    const handleUserLogout = () => {
        handleLogout();
        message.success("Đã đăng xuất");
        navigate("/login");
    }
    useEffect(() => {
        const getUser = AuthService.getUser();
        const AuthLogin = AuthService.isLoggedIn();
        if (AuthLogin && getUser.status === 1) {
            setIslogin(true);
        } else {
            setIslogin(false);
        }
    }, []);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Tìm kiếm: ${searchTerm}`);
    };
    removeEventListener;
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };
    console.log(isLogin);
    useEffect(() => {
        const fetchPostCategory = async () => {
            try {
                const getuser = AuthService.getUser();
                if (getuser && getuser.sub) {
                    const Post = await callNAV();
                    const user = await getAccount({ id: getuser.sub });
                    setAccount(user);
                    if (Post) {
                        setCategories(Array.isArray(Post) ? Post : []);
                    }
                }
            } catch (error) {
                Notification.error({
                    message: "Lỗi trong quá trình gọi api 1",
                    description: error.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        };
        fetchPostCategory();
    }, []);
    return (
        <header className="p-2 shadow-md">
            <div className="container mx-auto md:px-10 flex justify-between items-center">
                <div className="text-black text-2xl font-semibold">
                    <Link to="/"><img src="./src/assets/logo/logo.png" alt="" className="h-12" /></Link>
                </div>
                <nav className="hidden md:flex space-x-8">
                    <div className="relative group focus-within:block">
                        <Link to="/" className="hover:text-gray-300 p-3">
                            Trang Chủ
                        </Link>
                    </div>

                    <div className="relative group">
                        <Link className="p-3 hover:text-gray-300 cursor-pointer">
                            Danh Mục
                        </Link>
                        <div className="absolute left-0 hidden mt-2 space-y-2 bg-white shadow-lg rounded-lg group-hover:block focus-within:block w-48">
                            {category.map((item) => (
                                <div key={item.id}>
                                    <Link
                                        to={`/categories/${item.id}`}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                    >
                                        {item.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <Link to="/moinhat" className="hover:text-gray-300 p-3">
                            Mới Nhất
                        </Link>
                    </div>

                    <div className="relative group">
                        <Link to="/tinnong" className="hover:text-gray-300 p-3">
                            Tin Nóng
                        </Link>
                    </div>

                    <div className="relative group">
                        <Link to="/categories/22" className="hover:text-gray-300 p-3">
                            Thế Giới
                        </Link>
                    </div>
                </nav>
                <div className="relative flex">
                    <form onSubmit={handleSubmit} className="flex">
                        <input
                            value={searchTerm}
                            onChange={handleChange}
                            type="search"
                            className="relative ml-2 m-auto w-full sm:w-auto block flex-auto rounded border border-solid bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-black-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-black dark:text-black dark:placeholder:text-black dark:autofill:shadow-autofill dark:focus:border-primary"
                            placeholder="Search"
                            aria-label="Search"
                            id="exampleFormControlInput2"
                            aria-describedby="button-addon2"
                        />
                        <button type="submit">
                            <span
                                className="flex items-center whitespace-nowrap px-3 py-[0.25rem] text-surface dark:border-neutral-400 dark:text-black [&>svg]:h-5 [&>svg]:w-5"
                                id="button-addon2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                    />
                                </svg>
                            </span>
                        </button>

                    </form>
                    <div className="items-center hidden md:flex space-x-8">
                        {isLogin ?
                            <div className="">
                                <div>
                                    <button
                                        onClick={toggleDropdown}
                                        className=""
                                    >

                                        <img className="w-12 h-12 rounded-full" src={'http://localhost:8000/' + account.image} alt="" />
                                    </button>
                                </div>

                                {isOpen && (
                                    <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                                        <div className="py-1" role="menu">
                                            <Link
                                                to="account"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Quản lý tài khoản
                                            </Link>
                                            <Link
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                onClick={handleUserLogout}
                                            >
                                                Đăng xuất
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            : <Link to="/login" className="hover:text-gray-300 cursor-pointer">Đăng Nhập</Link>
                        }
                    </div>
                </div>
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-black focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-blue-700 p-4">
                    <nav className="space-y-4">
                        <Link
                            to="/"
                            className="text-white block hover:text-gray-300"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="text-white block hover:text-gray-300"
                        >
                            About
                        </Link>
                        <Link
                            to="/services"
                            className="text-white block hover:text-gray-300"
                        >
                            Services
                        </Link>
                        <Link
                            to="/contact"
                            className="text-white block hover:text-gray-300"
                        >
                            Contact
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};


export default UserHeader;
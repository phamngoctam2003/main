import { useState, useEffect, useRef } from "react";
import { callPost, destroy, updateStatus } from "../../../services/api-post";
import { notification as Notification } from "antd";;
import { AuthService } from "../../../services/authservice";
import { Link } from "react-router-dom";

export const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState(""); // lưu trạng thái lọc

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const role = AuthService.getUserRole();
        setUserRole(role);
        console.log(role);
    }, []);

    const filteredPosts = filter
        ? posts.filter((post) => post.status === filter)
        : posts;

    const [selectedPosts, setSelectedPosts] = useState([]);
    const checkPost = (e, id) => {
        setSelectedPosts((prevSelectedPosts) => {
            if (e.target.checked) {
                return [...prevSelectedPosts, id];
            } else {
                return prevSelectedPosts.filter((item) => item !== id);
            }
        });
    };
    console.log(selectedPosts);
    const hanDleDelete = async () => {
        if (selectedPosts.length === 0) {
            Notification.warning({
                message: "Không có Bài Viết nào được chọn",
                duration: 3,
            });
            return;
        }
        try {
            const res = await destroy(selectedPosts);
            console.log(selectedPosts);
            if (res?.status === 200) {
                setPosts((prevposts) => {
                    return prevposts.filter(
                        (filteredPosts) => !selectedPosts.includes(filteredPosts.id)
                    );
                });
                Notification.success({
                    message: "Xóa thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
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
        } finally {
            setIsLoading(false);
        }

        // message.success("Xóa thành công");
    };
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await callPost();
                if (res) {
                    setPosts(Array.isArray(res) ? res : []); // Lưu dữ liệu từ API vào state
                    setIsLoading(false);
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
            } finally {
                setIsLoading(false); // Đặt lại trạng thái sau khi xử lý xong (thành công hoặc lỗi)
            }
        };
        fetchData();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const res = await updateStatus({ id, status });
            if (res?.status === 200) {
                setPosts((prevPosts) => {
                    return prevPosts.map((post) => {
                        if (post.id === id) {
                            return { ...post, status };
                        }
                        return post;
                    });
                });
                Notification.success({
                    message: "Cập nhật trạng thái thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
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
    }

    if (isLoading) {
        return <p className="position-absolute m-auto">Đang tải dữ liệu...</p>;
    }
    return (
        <div className="main-content">
            <nav className="rounded-md w-full">
                <ol className="list-reset flex">
                    <li>
                        <Link
                            to="#"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Quản Lý Bài Viết
                    </li>
                </ol>
            </nav>
            <div className="flex justify-between items-center my-4">
                <h5 className="text-xl font-medium leading-tight text-primary">
                    Quản Lý Bài Viết
                </h5>

                {
                    userRole === "editor" &&
                    <Link
                        to="/dashboard/posts/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                    >
                        Thêm Bài Viết
                    </Link>
                }
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-2 px-4 bg-white">
                    <div>
                        <select
                            className="cursor-pointer items-center text-black bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 font-medium rounded-lg text-sm px-3 py-1.5 "
                            value={filter}
                            onChange={handleFilterChange}
                        >
                            <option value="">
                                Lọc Trạng Thái
                            </option>
                            <option value="draft">
                                Bản Nháp
                            </option>
                            <option value="pending">
                                Chờ duyệt
                            </option>
                            <option value="approved">
                                Đã xuất bản
                            </option>
                            <option value="rejected">
                                Loại Bỏ
                            </option>
                        </select>
                    </div>
                    <div className="py-1 flex flex-wrap-reverse">
                        {(selectedPosts.length > 0) ?
                            <button
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `Bạn có chắc chắn muốn xóa ${selectedPosts.length} bài viết này không?`
                                    );
                                    if (confirmed) {
                                        hanDleDelete();
                                    }
                                }}
                                type="button"
                                className="block rounded px-6 pb-2 mr-4 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-red-600 w-auto"
                            >
                                Delete
                            </button> : null
                        }

                        <label htmlFor="table-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="table-search-users"
                                className="block pt-2 ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-950 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search for users"
                            />
                        </div>
                    </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input
                                        checked={selectedPosts.length === filteredPosts.length}
                                        onChange={() => {
                                            if (selectedPosts.length === filteredPosts.length) {
                                                setSelectedPosts([]); // bo chon tat ca
                                            } else {
                                                setSelectedPosts(
                                                    filteredPosts.map((posts) => posts.id)
                                                ); // chon tat ca
                                            }
                                        }}
                                        id="checkbox-all-search"
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="checkbox-all-search" className="sr-only">
                                        checkbox
                                    </label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Danh Mục
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Người viết bài
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nổi Bật
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((posts) => (
                            <tr
                                key={posts.id}
                                className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            onChange={(e) => checkPost(e, posts.id)}
                                            checked={selectedPosts.includes(posts.id)}
                                            type="checkbox"
                                            className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor="checkbox-table-search-1"
                                            className="sr-only"
                                        >
                                            Checkbox
                                        </label>
                                    </div>
                                </td>
                                <th
                                    scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-slate-950"
                                >
                                    <div className="">
                                        <div className="text-base font-semibold lineclap w-60 text-limit">
                                            {posts.title}
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">{posts.category_name}</td>
                                <td className="px-6 py-4">{posts.user_name}</td>
                                <td className="px-6 py-4">
                                    <select
                                        name="status"
                                        className="cursor-pointer p-2 bg-gray-600 border border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-200 dark:focus:ring-offset-gray-200 focus:ring-2 dark:bg-gray-200 dark:border-gray-600 text-black"
                                        value={posts.status}
                                        onChange={(e) => handleStatusChange(posts.id, e.target.value)}
                                    >
                                        <option value="draft" className="cursor-pointer">
                                            Nháp
                                        </option>
                                        <option value="pending" className="cursor-pointer text-red-600">
                                            Chờ Duyệt
                                        </option>
                                        <option
                                            value="approved"
                                            className="cursor-pointer text-green-600"
                                            disabled={userRole === "editor"}
                                        >
                                            Chấp Nhận
                                        </option>
                                        <option
                                            value="rejected"
                                            className="cursor-pointer text-blue-600"
                                            disabled={userRole === "editor"}
                                        >
                                            Loại bỏ
                                        </option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    {(posts.outstanding === 1) ? (
                                        <div className="flex items-center">
                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />{" "}
                                            Yes
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2" />{" "}
                                            No
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        to={`dashboard/posts/edit/${posts.id}`}
                                        type="button"
                                        data-modal-target="editUserModal"
                                        data-modal-show="editUserModal"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

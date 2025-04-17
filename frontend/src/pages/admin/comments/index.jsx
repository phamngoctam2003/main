import { useState, useEffect, useRef } from "react";
import { destroy, callComments, updateStatus } from "../../../services/api-comment";
import { message, notification as Notification } from "antd";
import { useNavigate, Link } from "react-router-dom";

export const Comments = () => {
    const [comments, setcomments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState(""); // lưu trạng thái lọc


    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredComments = filter
        ? comments.filter((comment) => comment.status === filter)
        : comments;

    const [selectedComments, setselectedComments] = useState([]);
    // Hàm xử lý khi click vào checkbox
    const checkComment = (e, id) => {
        setselectedComments((prevselectedComments) => {
            if (e.target.checked) {
                return [...prevselectedComments, id];
            } else {
                return prevselectedComments.filter((item) => item !== id);
            }
        });
    };
    const hanDleDelete = async () => {
        if (selectedComments.length === 0) {
            Notification.warning({
                message: "Không có danh mục nào được chọn",
                duration: 3,
            });
            return;
        }
        try {
            const res = await destroy(selectedComments);
            console.log(selectedComments);
            if (res?.status === 200) {
                setcomments((prevcomments) => {
                    return prevcomments.filter(
                        (category) => !selectedComments.includes(category.id)
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
                const res = await callComments();
                console.log(res);
                if (res) {
                    setcomments(Array.isArray(res) ? res : []); // Lưu dữ liệu từ API vào state
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
                setcomments((prevComments) => {
                    return prevComments.map((comment) => {
                        if (comment.id === id) {
                            return { ...comment, status };
                        }
                        return comment;
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
                        Quản Lý Danh Mục
                    </li>
                </ol>
            </nav>
            <div className="flex justify-between items-center my-4">
                <h5 className="text-xl font-medium leading-tight text-primary">
                    Quản Lý Danh Mục
                </h5>
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
                            <option value="pending">
                                Chờ duyệt
                            </option>
                            <option value="approved">
                                Đã duyệt
                            </option>
                            <option value="rejected">
                                Loại Bỏ
                            </option>
                        </select>
                    </div>
                    <div className="py-1 flex flex-wrap-reverse">
                        {(selectedComments.length > 0) ?
                            <button
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `Bạn có chắc chắn muốn xóa ${selectedComments.length} Danh Mục này không?`
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
                                        checked={selectedComments.length === filteredComments.length}
                                        onChange={() => {
                                            if (selectedComments.length === filteredComments.length) {
                                                setselectedComments([]); // bo chon tat ca
                                            } else {
                                                setselectedComments(
                                                    filteredComments.map((comment) => comment.id)
                                                ); // chon tat ca
                                            }
                                        }}
                                        id="checkbox-all-search"
                                        type="checkbox"
                                        className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="checkbox-all-search" className="sr-only">
                                        checkbox
                                    </label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên Người Dùng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Mô Tả
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComments.map((comment) => (
                            <tr
                                key={comment.id}
                                className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            onChange={(e) => checkComment(e, comment.id)}
                                            checked={selectedComments.includes(comment.id)}
                                            type="checkbox"
                                            className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor="checkbox-table-search-1"
                                            className="sr-only"
                                        >
                                            checkbox
                                        </label>
                                    </div>
                                </td>
                                <th
                                    scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-slate-950"
                                >
                                    <img className="w-12 h-12 rounded-full" src={'http://localhost:8000/' + comment.user.image} alt="" />
                                    <div className="ps-3">
                                        <div className="text-base font-semibold">
                                            {comment.user.name}
                                        </div>
                                        <div className="font-normal text-gray-500">
                                            {comment.user.email}
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">{comment.content}</td>
                                <td className="px-6 py-4">
                                    <select
                                        name="status"
                                        className="cursor-pointer p-2 bg-gray-600 border border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-200 dark:focus:ring-offset-gray-200 focus:ring-2 dark:bg-gray-200 dark:border-gray-600 text-black"
                                        value={comment.status}
                                        onChange={(e) => handleStatusChange(comment.id, e.target.value)}
                                    >
                                        <option value="pending" className="cursor-pointer text-red-600">
                                            Chờ Duyệt
                                        </option>
                                        <option
                                            value="approved"
                                            className="cursor-pointer text-green-600"
                                        >
                                            Chấp Nhận
                                        </option>
                                        <option
                                            value="rejected"
                                            className="cursor-pointer text-blue-600"
                                        >
                                            Loại bỏ
                                        </option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    {/* Modal toggle */}
                                    <Link
                                        to={`dashboard/comments/edit/${comment.id}`}
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

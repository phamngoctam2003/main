import { useState, useEffect, useRef } from "react";
import { callTag, destroy } from "../../../services/api-tag";
import { message, notification as Notification } from "antd";
import { AuthService } from "../../../services/authservice";
import { Link } from "react-router-dom";


export const Tags = () => {

    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedTags, setSelectedTags] = useState([]);

    const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const role = AuthService.getUserRole();
        setUserRole(role);
        console.log(role);
    }, []);

    const checkTag = (e, id) => {
        setSelectedTags((prevSelectedTags) => {
            if (e.target.checked) {
                return [...prevSelectedTags, id];
            } else {
                return prevSelectedTags.filter((item) => item !== id);
            }
        });
    };
    const hanDleDelete = async (e) => {
        e.preventDefault();
        if (selectedTags.length === 0) {
            Notification.warning({
                message: "Không có danh mục nào được chọn",
                duration: 3,
            });
            return;
        }
        try {
            const res = await destroy(selectedTags);
            console.log(selectedTags);
            if (res?.status === 200) {
                setTags((prevTags) => {
                    return prevTags.filter(
                        (tag) => !selectedTags.includes(tag.id)
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
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await callTag();
                if (res) {
                    setTags(Array.isArray(res) ? res : []); // Lưu dữ liệu từ API vào state
                    setIsLoading(false);
                    console.log(res);
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
                        Quản Lý Thẻ
                    </li>
                </ol>
            </nav>
            <div className="flex justify-between items-center my-4">
                <h5 className="text-xl font-medium leading-tight text-primary">
                    Quản Lý Thẻ
                </h5>
                {
                    userRole === "editor" &&
                    <Link
                        to="/dashboard/tags/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                    >
                        Thêm Thẻ
                    </Link>
                }
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-2 px-4 bg-white">
                    <div>
                        <button
                            id="dropdownActionButton"
                            data-dropdown-toggle="dropdownAction"
                            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                            type="button"
                        >
                            <span className="sr-only">Action button</span>
                            Action
                            <svg
                                className="w-2.5 h-2.5 ms-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="py-1 flex flex-wrap-reverse">
                        {(selectedTags.length > 0) ?
                            <button
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `Bạn có chắc chắn muốn xóa ${selectedTags.length} Thẻ này không?`
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
                                        checked={selectedTags.length === tags.length}
                                        onChange={() => {
                                            if (selectedTags.length === tags.length) {
                                                setSelectedTags([]); // bo chon tat ca
                                            } else {
                                                setSelectedTags(
                                                    tags.map((tags) => tags.id)
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
                        {tags.map((tag) => (
                            <tr
                                key={tag.id}
                                className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            onChange={(e) => checkTag(e, tag.id)}
                                            checked={selectedTags.includes(tag.id)}
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                                    <div className="ps-3">
                                        <div className="text-base font-semibold">
                                            {tag.name}
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">{tag.description}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />{" "}
                                        Online
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {/* Modal toggle */}
                                    <Link
                                        to={`dashboard/tags/edit/${tag.id}`}
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
                {/* Edit user modal */}

            </div>
        </div>
    )
};
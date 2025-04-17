import { create } from "../../../services/api-tag";
import { message, notification as Notification } from "antd";
import { useNavigate, Link } from "react-router-dom";

export const CreateTag = () => {
    const navigate = useNavigate();
    const handSubmit = async (e) => {
        e.preventDefault();
        const { name } = e.target;
        try {
            const res = await create( name.value);
            if (res?.status === 200) {
                Notification.success({
                    message: "Thêm thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
                navigate("/dashboard/tags");
                name.value = "";
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

    return (
        <div className="main-content">
        <nav className="rounded-md w-full">
            <ol className="list-reset flex">
                <li>
                    <Link
                        to="/dashboard"
                        className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                    >
                        Dashboard
                    </Link>
                </li>
                <li>
                    <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                        /
                    </span>
                </li>
                <li>
                    <Link
                        to="dashboard/tags"
                        className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                    >
                        Quản Lý Thẻ
                    </Link>
                </li>
                <li>
                    <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                        /
                    </span>
                </li>
                <li className="text-neutral-500 dark:text-neutral-400">
                    Thêm Thẻ
                </li>
            </ol>
        </nav>
        <div className="flex justify-between items-center my-4">
            <h5 className="text-xl font-medium leading-tight text-primary">
                Thêm Thẻ
            </h5>
        </div>
        <form onSubmit={handSubmit} className="max-w-sm mt-5" method="post">
            <div className="mb-5">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Thẻ</label>
                <input type="name" name="name" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    </div>
    )
};
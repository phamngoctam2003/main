import { create } from "../../../services/api-post";
import { callTag } from "../../../services/api-tag";
import { callCategory } from "../../../services/api";
import { message, notification as Notification } from "antd";
import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";


export const CreatePost = () => {
    const navigate = useNavigate();
    const [editorData, setEditorData] = useState('<p>Hello</p>');

    const [user_id, setUser] = useState(null);
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [content, setContent] = useState('');

    const token = Cookies.get('user-info');

    useEffect(() => {
        const fetchData = async () => {
            // lấy thông tin danh mục
            const categoryRes = await callCategory();
            setCategory(categoryRes);

            // lấy thông tin tag
            const tagRes = await callTag();
            setTags(tagRes);

            // lấy thông tin user từ token
            if (token) {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.sub; // truy cập ID người dùng
                setUser(userId);
            } else {
                console.log('Token không tồn tại');
            }
        };
        fetchData();
    }, []);


    // tag
    const handleTagChange = (event) => {
        const tagId = event.target.value;
        setSelectedTags((prevTags) => {
            if (prevTags.includes(tagId)) {
                return prevTags.filter((id) => id !== tagId);
            } else {
                return [...prevTags, tagId];
            }
        });
    };

    const handSubmit = async (e) => {
        e.preventDefault();
        const { title, category_id, image, outstanding, content, short_content } = e.target;

        if (!title.value || !category_id.value || !content.value) {
            Notification.error({
                message: "Thông tin không đầy đủ",
                description: "Vui lòng điền đầy đủ các trường bắt buộc",
                duration: 5,
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', title.value);
        formData.append('category_id', category_id.value);
        formData.append('outstanding', outstanding.value);
        formData.append('short_content', short_content.value);
        formData.append('content', content);
        formData.append('user_id', user_id);
        if (image.files[0]) {
            formData.append('image', image.files[0]);
        }
        if (selectedTags.length > 0) {
            selectedTags.forEach(tag => {
                formData.append('tags[]', tag); // Append từng tag
            });
        } else {
            console.error('Không có tag nào được chọn');
            return;
        }

        try {
            const res = await create(formData);
            if (res?.status === 200) {
                Notification.success({
                    message: "Thêm thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
                navigate("/dashboard/posts");
                // e.target.reset();
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
                            to="dashboard/posts"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Lý Bài Viết
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Thêm Bài Viết
                    </li>
                </ol>
            </nav>
            <div className="flex justify-between items-center my-4">
                <h5 className="text-xl font-medium leading-tight text-primary">
                    Thêm Bài Viết
                </h5>
            </div>
            <form onSubmit={handSubmit} className="max-w-sm mt-5" method="post">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu Đề bài viết</label>
                    <input type="text" name="title" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"/>
                </div>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Danh Mục</label>
                    <select name="category_id" id="" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                        <option value="0">Chọn Danh Mục</option>
                        {category.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="">Chọn Thẻ:</label>
                    {tags.map((tag) => (
                        <div key={tag.id}>
                            <input
                                type="checkbox"
                                value={tag.id}
                                onChange={handleTagChange}
                            />
                            <label>{tag.name}</label>
                        </div>
                    ))}
                </div>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hình Ảnh</label>
                    <input type="file" name="image" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                </div>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nổi Bật</label>
                    <input type="checkbox" name="outstanding" value={0} />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nội Dung Ngắn</label>
                    <textarea type="text" id="short_content " name="short_content" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nội Dung</label>
                    <textarea type="text" id="content " name="content" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
    )
}
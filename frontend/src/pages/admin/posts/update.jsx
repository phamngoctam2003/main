import { update, callPost } from "../../../services/api-post";
import { callCategory } from "../../../services/api";
import { message, notification as Notification } from "antd";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { callTag } from "../../../services/api-tag";
import { callPostTag } from "../../../services/api-post-tag";

export const UpdatePost = () => {
    const Navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const { id } = useParams();
    const [posts, setpostsId] = useState({});
    const [categoryMap, setCategory] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const categoryRes = await callCategory();
            setCategory(categoryRes);

            const tagRes = await callTag();
            setTags(tagRes);

            // Gọi API để lấy các tag tương ứng với bài viết
            const tagRes1 = await callPostTag(id);
            if (tagRes1 && Array.isArray(tagRes1)) {
                setSelectedTags(tagRes1.map(tag => tag.tag_id)); // Cập nhật selectedTags
            }
        };
        fetchData();
    }, []);

    // tag
    const handleTagChange = (event) => {
        const tagId = parseInt(event.target.value);
        setSelectedTags((prevTags) => {
            if (prevTags.includes(tagId)) {
                return prevTags.filter((id) => id !== tagId);
            } else {
                return [...prevTags, tagId];
            }
        });
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await callPost(id); // Gọi API để lấy bài viết
            if (res) {
                setpostsId({
                    title: res.title || '',
                    content: res.content || '',
                    image: res.image || '',
                    category_id: res.category_id || '',
                    outstanding: res.outstanding || '',
                    short_content: res.short_content || '',
                });

            } else {
                console.error("Failed to fetch post data.");
            }
        };
        fetchPosts();
    }, [id]);

    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (!formData.get('title') || !formData.get('category_id') || !formData.get('content') || !formData.get('short_content')) {
            Notification.error({
                message: "Thông tin không đầy đủ",
                description: "Vui lòng điền đầy đủ các trường bắt buộc",
                duration: 5,
            });
            return;
        }
        formData.append('outstanding', posts.outstanding === 1 ? 1 : 0);
        if (selectedTags.length > 0) {
            selectedTags.forEach(tagId => {
                formData.append('tags[]', tagId); 
            });
        }
        try {
            const res = await update(formData, id);
            console.log('formData:', Object.fromEntries(formData.entries()));

            if (res?.status === 200) {
                Notification.success({
                    message: "Cập nhật thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
                Navigate('/dashboard/posts');
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
                        Cập nhật Bài Viết
                    </li>
                </ol>
            </nav>
            <div className="flex justify-between items-center my-4">
                <h5 className="text-xl font-medium leading-tight text-primary">
                    Cập nhật Bài Viết
                </h5>
            </div>
            <form onSubmit={handSubmit} className="max-w-sm mt-5" method="post">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu Đề Bài Viết</label>
                    <input type="text" name="title" id="name" defaultValue={posts.title} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <select value={posts.category_id} name="category_id" onChange={(e) => setpostsId({ ...posts, category_id: e.target.value })} id="" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                    <option value="0">Chọn Danh Mục</option>
                    {categoryMap.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <div>
                    <label htmlFor="">Chọn Thẻ:</label>
                    {tags.map((tag) => (
                        <div key={tag.id}>
                            <input
                                type="checkbox"
                                value={tag.id}
                                checked={selectedTags.includes(tag.id)} // So sánh với selectedTags
                                onChange={handleTagChange}
                            />
                            <label htmlFor={tag.id}>{tag.name}</label>
                        </div>
                    ))}
                </div>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nổi Bật</label>
                    <input type="checkbox" name="outstanding" value={posts.outstanding} checked={posts.outstanding === 1} onChange={(e) => setpostsId({ ...posts, outstanding: e.target.checked ? 1 : 0 })} />
                </div>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hình Ảnh</label>
                    <input type="file" name="image" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                </div>
                <div className="mb-5">
                    <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nội Dung Ngắn</label>
                    <textarea type="text" value={posts.short_content} onChange={(e) => setpostsId({ ...posts, short_content: e.target.value })} id="short_content" name="short_content" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                </div>
                <div className="mb-5">
                    <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nội Dung</label>
                    <textarea type="text" value={posts.content} onChange={(e) => setpostsId({ ...posts, content: e.target.value })} id="description" name="content" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
    );
}
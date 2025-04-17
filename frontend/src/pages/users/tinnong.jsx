import { useParams, Link } from 'react-router-dom';
import { callAllTagHot } from "../../services/api-post-tag";
import { useEffect, useState } from "react";

const TinNong = () => {
    const [posts, setPosts] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const Post = await callAllTagHot(4);
                console.log(Post);
                if (Post) {
                    setPosts(Array.isArray(Post) ? Post : []);
                }
            } catch (error) {
                Notification.error({
                    message: "Lỗi trong quá trình gọi api",
                    description: error.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        };
        fetchPost();
    }, []);
    return (
        <div className="w-ppt mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Tin Nóng</h1>
                <p className="text-lg text-gray-600 mt-2">Tin Tức Nóng Cập Nhật Trong Ngày</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-5">
                {posts.map((post) => (
                    <div key={post.id} className="flex postlimit">
                        <img
                        src={'http://localhost:8000/' + post.image}
                            alt={post.title}
                            className="w-4/12 h-48 object-cover rounded-md"
                        />
                        <div className="flex flex-col w-8/12 ml-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {post.title}
                            </h2>
                            <p className="text-gray-600 my-2">{post.content}</p>
                            <Link
                                to={`detail/${post.id}`}
                                className="text-blue-600 block hover:underline mt-auto"
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TinNong;

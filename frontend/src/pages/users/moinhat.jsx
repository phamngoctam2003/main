import { useParams, useNavigate, Link  } from 'react-router-dom';
import { callPostFull, updateViewCount } from "../../services/api-post";
import { useEffect, useState } from "react";
import { message, notification as Notification } from "antd";

const Moinhat = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const Post = await callPostFull();
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

    const handleViewPost = async (postId) => {
        try {
            await updateViewCount(postId); 
            navigate(`/detail/${postId}`); 
        } catch (error) {
            Notification.error({
                message: "Lỗi khi cập nhật lượt xem",
                description: error.message || "Vui lòng thử lại sau",
                duration: 5,
            });
        }
    };
    return (
        <div className="w-ppt ml-1 mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Mới Nhất</h1>
                <p className="text-lg text-gray-600 mt-2">Tin Tức vừa cập nhật vài giờ qua</p>
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
                            <button
                                onClick={() => handleViewPost(post.id)}
                                className="text-blue-600 block hover:underline mt-auto text-start w-full"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Moinhat;


import { useNavigate, Link } from 'react-router-dom';
import { postLimit8, updateViewCount } from "../../services/api-post";
import { useEffect, useState } from "react";
import { notification as Notification } from "antd";

const Navigation = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const Post = await postLimit8();
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
        <div className="gap-5 w-3/12 md:block mt-4">
            <div className="sticky top-0">
                <div className="w-auto">
                    <Link
                        to="#"
                        className="text-white bg-black p-3 w-full block text-center"
                    >
                        Bài viết phổ biến
                    </Link>
                </div>
                <div className="flex mt-2 flex-col gap-2">
                    <div className="grid grid-cols-1 gap-2">
                        <ul className="space-y-3 itemphobien">
                            {posts.map((post) => (
                                <li key={post.id} onClick={()=> handleViewPost(post.id)} className="flex bg-white shadow cursor-pointer hover:bg-gray-100">
                                    <img
                                        src={'http://localhost:8000/' + post.image}
                                        alt={post.title}
                                        className="w-1/3 object-cover"
                                    />
                                    <div className='flex flex-col ml-2'>
                                        <h3 className="font-semibold">{post.title}</h3>
                                        <p className="text-gray-500 text-sm text-start block mt-auto">{new Date(post.updated_at).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Navigation;

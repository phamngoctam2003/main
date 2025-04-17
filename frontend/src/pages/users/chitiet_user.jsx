import { useParams, Link } from 'react-router-dom';
import { getDetail, createComment } from "../../services/api-post";
import { useEffect, useState } from "react";
import { message, notification as Notification } from "antd";

export default function Chitiet_user() {
    const [updateCount, setUpdateCount] = useState(0);
    const [content, setContent] = useState('');
    const [posts, setPost] = useState("");
    const { id } = useParams();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const Post = await getDetail(id);
                if (Post) {
                    setPost(Post);
                }
            } catch (error) {
                console.error("Lỗi trong quá trình gọi api", error);
            }
        };
        fetchPost();
    }, [id, updateCount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createComment({ post_id: posts.id, content });
            if (res?.status === 200) {
                message.success("Bình luận thành công");
                setContent('');
                setUpdateCount((prev) => prev + 1); 
            } else {
                Notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        } catch (error) {
            console.error("Lỗi trong quá trình gọi api", error);
            Notification.error({
                message: "Có lỗi xảy ra",
                description: "Vui lòng thử lại sau",
                duration: 5,
            });
        }
    };
    return (
        <>
            <div className="flex flex-col w74px">
                <div className="">
                    <h1 className="text-3xl font-bold mb-4">
                        {posts.title}
                    </h1>
                    <p className="mt-8 text-sm text-gray-500">
                        Tác giả: {posts.user_name}
                    </p>
                    <p className="text-gray-500 mb-6">{new Date(posts.updated_at).toLocaleDateString('vi-VN')}</p>
                    <img
                        src={'http://localhost:8000/' + posts.image}
                        alt={posts.title}
                        className="w-100 m-auto h-auto rounded-md mb-6 shadow-lg"
                    />
                    <div className="text-lg text-gray-700 leading-relaxed">
                        {posts.content}
                    </div>
                </div>

                <div className="w-3/4 p-4 bg-gray-100 mt-8">
                    <h2 className="text-2xl font-bold mb-4">Bình luận</h2>
                    <div className="max-w-md pb-4 bg-gray-100 rounded-lg mt-8">
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Nhập bình luận..."
                                required
                                className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            />
                            <button type="submit" className="mt-3 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 transition duration-200">
                                Gửi
                            </button>
                        </form>
                    </div>
                    {posts.comments?.map((comment) => (
                        <div key={comment.id} className="flex p-4 bg-white mb-4">
                            <p className="text-gray-900 font-bold">{comment.user.name}</p>
                            <p className="text-gray-700">: {comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

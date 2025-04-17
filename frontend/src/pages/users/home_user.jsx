import { getFeatured, getCategoryTravel, updateViewCount } from "../../services/api-post";
import { callTagHot } from "../../services/api-post-tag";
import { message, notification as Notification } from "antd";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Home_user() {
    const [posts, setPosts] = useState([]);
    const [tagHot, setSetTaghot] = useState([]);
    const [postTravel, setSetTravel] = useState([]);
    const [postCongNghe, setSetCongNghe] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featuredPosts, hotTags, travelPosts, techPosts] = await Promise.all([
                    getFeatured(),
                    callTagHot(4),
                    getCategoryTravel(9),
                    getCategoryTravel(13),
                ]);
    
                setPosts(Array.isArray(featuredPosts) ? featuredPosts : []);
                setSetTaghot(Array.isArray(hotTags) ? hotTags : []);
                setSetTravel(Array.isArray(travelPosts) ? travelPosts : []);
                setSetCongNghe(Array.isArray(techPosts) ? techPosts : []);
            } catch (error) {
                Notification.error({
                    message: "Lỗi trong quá trình gọi api",
                    description: error.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        };
    
        fetchData();
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
        <>
            <div className="flex gap-5">
                <div className="grid-ttp">
                    {posts.map((post) => (
                        <ul className="space-y-4 first-ppt" key={post.id}>
                            <li onClick={() => handleViewPost(post.id)} className="bg-white cursor-pointer hover:bg-gray-100">
                                    <img
                                        src={'http://localhost:8000/' + post.image}
                                        className="w-full"
                                        alt=""
                                    />
                                    <div className="text-content">
                                        <h3 className="">{post.title}</h3>
                                    </div>
                            </li>
                        </ul>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w74px w-full gap-3 mt-4">
                <div className="gap-5 rounded">
                    <div className="border-b-2 border-b-blue-600 w-auto block">
                        <Link
                            to="#"
                            className="text-white bg-blue-500 p-3 block w-32 text-center"
                        >
                            Tin Nóng
                        </Link>
                    </div>
                    <div className="flex gap-5 my-2">
                        <div className="grid-tt-3">
                            {tagHot.map((tag) => (
                                <ul className="space-y-4 first-3" key={tag.id}>
                                        <li onClick={() => handleViewPost(tag.id)} className="cursor-pointer hover:bg-gray-100 flex gap-3">
                                            <img
                                                src={'http://localhost:8000/' + tag.image}
                                                className="w-2/5"
                                                alt=""
                                            />
                                            <div className="content1">
                                                <h3 className="text-2xs font-semibold sm:text-xs md:text-sm lg:text-lg limit">
                                                    {tag.title}
                                                </h3>
                                                <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg limit">
                                                    {tag.content}
                                                </p>
                                            </div>
                                        </li>
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>
                {/* 2222 */}
                <div className="gap-5 my-2">
                    <div className="border-b-2 border-b-blue-600 w-auto block">
                        <Link
                            
                            className="text-white bg-blue-500 p-3 block w-32 text-center"
                        >
                            Du lịch
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-5 my-2">
                        {postTravel.map((travel) => (
                            <div
                            onClick={() => handleViewPost(travel.id)}
                                key={travel.id}
                                className="flex gap-3 first-list cursor-pointer hover:bg-gray-100"
                            >
                                <img
                                    src={'http://localhost:8000/' + travel.image}
                                    className="w-2/5 object-cover"
                                    alt=""
                                />
                                <div className="flex flex-col">
                                    <h3 className="text-2xs font-semibold sm:text-xs md:text-sm lg:text-lg travel">
                                        {travel.title}
                                    </h3>
                                    <div className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg travel">
                                        <p>{travel.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 33333 */}
                <div className="gap-5 rounded">
                    <div className="border-b-2 border-b-blue-600 w-auto block">
                        <Link
                            to="#"
                            className="text-white bg-blue-500 p-3 block w-32 text-center"
                        >
                            Công Nghệ
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-5 my-2">
                        {postCongNghe.map((congNghe) => (
                            <div onClick={() => handleViewPost(congNghe.id)} className="mt-2 gap-3 h-auto cursor-pointer congnghe" key={congNghe.id}>
                                    <img
                                        src={'http://localhost:8000/' + congNghe.image}
                                        className="w-full img-congnghe"
                                        alt=""
                                    />
                                    <h2 className="text-2xs font-semibold sm:text-xs md:text-sm lg:text-lg limit">
                                        {congNghe.title}
                                    </h2>
                                <p className="text-gray-500 mb-4">20/10/2055</p>
                                <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg congnghe-content">
                                    {congNghe.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

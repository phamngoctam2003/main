import { useState, useEffect } from "react";
import { countPosts } from "../../services/api-post";
import { countComments } from "../../services/api-comment";
import { Link } from "react-router-dom";
const Home = () => {
    const [counts, setcountPosts] = useState([]);
    const [countscomment, setcountComments] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await countPosts();
                const rescomment = await countComments();
                setcountPosts(response);
                setcountComments(rescomment);
            } catch (error) {
                console.log("Lỗi khi gọi api: ", error);
            };
        };
        fetchData();
    }, []);
    return (
        <div className="main-content">
            <div className="stats">
                <div className="stat-card">
                    <h3>Tất cả bài viết</h3>
                    <h2>{counts.total_posts}</h2>
                    <div className="change positive">
                        <i className="fas fa-arrow-up" />
                        <span>12.5% from 70,104</span>
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Bài viết đã xuất bản</h3>
                    <h2>{counts.total_approved_posts}</h2>
                    <div className="change positive">
                        <i className="fas fa-arrow-up" />
                        <span>1.7% from 29.1%</span>
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Lượt bình luận</h3>
                    <h2>{ countscomment.total_approved_comments }</h2>
                    <div className="change negative">
                        <i className="fas fa-arrow-down" />
                        <span>4.4% from 61.2%</span>
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Lượt xem</h3>
                    <h2>{counts.total_views}</h2>
                    <div className="change">
                        <span>0.0% from 2,913</span>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="card">
                    <h3>Import data into Front Dashboard</h3>
                    <p>
                        See and talk to your users and leads immediately by
                        importing your data into the Front Dashboard platform.
                    </p>
                    <h4>Import users from:</h4>
                    <div className="import-item">
                        <div>
                            <img
                                src="https://placehold.co/30x30"
                                alt="Capsule logo"
                            />
                            <span>Capsule</span>
                        </div>
                        <button className="import-button">
                            Launch importer{" "}
                            <i className="fas fa-external-link-alt" />
                        </button>
                    </div>
                    <div className="import-item">
                        <div>
                            <img
                                src="https://placehold.co/30x30"
                                alt="Mailchimp logo"
                            />
                            <span>Mailchimp</span>
                        </div>
                        <button className="import-button">
                            Launch importer{" "}
                            <i className="fas fa-external-link-alt" />
                        </button>
                    </div>
                    <div className="import-item">
                        <div>
                            <img
                                src="https://placehold.co/30x30"
                                alt="Webdev logo"
                            />
                            <span>Webdev</span>
                        </div>
                        <button className="import-button">
                            Launch importer{" "}
                            <i className="fas fa-external-link-alt" />
                        </button>
                    </div>
                    <Link className="sync-link" to="#">
                        Or you can sync data to Front Dashboard to ensure your
                        data is always up-to-date.
                    </Link>
                </div>
                <div className="card">
                    <h3>Monthly expenses</h3>
                    <div className="tabs">
                        <div className="tab active">This week</div>
                        <div className="tab">Last week</div>
                    </div>
                    <h2>35%</h2>
                    <div className="change positive">
                        <i className="fas fa-arrow-up" />
                        <span>25.3%</span>
                    </div>
                    <div className="legend">
                        <div className="legend-item new">
                            <div className="dot" />
                            <span>New</span>
                        </div>
                        <div className="legend-item overdue">
                            <div className="dot" />
                            <span>Overdue</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;
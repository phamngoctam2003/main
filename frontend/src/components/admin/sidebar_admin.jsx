import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthService } from "../../services/authservice";
const Sidebar = () => {
    const location = useLocation();
    const [activerItem, setactiverItem] = useState(location.pathname);

    const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const role = AuthService.getUserRole();
        setUserRole(role);
        console.log(role);
    }, []);

    const handleMenuItemClick = (item) => {
        setactiverItem(item);
    };
    return (
        <div className="sidebar">
            <h1>Front</h1>
            <div className={`menu-item ${activerItem === '/dashboard' ? 'active' : ''}`}
                onClick={() => handleMenuItemClick('/dashboard')}
            >
                <i className="fas fa-tachometer-alt" />
                <Link href="/dashboard">
                    <span>Dashboards</span>
                </Link>
            </div>
            <div className={`menu-item ${activerItem === '/dashboard/categories' ? 'active' : ''}`}
                onClick={() => handleMenuItemClick('/dashboard/categories')}
            >
                <i className="fas fa-file-alt" />
                <Link href="/dashboard/categories">
                    <span>Danh Mục bài viết</span>
                </Link>
            </div>
            <div className={`menu-item ${activerItem === '/dashboard/tags' ? 'active' : ''}`}
                onClick={() => handleMenuItemClick('/dashboard/tags')}
            >
                <i className="fas fa-file-alt" />
                <Link href="/dashboard/tags">
                    <span>Quản lý Thẻ</span>
                </Link>
            </div>
            <div className={`menu-item ${activerItem === '/dashboard/posts' ? 'active' : ''}`}
                onClick={() => handleMenuItemClick('/dashboard/posts')}
            >
                <i className="fas fa-th" />
                <Link href="/dashboard/posts">
                    <span>Quản Lý Bài Viết</span>
                </Link>
            </div>
            {userRole === "admin" &&
                <>
                    <div className={`menu-item ${activerItem === '/dashboard/accounts' ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick('/dashboard/accounts')}
                    >
                        <Link href="/dashboard/accounts">
                            <i className="fas fa-home" />
                            <span>Quản lý tài khoản</span>
                        </Link>
                    </div>
                    <div className={`menu-item ${activerItem === '/dashboard/comments' ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick('/dashboard/comments')}
                    >
                        <Link href="/dashboard/comments">
                            <i className="fas fa-home" />
                            <span>Quản lý Bình Luận</span>
                        </Link>
                    </div>
                </>
            }
        </div>
    );
};

export default Sidebar;

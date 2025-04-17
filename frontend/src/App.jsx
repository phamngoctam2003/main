import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { AuthService } from "./services/authservice";
import ProtectedRoute from "./services/ProtectedRoute";
import Home from "./pages/admin/home_admin";
import Header from "./components/admin/header_admin";
import Footer from "./components/admin/footer_admin";
import Sidebar from "./components/admin/sidebar_admin";
import UserHeader from "./components/users/header_user";
import UserFooter from "./components/users/footer_user";
import Login from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import Notfound404 from "./components/notfound404";
import { Outlet } from "react-router-dom";
import HomeUser from "./pages/users/home_user";
import Navigation from "./components/users/nav_user";
import Chitiet_user from "./pages/users/chitiet_user";
import CategoryPage from "./pages/users/danhmuc_user";
import Moinhat from "./pages/users/moinhat";
import TinNong from "./pages/users/tinnong";
import { Categories } from "./pages/admin/categories";
import { CreateCategory } from "./pages/admin/categories/create";
import { UpdateCategory } from "./pages/admin/categories/update";
import { Posts } from "./pages/admin/posts";
import { UpdatePost } from "./pages/admin/posts/update";
import { CreatePost } from "./pages/admin/posts/create";
import { Tags } from "./pages/admin/tags";
import { CreateTag } from "./pages/admin/tags/create";
import { UpdateTag } from "./pages/admin/tags/update";
import { Accounts } from "./pages/admin/accounts";
import { Comments } from "./pages/admin/comments";
import { UpdateComment } from "./pages/admin/comments/update";
import { Account_user } from "./pages/auth/account_user";

const handleLogout = () => {
  AuthService.logout();
};

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Header handleLogout={handleLogout} />
      <Sidebar />
      <Outlet />
      <Footer />
    </div>
  );
};
const UserLayout = () => {
  return (
    <div className="user-layout">
      <UserHeader handleLogout={handleLogout} />
      <div className="my-5 m-auto flex h-auto py-5">
        <div className="min-h-screen px-8 container m-auto flex flex-wrap">
          <Outlet />
          <Navigation />
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

function App() {
  const [isAuthenticated, setAuthenticated] = useState(
    AuthService.isAuthenticated()
  );
  const handleLogin = (token) => {
    AuthService.login(token);
    setAuthenticated(true);
  };

  const handleRegister = (token) => {
    AuthService.register(token);
    setAuthenticated(true);
  };

  const router = createBrowserRouter(
    [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute role={['admin', 'editor', 'moderator']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        errorElement: <Notfound404 />,
        children: [{ index: true, element: <Home /> },
          {
            path: "categories",
            element: <Categories />,
          },
          {
            path: "categories/create",
            element: <CreateCategory />,
          },
          {
            path: "categories/edit/:id",
            element: <UpdateCategory />,
          },
          {
            path: "posts",
            element: <Posts />,
          },
          {
            path: "posts/edit/:id",
            element: <UpdatePost />,
          },
          {
            path: "posts/create",
            element: <CreatePost />,
          },
          {
            path: "tags",
            element: <Tags />,
          },
          {
            path: "tags/create",
            element: <CreateTag />,
          },
          {
            path: "tags/edit/:id",
            element: <UpdateTag />,
          },
          {
            path: "accounts",
            element: <Accounts />,
          },
          {
            path: "comments",
            element: <Comments />,
          },
          {
            path: "comments/edit/:id",
            element: <UpdateComment />,
          },

          
        ],
      },
      {
        path: "/",
        element: <UserLayout />,
        errorElement: <Notfound404 />,
        children: [
          { index: true, element: <HomeUser /> },
          {
            path: "categories/:id",
            element: <CategoryPage />,
          },
          {
            path: "detail/:id",
            element: <Chitiet_user />,
          },
          {
            path: "moinhat",
            element: <Moinhat />,
          },
          {
            path: "tinnong",
            element: <TinNong />,
          },
          {
            path: "account",
            element: <Account_user />,
          },
        ],
      },
      {
        path: "/login",
        element: <Login onLogin={handleLogin}/>,
      },
      {
        path: "/register",
        element: <Register onRegister={handleRegister} />,
      },
    ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );

  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}

export default App;

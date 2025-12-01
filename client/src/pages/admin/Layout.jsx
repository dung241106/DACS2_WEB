import React, { useEffect } from "react";
import AdminNavBar from "../../components/admin/AdminNavBar";
import { Outlet } from "react-router-dom";
// Bạn đang import AdminSideBar từ file riêng của nó, đây là cách làm đúng
import AdminSideBar from "../../components/admin/AdminSideBar";
import { useAppContext } from "../../context/Appcontext";
import Loading from "../../components/Loading";

// Bạn không cần import 'assets' ở đây nữa
// vì 'assets' đã được dùng bên trong file AdminSideBar.jsx
// import { assets } from "../../assets/assets";

const Layout = () => {
  const { isAdmin, fetchIsAdmin } = useAppContext();
  useEffect(() => {
    fetchIsAdmin();
  }, []);
  return isAdmin ? (
    <>
      <AdminNavBar />
      <div className=" flex">
        {/* Component này sẽ dùng code từ file .../AdminSideBar.jsx */}
        <AdminSideBar />
        <div className=" flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Layout;

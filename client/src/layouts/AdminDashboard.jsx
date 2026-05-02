import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import Dashboard from "@/pages/admin/Dashboard";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      
      {}
      <div className="flex-1 ml-64 flex flex-col">
        <Header/>
        <main className="flex-1">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
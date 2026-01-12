import AdminLayout from "@/layouts/AdminDashboard";
import CustomerList from "@/pages/admin/CustomerList";
import Dashboard from "@/pages/admin/Dashboard";
import AdminLogin from "@/pages/admin/Login";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

const AdminRoutes = () => {
    const accessToken = useSelector((state) => state.user.accessToken);

    return (
        <>
            <Routes>
                <Route path="login" element={accessToken ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
                <Route path="" element={accessToken ? <AdminLayout /> : <AdminLogin />}>
                    <Route index path="dashboard" element={<Dashboard />} />
                    <Route index path="customers" element={<CustomerList />} />
                </Route>
            </Routes>
        </>
    );
};

export default AdminRoutes;

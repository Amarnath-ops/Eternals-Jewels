import axiosInstance from "@/api/axios";
import AdminLayout from "@/layouts/AdminDashboard";
import CustomerList from "@/pages/admin/CustomerList";
import Dashboard from "@/pages/admin/Dashboard";
import AdminLogin from "@/pages/admin/Login";
import { setAdminCredentials } from "@/store/admin/adminAuthSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
const AdminRoutes = () => {
    const dispatch = useDispatch();
    const restoreToken = async () => {
        try {
            const res = await axiosInstance.post("/admin/auth/refresh");
            dispatch(setAdminCredentials({ accessToken: res.data.data.accessToken, user: res.data.data.user }));
        } catch (error) {
            console.error("No active Sessions ", error);
        }
    };
    useEffect(() => {
        restoreToken();
    }, []);

    const accessToken = useSelector((state) => state.admin?.accessToken);
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

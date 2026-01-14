import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminRoutes from "./routes/Admin.routes";
import UserRoutes from "./routes/User.routes";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import axiosInstance from "./api/axios";
import { useEffect } from "react";
import { setCredentials } from "./store/user/authSlice";
import { setAdminCredentials } from "./store/admin/adminAuthSlice";
function App() {
    const dispatch = useDispatch();
    const restoreToken = async () => {
        try {
            const res = await axiosInstance.post("/admin/auth/refresh");
            console.log(res);
            if (res.data.data.user.isAdmin) {
                dispatch(setAdminCredentials({ accessToken: res.data.data.accessToken, user: res.data.data.user }));
                return
            } else {
                dispatch(setCredentials({ accessToken: res.data.data.accessToken, user: res.data.data.user }));
            }
        } catch (error) {
            console.error("No active Sessions ", error);
            toast.error(error.response.data.message);
        }
    };
    useEffect(() => {
        restoreToken();
    }, []);
    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/*" element={<UserRoutes />} />
            </Routes>
        </>
    );
}

export default App;

import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminRoutes from "./routes/Admin.routes";
import UserRoutes from "./routes/User.routes";
import { Toaster } from "sonner";
import { useDispatch } from "react-redux";
import axiosInstance from "./api/axios";
import { useEffect } from "react";
import { setCredentials } from "./store/user/authSlice";
function App() {
    const dispatch = useDispatch();
    const restoreToken = async () => {
        try {
            const res = await axiosInstance.post("/auth/refresh");
            console.log(res)
            dispatch(setCredentials({ accessToken: res.data.data.accessToken, user: res.data.data.user }));
        } catch (error) {
            console.error("No active Sessions ", error);
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

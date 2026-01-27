import axios from "axios";
import store from "../store/store";
import { logOut, setCredentials } from "@/store/user/authSlice";
import { adminLogout, setAdminCredentials } from "@/store/admin/adminAuthSlice";
import { toast } from "sonner";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const url = config.url.replace(import.meta.env.VITE_BACKEND_URL, "");
        const isAdminRoute = url.startsWith(`/admin`);
        const state = store.getState();

        const token = isAdminRoute ? state.admin.accessToken : state.user.accessToken;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh") &&
            !originalRequest.url.includes("/admin/auth/refresh")
        ) {
            originalRequest._retry = true;

            const isAdminRoute = originalRequest.url.includes("/admin");
            try {
                const refreshEndPoint = isAdminRoute ? "/admin/auth/refresh" : "/auth/refresh";
                const res = await axiosInstance.post(refreshEndPoint);
                const { accessToken, user } = res.data.data;
                console.log(accessToken);
                if (isAdminRoute) {
                    store.dispatch(setAdminCredentials({ accessToken, adminData: user }));
                } else {
                    store.dispatch(setCredentials({ accessToken, user }));
                }
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (error) {
                console.log(error);
                toast.error(error.message);
                if (isAdminRoute) {
                    store.dispatch(adminLogout());
                    window.location.href = "/admin/login";
                } else {
                    store.dispatch(logOut());
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

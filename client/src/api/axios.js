import axios from "axios";
import store from "../store/store";
import { logOut, setCredentials } from "@/store/user/authSlice";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().user.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/refresh") ) {
            originalRequest._retry = true;
            try {
                const res = await axiosInstance.post(`/auth/refresh`);
                const { accessToken , user } = res.data.data;
                store.dispatch(setCredentials({ accessToken, user }));
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (error) {
                console.log("axios res interceptor", error);
                store.dispatch(logOut());
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

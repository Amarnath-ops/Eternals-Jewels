import axiosInstance from "../axios";

export const logoutApi = async () => await axiosInstance.post("/auth/logout");

export const loginApi = async (data) => {
    const res = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
    });
    return res.data.data
};

export const signupApi = async (data) => {
    return await axiosInstance.post("/auth/register", {
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        refferedBy: data.refferedBy,
    });
};

export const verifyOTPApi = async (data) => {
    return await axiosInstance.post("/auth/verify-otp", {
        email:data.email,
        otp: data.otp,
    });
};

export const resendOTPApi = async (email) => {
    return await axiosInstance.post("/auth/resend-otp", {
        email,
    });
};

export const forgotPasswordVerifyApi = async (data) => {
    return await axiosInstance.post("/auth/forgot-password-verify", {
        email:data.email,
        otp: data.otp,
    });
};

export const forgotPasswordApi = async (data) => {
    return await axiosInstance.post("/auth/forgot-password", {
        email: data.email,
    });
};

export const resetPasswordApi = async (data) => {
    return await axiosInstance.post("/auth/reset-password", {
        email:data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
    });
};

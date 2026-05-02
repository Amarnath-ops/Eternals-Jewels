import {
    forgotPasswordApi,
    forgotPasswordVerifyApi,
    loginApi,
    logoutApi,
    resendOTPApi,
    resetPasswordApi,
    signupApi,
    verifyOTPApi,
} from "@/api/users/auth.api";
export const authService = {
    logout: async () => {
        const res = await logoutApi();
        return res
    },
    login: async (data) => {
        const res = await loginApi(data);
        return res;
    },
    signup: async (data) => {
        const res = await signupApi(data);
        return res;
    },
    verifyOTP: async (data) => {
        const res = await verifyOTPApi(data);
        return res.data.data;
    },
    resendOTP: async (email) => {
        const res = await resendOTPApi(email);
        return res;
    },
    forgotPassword: async (data) => {
        const res = await forgotPasswordApi(data);
        return res;
    },
    forgotPasswordVerify: async (data) => {
        const res = await forgotPasswordVerifyApi(data);
        return res;
    },
    resetPassword: async (data) => {
        const res = await resetPasswordApi(data);
        return res.data;
    },
};

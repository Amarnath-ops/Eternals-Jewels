import { requestEmailChangeApi, updateProfileApi, verifyEmailOtpApi } from "@/api/user.api";

export const userService = {
    updateProfile: async (data) => {
        return await updateProfileApi(data);
    },
    requestEmailChange: async (email) => {
        return await requestEmailChangeApi(email);
    },
    verifyEmailOtp: async (otp) => {
        return await verifyEmailOtpApi(otp);
    },
};

import { getLandingCategoriesApi } from "@/api/users/categories.api";
import { requestEmailChangeApi, updateProfileApi, verifyEmailOtpApi } from "@/api/users/user.api";

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

export const categoryService = {
    getLandingCategories:async ()=>{
        return await getLandingCategoriesApi()
    }
}
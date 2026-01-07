
import axiosInstance from "./axios";

export const fectchCurrentUser = async () => {
    try {
        const res = await axiosInstance.get("/users/me");
        console.log(res);
        return res.data.data.user;
    } catch (error) {
        console.log(error);
    }
};
export const updateProfileApi = async (formData) => {
    const res = await axiosInstance.put("users/edit", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data.data;
};

export const requestEmailChangeApi = async (email)=>{
    const res = await axiosInstance.post("/users/email/change",{email});
    return res.data
}

export const verifyEmailOtpApi = async (otp)=>{
    const res = await axiosInstance.post("/users/email/verify",{otp});
    return res.data
}
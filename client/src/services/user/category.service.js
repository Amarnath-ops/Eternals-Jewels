import axiosInstance from "../../api/axios";

export const getCategories = async () => {
    try {
        const response = await axiosInstance.get("/categories/filters");
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching categories";
    }
};

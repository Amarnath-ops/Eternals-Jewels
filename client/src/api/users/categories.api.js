import axiosInstance from "../axios";

export const getLandingCategoriesApi = async () => {
    try {
        const res = await axiosInstance.get("/categories/landing");
        console.log(res);
        return res.data;
    } catch (error) {
      console.log(error)
    }
};

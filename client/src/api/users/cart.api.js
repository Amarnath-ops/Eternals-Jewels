import axiosInstance from "../axios";

export const cartApi = {
    addToCart: async (data) => {
        try {
            const res = await axiosInstance.post("/cart",data);
            return res.data
        } catch (error) {
            console.log(error)
        }
    },
    getCartItems: async () => {
        try {
            const res = await axiosInstance.get("/cart");
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },
};

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
    updateQuantity: async (data) => {
        try {
            const res = await axiosInstance.patch("/cart", data);
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    removeFromCart: async (data) => {
        try {
            const res = await axiosInstance.delete("/cart", { data });
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    clearCart: async () => {
        try {
            const res = await axiosInstance.delete("/cart/clear");
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
};

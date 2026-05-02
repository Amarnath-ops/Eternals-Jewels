import axiosInstance from "../axios";

export const wishlistApi = {
    addToWishlist: async (data) => {
        try {
            const res = await axiosInstance.post("/wishlist", data);
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getWishlist: async () => {
        try {
            const res = await axiosInstance.get("/wishlist");
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    removeFromWishlist: async (data) => {
        try {
            const res = await axiosInstance.delete("/wishlist", { data });
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    clearWishlist: async () => {
        try {
            const res = await axiosInstance.delete("/wishlist/clear");
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    moveToCart: async (data) => {
        try {
            const res = await axiosInstance.post("/wishlist/move-to-cart", data);
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
};

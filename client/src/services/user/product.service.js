import axiosInstance from "../../api/axios";

export const getProducts = async ({ page, limit, search, sort, category, minPrice, maxPrice, material }) => {
    try {
        const response = await axiosInstance.get("/products", {
            params: {
                page,
                limit,
                search,
                sort,
                category,
                minPrice,
                maxPrice,
                material
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching products";
    }

};

export const getProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching product details";
    }
};

export const getMaterials = async () => {
    try {
        const response = await axiosInstance.get("/products/materials");
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching materials";
    }
};

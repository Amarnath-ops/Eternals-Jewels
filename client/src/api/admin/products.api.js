import axiosInstance from "../axios.js";

export const addProductApi = async (data) => {
    return await axiosInstance.post("/admin/products/add-product", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getProductsApi = async (params) => {
    const res = await axiosInstance.get("/admin/products", { params });
    return res.data; // usually .data.data but controller sends {data: ...} so res.data is the full object
};

export const getProductByIdApi = async (id) => {
    const res = await axiosInstance.get(`/admin/products/${id}`);
    return res.data;
};

export const updateProductApi = async ({ id, data }) => {
    const res = await axiosInstance.put(`/admin/products/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const deleteProductApi = async (id) => {
    const res = await axiosInstance.delete(`/admin/products/${id}`);
    return res.data;
};

export const toggleProductApi = async (id) => {
    const res = await axiosInstance.patch(`/admin/products/${id}/toggle`);
    return res.data;
};

import axiosInstance from "../axios.js";

export const addCategoryApi = async (data) => {
    return await axiosInstance.post("/admin/categories/add-category", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getCategoriesApi = async (params) => {
    const res = await axiosInstance.get("/admin/categories", { params });
    return res.data.data;
};

export const updateCategoryApi = async ({categoryId , data})=>{
    const res = await axiosInstance.put(`/admin/categories/${categoryId}`,data,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
    return res.data.data
}

export const deleteCategoryApi = async (categoryId)=>{
    const res = await axiosInstance.delete(`/admin/categories/${categoryId}`)
    return res.data
}

export const toggleCategoryApi = async (categoryId)=>{
    const res = await axiosInstance.patch(`/admin/categories/${categoryId}/toggle`)
    return res.data
}
import { adminLoginApi, adminLogoutApi } from "@/api/admin/auth.api";
import {  addCategoryApi, deleteCategoryApi, getCategoriesApi, toggleCategoryApi, updateCategoryApi } from "@/api/admin/categories.api";
import { getAllCustomersApi, toggleBlockUserApi } from "@/api/admin/customers.api";

export const adminService = {
    login: async (data) => {
        return await adminLoginApi(data);
    },
    logout: async () => {
        return await adminLogoutApi();
    },
    getAllCustomers: async (params) => {
        return await getAllCustomersApi(params);
    },
    toggleBlockService: async (userId) => {
        return await toggleBlockUserApi(userId);
    },
};

export const categoryService = {
    addCategory: async (data) => {
        return await addCategoryApi(data);
    },
    getCategories:async (params)=>{
        return await getCategoriesApi(params)
    },
    updateCategory:async ({categoryId,data})=>{
        return await updateCategoryApi({categoryId,data})
    },
    deleteCategory : async (categoryId)=>{
        return  await deleteCategoryApi(categoryId)
    },
    toggleCategory: async (categoryId)=>{
        return await toggleCategoryApi(categoryId)
    }
};

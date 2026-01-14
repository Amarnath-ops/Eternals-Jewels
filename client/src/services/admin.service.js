import { adminLoginApi, adminLogoutApi } from "@/api/admin/auth.api";
import { getAllCustomersApi, toggleBlockUserApi } from "@/api/admin/customers.api";

export const adminService = {
    login: async (data) => {
      return await adminLoginApi(data)
    },
    logout:async ()=>{
      return await adminLogoutApi()
    },
    getAllCustomers: async (params) => {
        return await getAllCustomersApi(params);
    },
    toggleBlockService: async (userId) => {
        return await toggleBlockUserApi(userId);
    },
};

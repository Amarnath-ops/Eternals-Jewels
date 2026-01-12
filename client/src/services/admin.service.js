import { getAllCustomersApi, toggleBlockUserApi } from "@/api/admin/customers.api"

export const adminService = {
  getAllCustomers:async (params)=>{
    return await getAllCustomersApi(params)
  },
  toggleBlockService :async (userId)=>{
    return await toggleBlockUserApi(userId)
  }
}
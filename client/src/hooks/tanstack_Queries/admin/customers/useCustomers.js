import { QUERY_KEYS } from "@/lib/queryKeys"
import { adminService } from "@/services/admin.service"
import { useQuery } from "@tanstack/react-query"

export const useCustomers = (params)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.ADMIN_CUSTOMERS,params],
    queryFn:async({queryKey})=>{
      const [,queryParams] = queryKey;
      console.log(queryParams)
      return await adminService.getAllCustomers(queryParams)
    },
    keepPreviousData :true
  })
}
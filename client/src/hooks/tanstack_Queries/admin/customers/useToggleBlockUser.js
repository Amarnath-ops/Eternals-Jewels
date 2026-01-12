import { QUERY_KEYS } from "@/lib/queryKeys"
import { adminService } from "@/services/admin.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useToggleBlockUser = ()=>{
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:adminService.toggleBlockService,
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.ADMIN_CUSTOMERS]
      })
    }
  })
}
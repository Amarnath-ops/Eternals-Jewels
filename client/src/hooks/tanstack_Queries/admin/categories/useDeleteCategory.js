import { QUERY_KEYS } from "@/lib/queryKeys"
import { categoryService } from "@/services/admin.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useDeleteCategory = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:categoryService.deleteCategory,
    onSuccess:(data)=>{
      toast.success(data.message);
      console.log(data)
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.ADMIN_CATEGORIES]
      })
    },
    onError:(data)=>{
      console.log(data)
    }
  })
}
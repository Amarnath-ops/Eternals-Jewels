import { QUERY_KEYS } from "@/lib/queryKeys"
import { categoryService } from "@/services/admin.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";

export const useAddCategory = ()=>{
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:categoryService.addCategory,
    onSuccess:(data)=>{
      toast.success(data.data.message)
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.ADMIN_CATEGORIES]
      })
      navigate("/admin/categories")

    },
    onError:(error)=>{
      toast.error(error.response.data.message)
    }
  })
}
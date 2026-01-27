import { QUERY_KEYS } from "@/lib/queryKeys";
import { categoryService } from "@/services/admin.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";

export const useUpdateCategory = ()=>{
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:categoryService.updateCategory,
    onSuccess:(data)=>{
      console.log(data)
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.ADMIN_CATEGORIES]
      })
      navigate("/admin/categories")
      toast.success("Category updated successfully.")
    }
  })
}
import { QUERY_KEYS } from "@/lib/queryKeys";
import { categoryService } from "@/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useToggleCategory = () => {
  const queryClient = useQueryClient()
    return useMutation({
      mutationFn:categoryService.toggleCategory,
      onSuccess:(data)=>{
        console.log(data)
        toast.success(`Category ${data?.data?.category?.isListed ? "listed" : "unlisted"} successfully.`);
        queryClient.invalidateQueries({
          queryKey:[QUERY_KEYS.ADMIN_CATEGORIES]
        })
      },
      onError:(error)=>{
        toast.error(error.response.data.message || "Something went wrong.")
      }
    })
};  

export default useToggleCategory;

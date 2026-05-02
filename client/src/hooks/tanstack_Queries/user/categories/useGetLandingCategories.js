import { QUERY_KEYS } from "@/lib/queryKeys"
import { categoryService } from "@/services/user.service"
import { useQuery } from "@tanstack/react-query"

const useGetLandingCategories = () => {
  return useQuery({
    queryKey:[QUERY_KEYS.USER_CATEGORIES],
    queryFn:categoryService.getLandingCategories
  })
}

export default useGetLandingCategories
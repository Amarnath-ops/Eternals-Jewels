import { QUERY_KEYS } from "@/lib/queryKeys"
import { cartServices } from "@/services/user/cart.service"
import { useQuery } from "@tanstack/react-query"

export const useGetCartItems = ()=>{
  return useQuery({
    queryKey:[QUERY_KEYS.USER_CART],
    queryFn:cartServices.getCartItems
  })
}
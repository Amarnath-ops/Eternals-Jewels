import { QUERY_KEYS } from "@/lib/queryKeys"
import { addressServices } from "@/services/address.service"
import { useQuery } from "@tanstack/react-query"

export const useGetAddress = ()=>{
  return useQuery({
    queryKey:QUERY_KEYS.ADDRESS_KEY,
    queryFn:addressServices.getAllAddress
  })
}
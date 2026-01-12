import { QUERY_KEYS } from "@/lib/queryKeys"
import { addressServices } from "@/services/address.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddAddress = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:addressServices.addAddress,
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:QUERY_KEYS.ADDRESS_KEY
      })
    }
  })
}
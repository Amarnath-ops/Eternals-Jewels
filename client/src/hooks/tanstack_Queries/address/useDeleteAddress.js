import { QUERY_KEYS } from "@/lib/queryKeys"
import { addressServices } from "@/services/address.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useDeleteAddress = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:addressServices.deleteAddress,
    onSuccess:(_,addressId)=>{
      queryClient.setQueryData(
        QUERY_KEYS.ADDRESS_KEY,
        (oldAddresses=[])=>{
         return   oldAddresses.filter((addr)=>addr._id !== addressId)
        }
      )
      toast.success("Address deleted successfully");
    },
    onError:(error)=>{
      toast.error(error.response.data.message)
    }
  })
}
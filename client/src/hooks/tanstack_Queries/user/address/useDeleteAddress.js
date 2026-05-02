import { QUERY_KEYS } from "@/lib/queryKeys"
import { addressServices } from "@/services/address.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useDeleteAddress = ()=>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:addressServices.deleteAddress,
    onSuccess:()=>{
      queryClient.invalidateQueries(QUERY_KEYS.ADDRESS_KEY)
      toast.success("Address deleted successfully");
    },
    onError:(error)=>{
      toast.error(error.response.data.message)
    }
  })
}
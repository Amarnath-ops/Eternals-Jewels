import { QUERY_KEYS } from "@/lib/queryKeys"
import { userService } from "@/services/user.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useRequestEmailChange = ()=>{
  return useMutation({
    mutationFn:userService.requestEmailChange
  })
}

export const useVerifyEmailOtp = ()=>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:userService.verifyEmailOtp,
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:QUERY_KEYS.CURRENT_USER
      })
    },
    onError:(error)=>{
      console.log(error);
      toast.success(error.response.data.message)
    }
  })
}
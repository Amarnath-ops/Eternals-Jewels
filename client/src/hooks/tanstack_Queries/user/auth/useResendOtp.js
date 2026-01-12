import { authService } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useResendOtp = ()=>{
  return useMutation({
    mutationFn:authService.resendOTP,
    onSuccess:(res)=>{
      toast.success(res.data.message)
    }
  })
  
}
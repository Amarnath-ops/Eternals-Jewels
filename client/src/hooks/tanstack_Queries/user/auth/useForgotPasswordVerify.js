import { authService } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useForgotPasswordVerify = ()=>{

  return useMutation({
    mutationFn:authService.forgotPasswordVerify,
    onSuccess:()=>{
      toast.success("OTP verified successfully. You can now reset your password.");
    }
  })
}
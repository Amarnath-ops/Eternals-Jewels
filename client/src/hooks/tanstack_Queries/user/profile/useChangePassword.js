import { passwordService } from "@/services/password.service"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useChangePassword = ()=>{
  return useMutation({
    mutationFn:passwordService.changePassword,
    onSuccess:()=>{
      toast.success("Password changed successfully.")
    },
    onError:(error)=>{
      toast.error(error.response.data.message)
    }
  })
}
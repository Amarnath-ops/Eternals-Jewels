import { authService } from "@/services/auth.service";
import { logOut } from "@/store/user/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useLogoutUser = () => {
  const dispatch = useDispatch()
    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            dispatch(logOut());
            toast.success("You've logged out successfully.");  
        },
        onError:(error)=>{
          console.log(error)
          toast.error(error.response.data.message)
        }
    });
};

import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/user/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useResetPassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
    return useMutation({
        mutationFn: authService.resetPassword,
        onSuccess: (res) => {
            navigate("/");
            toast.success(res.message);
            dispatch(setCredentials({accessToken: res.data.token, user: res.data.user}))
        },
    });
};

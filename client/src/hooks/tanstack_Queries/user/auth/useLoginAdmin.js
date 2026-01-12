import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/user/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLoginAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            if (!data.user.isAdmin) {
                toast.error("You are not an admin");
                return;
            }
            dispatch(setCredentials({ accessToken: data.token, user: data.user }));
            navigate("/admin/dashboard")
        },
    });
};

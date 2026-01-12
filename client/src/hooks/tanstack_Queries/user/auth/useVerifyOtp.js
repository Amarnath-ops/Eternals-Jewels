import { QUERY_KEYS } from "@/lib/queryKeys";
import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/user/authSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useVerifyOtp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: authService.verifyOTP,
        onSuccess: (data) => {
            dispatch(setCredentials({ accessToken: data.token, user: data.user }));
            navigate("/");
            toast.success("You've registered successfully.");
            queryClient.invalidateQueries({
                queryKey:QUERY_KEYS.CURRENT_USER
            })
        },
    });
};

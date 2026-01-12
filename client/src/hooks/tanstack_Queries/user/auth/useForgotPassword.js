import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: authService.forgotPassword,
        onSuccess: (res) => {
            toast.success(res.data.message);
        },
    });
};

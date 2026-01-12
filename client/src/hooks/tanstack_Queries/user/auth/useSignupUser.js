import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignupUser = () => {
    return useMutation({
        mutationFn: authService.signup,
        onSuccess: (data) => {
            console.log(data);
            toast.success(data.data.message);
        },
        onError: (error) => {
            console.log(error);
        },
    });
};

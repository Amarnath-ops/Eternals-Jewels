import { QUERY_KEYS } from "@/lib/queryKeys";
import { userService } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.CURRENT_USER,
            });
            toast.success("Profile updated successfully.");
            navigate("/account/profile");
        },
    });
};

import { adminService } from "@/services/admin.service";
import { adminLogout } from "@/store/admin/adminAuthSlice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export const useLogoutAdmin = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: adminService.logout,
        onSuccess: () => {
            dispatch(adminLogout());
            toast.success("You've logged out successfully.");
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response.data.message);
        },
    });
};

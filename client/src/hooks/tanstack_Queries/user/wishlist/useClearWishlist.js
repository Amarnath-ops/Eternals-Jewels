import { wishlistServices } from "@/services/user/wishlist.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useClearWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistServices.clearWishlist,
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.USER_WISHLIST]);
            toast.success("Wishlist cleared");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "Failed to clear wishlist");
        },
    });
};

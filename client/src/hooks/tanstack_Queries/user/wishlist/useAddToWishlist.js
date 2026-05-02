import { wishlistServices } from "@/services/user/wishlist.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistServices.addToWishlist,
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.USER_WISHLIST]);
            toast.success("Added to wishlist");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "Failed to add to wishlist");
        },
    });
};

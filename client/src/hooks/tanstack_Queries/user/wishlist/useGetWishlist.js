import { wishlistServices } from "@/services/user/wishlist.service";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useGetWishlist = (options) => {
    return useQuery({
        queryKey: [QUERY_KEYS.USER_WISHLIST],
        queryFn: wishlistServices.getWishlist,
        ...options,
    });
};

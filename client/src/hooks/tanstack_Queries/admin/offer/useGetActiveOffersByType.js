import { useQuery } from "@tanstack/react-query";
import { getActiveOffersByType } from "@/api/admin/offer.api";

export const useGetActiveOffersByType = (type) => {
    return useQuery({
        queryKey: ["offers", "active", type],
        queryFn: () => getActiveOffersByType(type),
        enabled: !!type,
    });
};

import { useQuery } from "@tanstack/react-query";
import { getOfferById } from "@/api/admin/offer.api";

export const useGetOfferById = (id) => {
    return useQuery({
        queryKey: ["offer", id],
        queryFn: () => getOfferById(id),
        enabled: !!id,
    });
};

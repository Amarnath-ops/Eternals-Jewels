import { useQuery } from "@tanstack/react-query";
import { getOffers } from "@/api/admin/offer.api";

export const useGetOffers = (page, limit, search) => {
    return useQuery({
        queryKey: ["offers", page, limit, search],
        queryFn: () => getOffers({ page, limit, search }),
        keepPreviousData: true,
    });
};

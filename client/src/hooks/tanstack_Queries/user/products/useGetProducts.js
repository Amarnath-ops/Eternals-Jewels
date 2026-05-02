import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../../../services/user/product.service";

export const useGetProducts = (query) => {
    return useQuery({
        queryKey: ["products", query],
        queryFn: () => getProducts(query),
        keepPreviousData: true,
    });
};

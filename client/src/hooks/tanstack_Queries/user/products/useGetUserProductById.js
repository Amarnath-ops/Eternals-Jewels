import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services/user/product.service";

export const useGetUserProductById = (id) => {
    return useQuery({
        queryKey: ["user-product", id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
};

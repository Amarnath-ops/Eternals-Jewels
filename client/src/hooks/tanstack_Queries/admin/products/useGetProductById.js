import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

export const useGetProductById = (id) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
             const res = await productService.getProductById(id);
             return res.data;
        },
        enabled: !!id,
    });
};

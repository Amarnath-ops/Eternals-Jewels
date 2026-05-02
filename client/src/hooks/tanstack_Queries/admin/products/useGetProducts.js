import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

export const useGetProducts = (query) => {
    return useQuery({
        queryKey: ["products", query],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, value);
                }
            });
            const res = await productService.getProducts(params);
            return res.data; 
        },
        keepPreviousData: true,
    });
};

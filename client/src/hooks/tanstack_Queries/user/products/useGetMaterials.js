import { useQuery } from "@tanstack/react-query";
import { getMaterials } from "../../../../services/user/product.service";

export const useGetMaterials = () => {
    return useQuery({
        queryKey: ["materials"],
        queryFn: getMaterials,
        staleTime: 5 * 60 * 1000, 
    });
};

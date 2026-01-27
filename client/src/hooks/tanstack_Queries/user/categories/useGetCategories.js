import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/user/category.service";

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["user-categories"],
        queryFn: getCategories,
    });
};

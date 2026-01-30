import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/user/category.service";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useGetCategories = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.USER_CATEGORIES],
        queryFn: getCategories,
    });
};

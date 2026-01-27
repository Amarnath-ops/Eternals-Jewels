import { QUERY_KEYS } from "@/lib/queryKeys";
import { categoryService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = ({ page, limit, search, sort }) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ADMIN_CATEGORIES, { page, limit, search, sort }],
        queryFn: () => categoryService.getCategories({ page, limit, search, sort }),
    });
};

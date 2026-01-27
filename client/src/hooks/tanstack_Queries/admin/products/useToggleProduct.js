import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { toast } from "sonner";

export const useToggleProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            return await productService.toggleProduct(id);
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Product status toggled");
            queryClient.invalidateQueries(["products"]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to toggle status");
        },
    });
};

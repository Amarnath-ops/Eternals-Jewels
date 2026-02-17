import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import toast from "react-hot-toast";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            return await productService.deleteProduct(id);
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Product deleted successfully");
            queryClient.invalidateQueries(["products"]);
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete product");
        },
    });
};

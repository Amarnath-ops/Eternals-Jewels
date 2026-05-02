import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({ id, formData }) => {
            return await productService.updateProduct({ id, data: formData });
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Product updated successfully");
            queryClient.invalidateQueries(["products"]);
            navigate("/admin/products");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update product");
        },
    });
};

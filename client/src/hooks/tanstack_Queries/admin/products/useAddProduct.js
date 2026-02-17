import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useAddProduct = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (formData) => {
            return await productService.addProduct(formData);
        },
        onSuccess: (data) => {
            toast.success(data?.data?.message || "Product added successfully");
            queryClient.invalidateQueries(["products"]);
            navigate("/admin/products");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add product");
        },
    });
};

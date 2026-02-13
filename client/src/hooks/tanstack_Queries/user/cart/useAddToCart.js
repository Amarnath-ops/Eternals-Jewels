import { cartServices } from "@/services/user/cart.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddToCart = () => {
    return useMutation({
        mutationFn: cartServices.addToCart,
        onSuccess: (data) => {
            console.log(data);
            toast.success("Added to your cart.")
        },
    });
};

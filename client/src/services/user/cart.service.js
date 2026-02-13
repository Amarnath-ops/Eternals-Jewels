import { cartApi } from "@/api/users/cart.api";

export const cartServices = {
    getCartItems: () => {
        return cartApi.getCartItems();
    },
    addToCart:(data)=>{
        return cartApi.addToCart(data)
    }
};

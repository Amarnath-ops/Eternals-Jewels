import { cartApi } from "@/api/users/cart.api";

export const cartServices = {
    getCartItems: () => {
        return cartApi.getCartItems();
    },
    addToCart:(data)=>{
        return cartApi.addToCart(data)
    },
    updateQuantity: (data) => {
        return cartApi.updateQuantity(data);
    },
    removeFromCart: (data) => {
        return cartApi.removeFromCart(data);
    },
    clearCart: () => {
        return cartApi.clearCart();
    },
};

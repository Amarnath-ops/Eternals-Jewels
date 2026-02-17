import { wishlistApi } from "@/api/users/wishlist.api";

export const wishlistServices = {
    addToWishlist: (data) => {
        return wishlistApi.addToWishlist(data);
    },
    getWishlist: () => {
        return wishlistApi.getWishlist();
    },
    removeFromWishlist: (data) => {
        return wishlistApi.removeFromWishlist(data);
    },
    clearWishlist: () => {
        return wishlistApi.clearWishlist();
    },
    moveToCart: (data) => {
        return wishlistApi.moveToCart(data);
    },
};

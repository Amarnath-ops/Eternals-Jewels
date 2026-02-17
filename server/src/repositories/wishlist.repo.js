import Wishlist from "../models/wishlist.model.js";

export const wishlistRepository = {
    findWishlistByUser: (userId) => {
        return Wishlist.findOne({ user: userId }).populate("items.product");
    },
    createWishlist: (data) => {
        return Wishlist.create(data);
    },
    saveWishlist: (wishlist) => {
        return wishlist.save();
    },
    clearWishlist: (userId) => {
        return Wishlist.findOneAndUpdate(
            {
                user: userId,
            },
            { items: [] },
            { new: true },
        );
    },
};

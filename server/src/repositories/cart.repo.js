import Cart from "../models/cart.model.js";

export const cartRepository = {
    findCartByUser: (userId) => {
        return Cart.findOne({ user: userId }).populate("cartItems.product");
    },
    createCart: (data) => {
        return Cart.create(data);
    },
    saveCart: (cart) => {
        return cart.save();
    },
    clearCart: (userId) => {
        return Cart.findOneAndUpdate(
            {
                user: userId,
            },
            { cartItems: [] },
            { new: true },
        );
    },
};

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    priceSnapshot: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        cartItems: [cartItemSchema],
        cartTotal: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Cart", cartSchema);

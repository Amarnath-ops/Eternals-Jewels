import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        variants: [
            {
                material: { type: String, required: true },
                quantity: { type: Number, required: true, min: 0 },
                regularPrice: { type: Number, required: true, min: 0 },
                salePrice: { type: Number, required: true, min: 0 },
                sku: { type: String, required: true, unique: true },
                images: [
                    {
                        image_url: { type: String, required: true },
                        publicId: { type: String, required: true },
                    },
                ],
            },
        ],
        isListed: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        offer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offer",
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);

import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
    {
        offerName: {
            type: String,
            required: true,
            trim: true,
        },
        offerType: {
            type: String,
            enum: ["Product", "Category"],
            required: true,
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);

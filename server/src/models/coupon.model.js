import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
            default: "percentage",
        },
        discountAmount: {
            type: Number,
            required: true,
        },
        minPurchaseAmount: {
            type: Number, 
            default: 0,
        },
        maxDiscountAmount: {
            type: Number,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
        usageLimitPerUser: {
            type: Number,
            default: 1,
        },
        usedBy: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                usedCount: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Coupon", couponSchema);

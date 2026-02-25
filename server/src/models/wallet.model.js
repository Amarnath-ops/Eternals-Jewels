import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Credit", "Debit"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const walletSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            default: 0,
            required: true,
            min: 0,
        },
        transactions: [walletTransactionSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Wallet", walletSchema);

import Wallet from "../models/wallet.model.js";

export const walletRepository = {
    findWalletByUser: async (userId) => {
        let wallet = await Wallet.findOne({ user: userId }).sort({ "transactions.date": -1 });
        if (!wallet) {
            wallet = new Wallet({ user: userId, balance: 0, transactions: [] });
            await wallet.save();
        }
        return wallet;
    },

    creditWallet: async (userId, amount, description, orderId = null) => {
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
            const newWallet = new Wallet({
                user: userId,
                balance: amount,
                transactions: [{ type: "Credit", amount, description, orderId }],
            });
            return await newWallet.save();
        }

        wallet.balance += amount;
        wallet.transactions.push({ type: "Credit", amount, description, orderId });
        return await wallet.save();
    },

    debitWallet: async (userId, amount, description, orderId = null) => {
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet || wallet.balance < amount) {
            throw new Error("Insufficient wallet balance");
        }

        wallet.balance -= amount;
        wallet.transactions.push({ type: "Debit", amount, description, orderId });
        return await wallet.save();
    }
};

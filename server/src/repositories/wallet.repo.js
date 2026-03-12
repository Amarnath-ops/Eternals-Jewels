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
        const roundedAmount = Math.round(amount * 100) / 100;
        
        if (!wallet) {
            const newWallet = new Wallet({
                user: userId,
                balance: roundedAmount,
                transactions: [{ type: "Credit", amount: roundedAmount, description, orderId }],
            });
            return await newWallet.save();
        }

        wallet.balance = Math.round((wallet.balance + roundedAmount) * 100) / 100;
        wallet.transactions.push({ type: "Credit", amount: roundedAmount, description, orderId });
        return await wallet.save();
    },

    debitWallet: async (userId, amount, description, orderId = null) => {
        const wallet = await Wallet.findOne({ user: userId });
        const roundedAmount = Math.round(amount * 100) / 100;

        if (!wallet || wallet.balance < roundedAmount) {
            throw new Error("Insufficient wallet balance");
        }

        wallet.balance = Math.round((wallet.balance - roundedAmount) * 100) / 100;
        wallet.transactions.push({ type: "Debit", amount: roundedAmount, description, orderId });
        return await wallet.save();
    }
};

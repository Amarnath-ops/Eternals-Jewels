import { walletRepository } from "../../repositories/wallet.repo.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";

export const getWalletService = async (userId, page = 1, limit = 5) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const wallet = await walletRepository.findWalletByUser(userId);
    if (!wallet) {
        const error = new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (wallet && wallet.transactions) {
        wallet.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        const totalTransactions = wallet.transactions.length;
        const totalPages = Math.ceil(totalTransactions / limitNum);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;

        const paginatedTransactions = wallet.transactions.slice(startIndex, endIndex);

        return {
            wallet: {
                ...wallet.toObject(),
                transactions: paginatedTransactions
            },
            pagination: {
                totalTransactions,
                totalPages,
                currentPage: pageNum,
                limit: limitNum
            }
        };
    }

    return {
        wallet,
        pagination: {
            totalTransactions: 0,
            totalPages: 1,
            currentPage: 1,
            limit: limitNum
        }
    };
};  

import { walletRepository } from "../../repositories/wallet.repo.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";

export const getWalletService = async (userId) => {
    return await walletRepository.findWalletByUser(userId);
};

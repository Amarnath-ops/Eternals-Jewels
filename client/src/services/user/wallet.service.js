import { getWalletApi } from "../../api/users/wallet.api";

export const walletService = {
    getWallet: async (page, limit) => {
            const response = await getWalletApi(page, limit);
            return response.data;
    }
};

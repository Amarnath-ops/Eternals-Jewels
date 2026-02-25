import { getWalletApi } from "../../api/users/wallet.api";

export const walletService = {
    getWallet: async () => {
            const response = await getWalletApi();
            return response.data;
    }
};

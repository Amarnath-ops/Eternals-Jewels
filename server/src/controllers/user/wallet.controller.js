import { getWalletService } from "../../services/user/wallet.service.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";

export const getWallet = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const { wallet, pagination } = await getWalletService(req.user._id, page, limit);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            wallet,
            pagination
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

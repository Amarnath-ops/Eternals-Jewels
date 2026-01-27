import { STATUS_CODES } from "../../constants/statusCode.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { CONSTANTS } from "../../constants/constants.js";
import { getProducts as getProductsService, getProductById as getProductByIdService } from "../../services/user/product.service.js";

export const getProducts = async (req, res) => {
    try {
        console.log("Product controller query:", req.query);
        const data = await getProductsService(req.query);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.PRODUCT_FETCHED_SUCCESSFULLY ,
            data,
        });
    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
}

export const getProductById = async (req, res) => {
    try {
        const data = await getProductByIdService(req.params.id);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Product fetched successfully",
            data,
        });
    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

import { CONSTANTS } from "../../constants/constants.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import {
    addProductService,
    deleteProductService,
    getProductService,
    getProductByIdService,
    toggleProductService,
    updateProductService,
} from "../../services/admin/product.service.js";
import validateData from "../../utils/validation.js";
import { addProductSchema, updateProductSchema } from "../../validations/product.schema.js";

const parseBody = (body) => {
    const data = { ...body };
    if (data.variants && typeof data.variants === "string") {
        try {
            data.variants = JSON.parse(data.variants);
        } catch (error) {
            console.log(error);
        }
    }
    if (data.isListed !== undefined) {
        data.isListed = data.isListed === "true" || data.isListed === true;
    }
    if (data.existingImages && typeof data.existingImages === "string") {
        try {
            data.existingImages = JSON.parse(data.existingImages);
        } catch (error) {
            console.log(error);
            data.existingImages = [data.existingImages];
        }
    }
    if (data.variantImageMappings && typeof data.variantImageMappings === "string") {
        try {
            data.variantImageMappings = JSON.parse(data.variantImageMappings);
        } catch (error) {
            console.log(error);
            data.variantImageMappings = [];
        }
    }
    return data;
};

export const addProduct = async (req, res) => {
    try {
        const parsedBody = parseBody(req.body);
        const validData = validateData(parsedBody, addProductSchema);

        const result = await addProductService(validData.data, req.files);
        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: CONSTANTS.PRODUCT_ADDED,
            data: { product: result },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const data = await getProductService(req.query);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.PRODUCT_FETCHED_SUCCESSFULLY,
            data,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
export const getProductById = async (req, res) => {
    try {
        const data = await getProductByIdService(req.params.id);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.PRODUCT_FETCHED_SUCCESSFULLY,
            data,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const parsedBody = parseBody(req.body);
        const validData = validateData(parsedBody, updateProductSchema);
        const serviceData = { ...validData.data, existingImages: parsedBody.existingImages };

        const result = await updateProductService(req.params.id, serviceData, req.files);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.PRODUCT_UPDATED,
            data: { product: result },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const toggleProduct = async (req, res) => {
    try {
        const product = await toggleProductService(req.params.id);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.PRODUCT_LIST_TOGGLED,
            data: { product },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await deleteProductService(req.params.id);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.PRODUCT_DELETED,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

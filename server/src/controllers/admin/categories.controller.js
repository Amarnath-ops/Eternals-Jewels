import { CONSTANTS } from "../../constants/constants.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import {
    addCategoryService,
    deleteCategoryService,
    getCategoryService,
    toggleCategoryService,
    updateCategoryService,
} from "../../services/admin/categories.service.js";
import validateData from "../../utils/validation.js";
import { addCategorySchema, updateCategorySchema } from "../../validations/categories.schema.js";

export const addCategory = async (req, res) => {
    try {
        const validData = await validateData(req.body, addCategorySchema);
        console.log(validData, req.body);
        const result = await addCategoryService(validData.data, req.file);
        return res.status(STATUS_CODES.CREATED).json({
            message: CONSTANTS.CATEGORY_ADDED,
            data: {
                category: {
                    _id: result._id,
                    categoryName: result.categoryName,
                },
            },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getCategory = async (req, res) => {
    try {
        const data = await getCategoryService(req.query);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.CATEGORY_FETCHED_SUCCESSFULLY,
            data,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        console.log(req.file);
        const validData = await validateData(req.body, updateCategorySchema);
        const result = await updateCategoryService(req.params.id, validData.data, req.file);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.CATEGORY_UPDATED,
            data: {
                category: result,
            },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const toggleCategory = async (req, res) => {
    try {
        const category = await toggleCategoryService(req.params.id);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.CATEGORY_LIST_TOGGLED,
            data: {
                category,
            },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await deleteCategoryService(req.params.id);
        return res.status(STATUS_CODES.OK).json({
            message: CONSTANTS.CATEGORY_DELETED,
            success: true,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

import {
    createOfferService,
    getOffersService,
    updateOfferService,
    deleteOfferService,
    toggleOfferService,
    getActiveOffersByTypeService,
    getOfferByIdService,
} from "../../services/admin/offer.service.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import validateData from "../../utils/validation.js";
import { offerSchema, updateOfferSchema } from "../../validations/offer.schema.js";
import { CONSTANTS } from "../../constants/constants.js";

export const createOffer = async (req, res) => {
    try {
        const validated = validateData(req.body, offerSchema);
        const result = await createOfferService(validated.data);
        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: CONSTANTS.OFFER_CREATED,
            data: result,
        });
    } catch (error) {
        res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const getOffers = async (req, res) => {
    try {
        const result = await getOffersService(req.query);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const getOfferById = async (req, res) => {
    try {
        const result = await getOfferByIdService(req.params.id);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateOffer = async (req, res) => {
    try {
        const validated = validateData(req.body, updateOfferSchema);
        const result = await updateOfferService(req.params.id, validated.data);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.OFFER_UPDATED_SUCCESSFULLY,
            data: result,
        });
    } catch (error) {
        res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteOffer = async (req, res) => {
    try {
        await deleteOfferService(req.params.id);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.OFFER_DELETED,
        });
    } catch (error) {
        res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const toggleOffer = async (req, res) => {
    try {
        const result = await toggleOfferService(req.params.id);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.OFFER_LIST_TOGGLED,
            data: result,
        });
    } catch (error) {
        res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const getActiveOffersByType = async (req, res) => {
    try {
        const { type } = req.query;
        const result = await getActiveOffersByTypeService(type);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

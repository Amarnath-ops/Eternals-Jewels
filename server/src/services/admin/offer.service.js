import { offerRepository } from "../../repositories/offer.repo.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";

export const createOfferService = async (offerData) => {
    return await offerRepository.create(offerData);
};

export const getOffersService = async (query) => {
    const { page = 1, limit = 10, search = "" } = query;
    const [offers, total] = await offerRepository.findAll({ page, limit, search });
    
    return {
        offers,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
    };
};

export const getOfferByIdService = async (id) => {
    const offer = await offerRepository.findById(id);
    if (!offer) {
        const error = new Error(ERROR_MESSAGES.OFFER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return offer;
};

export const updateOfferService = async (id, data) => {
    const offer = await offerRepository.findById(id);
    if (!offer) {
        const error = new Error(ERROR_MESSAGES.OFFER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    return await offerRepository.updateById(id, data);
};

export const deleteOfferService = async (id) => {
    const offer = await offerRepository.findById(id);
    if (!offer) {
        const error = new Error(ERROR_MESSAGES.OFFER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    return await offerRepository.deleteById(id);
};

export const toggleOfferService = async (id) => {
    const offer = await offerRepository.findById(id);
    if (!offer) {
        const error = new Error(ERROR_MESSAGES.OFFER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    return await offerRepository.updateById(id, { isActive: !offer.isActive });
};

export const getActiveOffersByTypeService = async (type) => {
    if (!type) {
        const error = new Error(ERROR_MESSAGES.OFFER_TYPE_REQUIRED);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }
    return await offerRepository.findByType(type);
};

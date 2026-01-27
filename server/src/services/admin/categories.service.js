import cloudinary, { uploadBuffer } from "../../config/cloudinary.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { categoryRepository } from "../../repositories/categories.repo.js";
export const addCategoryService = async (body, file) => {
    if (!file) {
        const error = new Error(ERROR_MESSAGES.CATEGORY_IMAGE_REQUIRED);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (!file.mimetype.startsWith("image/")) {
        const error = new Error(ERROR_MESSAGES.INVALID_IMAGE_FORMAT);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const uploaded = await uploadBuffer(file.buffer, "categories");
    body.thumbnail = {
        image_url: uploaded.secure_url,
        publicId: uploaded.public_id,
    };

    const exist = await categoryRepository.findByName(body.categoryName);
    if (exist) {
        const error = new Error(ERROR_MESSAGES.CATEGORY_ALREADY_EXIST);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const createdCategory = await categoryRepository.create(body);

    return createdCategory;
};

export const getCategoryService = async (query) => {
    const { page = 1, limit = 10, search = "", sort = "-createdAt" } = query;
    console.log(query);
    const [categories, total] = await categoryRepository.findAll({
        search,
        page: Number(page),
        limit: Number(limit),
        sort,
    });
    console.log(categories);
    return {
        categories,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
    };
};

export const updateCategoryService = async (id, data, file) => {
    const category = await categoryRepository.findById(id);
    if (!category) {
        const error = new Error(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (data.categoryName) {
        const exists = await categoryRepository.findByName(data.categoryName);
        if (exists && exists._id.toString() !== id) {
            const error = new Error(ERROR_MESSAGES.CATEGORY_ALREADY_EXIST);
            error.statusCode = STATUS_CODES.CONFLICT;
            throw error;
        }
    }
    if (file) {
        if (!file.mimetype.startsWith("image/")) {
            const error = new Error(ERROR_MESSAGES.INVALID_IMAGE_FORMAT);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (category.thumbnail?.publicId) {
            await cloudinary.uploader.destroy(category.thumbnail.publicId);
        }
        const uploaded = await uploadBuffer(file.buffer, "categories");
        data.thumbnail = {
            image_url: uploaded.secure_url,
            publicId: uploaded.public_id,
        };
    }

    const updated = await categoryRepository.updateById(id, data);
    console.log(updated);
    return updated;
};

export const toggleCategoryService = async (categoryId) => {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
        const error = new Error(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return categoryRepository.toggleList(categoryId, !category.isListed);
};

export const deleteCategoryService = async (categoryId) => {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
        const error = new Error(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    return categoryRepository.softDelete(categoryId);
};

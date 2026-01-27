import cloudinary, { uploadBuffer } from "../../config/cloudinary.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { productRepository } from "../../repositories/product.repo.js";

export const addProductService = async (data, files) => {
    const exist = await productRepository.findByName(data.productName);
    if (exist) {
        const error = new Error(ERROR_MESSAGES.PRODUCT_ALREADY_EXISTS);
        error.statusCode = STATUS_CODES.CONFLICT;
        throw error;
    }

    if (!files || !files.thumbnail || files.thumbnail.length === 0) {
        const error = new Error(ERROR_MESSAGES.IMAGE_REQUIRED);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const thumbFile = files.thumbnail[0];
    if (!thumbFile.mimetype.startsWith("image/")) {
        const error = new Error(ERROR_MESSAGES.INVALID_IMAGE_FORMAT);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }
    const uploadedThumb = await uploadBuffer(thumbFile.buffer, "products/thumbnails");
    data.thumbnail = {
        image_url: uploadedThumb.secure_url,
        publicId: uploadedThumb.public_id,
    };

    data.productImages = [];
    if (!files || !files.productImages || files.productImages.length < 2) {
        const error = new Error(ERROR_MESSAGES.ATLEAST_TWO_IMAGES_REQUIRED);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (files.productImages && files.productImages.length > 0) {
        if (files.productImages.length < 2) {
            const error = new Error(ERROR_MESSAGES.ATLEAST_TWO_IMAGES_REQUIRED);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (files.productImages.length > 4) {
            const error = new Error(ERROR_MESSAGES.MAXIMUM_FOUR_IMAGES_ALLOWED);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        const uploadPromises = files.productImages.map(async (file) => {
            if (!file.mimetype.startsWith("image/")) {
                throw new Error(ERROR_MESSAGES.INVALID_IMAGE_FORMAT);
            }
            const uploaded = await uploadBuffer(file.buffer, "products/gallery");
            return {
                image_url: uploaded.secure_url,
                publicId: uploaded.public_id,
            };
        });
        data.productImages = await Promise.all(uploadPromises);
    }

    return await productRepository.create(data);
};

export const getProductService = async (query) => {
    const { page = 1, limit = 10, search = "", sort = "-createdAt", category } = query;
    const [products, total] = await productRepository.findAll({
        search,
        category,
        page: Number(page),
        limit: Number(limit),
        sort,
    });

    return {
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
    };
};
export const getProductByIdService = async (id) => {
    const product = await productRepository.findById(id);
    if (!product) {
        const error = new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return product;
};

export const updateProductService = async (id, data, files) => {
    const product = await productRepository.findById(id);
    if (!product) {
        const error = new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (data.productName) {
        const exist = await productRepository.findByName(data.productName);
        if (exist && exist._id.toString() !== id) {
            const error = new Error(ERROR_MESSAGES.PRODUCT_ALREADY_EXISTS);
            error.statusCode = STATUS_CODES.CONFLICT;
            throw error;
        }
    }

    if (files && files.thumbnail && files.thumbnail.length > 0) {
        const thumbFile = files.thumbnail[0];
        if (!thumbFile.mimetype.startsWith("image/")) {
            const error = new Error(ERROR_MESSAGES.INVALID_IMAGE_FORMAT);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        if (product.thumbnail && product.thumbnail.publicId) {
            await cloudinary.uploader.destroy(product.thumbnail.publicId);
        }

        const uploadedThumb = await uploadBuffer(thumbFile.buffer, "products/thumbnails");
        data.thumbnail = {
            image_url: uploadedThumb.secure_url,
            publicId: uploadedThumb.public_id,
        };
    }

    let finalImages = [...product.productImages];

    if (data.existingImages) {
        const keepIds = Array.isArray(data.existingImages) ? data.existingImages : [data.existingImages];

        const toDelete = product.productImages.filter((img) => !keepIds.includes(img.publicId));

        await Promise.all(toDelete.map((img) => cloudinary.uploader.destroy(img.publicId)));

        finalImages = product.productImages.filter((img) => keepIds.includes(img.publicId));
    }

    if (files && files.productImages && files.productImages.length > 0) {
        if (finalImages.length + files.productImages.length > 4) {
            const error = new Error(
                `Cannot have more than 4 images. You have ${finalImages.length} and are trying to add ${files.productImages.length}.`,
            );
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        const uploadPromises = files.productImages.map(async (file) => {
            if (!file.mimetype.startsWith("image/")) {
                throw new Error(ERROR_MESSAGES.INVALID_IMAGE_FORMAT);
            }
            const uploaded = await uploadBuffer(file.buffer, "products/gallery");
            return {
                image_url: uploaded.secure_url,
                publicId: uploaded.public_id,
            };
        });
        const newImages = await Promise.all(uploadPromises);
        finalImages = [...finalImages, ...newImages];
    }

    if (finalImages.length < 2) {
        const error = new Error(ERROR_MESSAGES.ATLEAST_TWO_IMAGES_REQUIRED);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    data.productImages = finalImages;
    delete data.existingImages;

    return await productRepository.updateById(id, data);
};

export const deleteProductService = async (id) => {
    const product = await productRepository.findById(id);
    if (!product) {
        const error = new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return productRepository.softDelete(id);
};

export const toggleProductService = async (id) => {
    const product = await productRepository.findById(id);
    if (!product) {
        const error = new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return productRepository.toggleList(id, !product.isListed);
};

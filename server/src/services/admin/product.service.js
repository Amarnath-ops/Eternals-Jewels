import { uploadBuffer } from "../../config/cloudinary.js";
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
    if (files.variantImages && files.variantImages.length > 0) {
        const mappings = data.variantImageMappings || [];
        const variantImagesMap = {};

        for (let i = 0; i < files.variantImages.length; i++) {
            const file = files.variantImages[i];
            const [variantIdx] = mappings[i] || [];
            
            if (variantIdx !== undefined) {
                if (!variantImagesMap[variantIdx]) {
                    variantImagesMap[variantIdx] = [];
                }
                variantImagesMap[variantIdx].push(file);
            }
        }

        for (const [variantIdx, imageFiles] of Object.entries(variantImagesMap)) {
            const uploadPromises = imageFiles.map(async (file) => {
                if (!file.mimetype.startsWith("image/")) {
                    throw new Error(ERROR_MESSAGES.INVALID_IMAGE_FORMAT).statusCode(STATUS_CODES.BAD_REQUEST);
                }

                const uploaded = await uploadBuffer(file.buffer, "products/variants");
                return {
                    image_url: uploaded.secure_url,
                    publicId: uploaded.public_id,
                };
            });

            const uploadedImages = await Promise.all(uploadPromises);
            
            if (data.variants[variantIdx]) {
                data.variants[variantIdx].images = uploadedImages;
            }
        }
    }

    
    delete data.variantImageMappings;

    return await productRepository.create(data);
};

export const getProductService = async (query) => {
    const { page = 1, limit = 10, search = "", sort = "-createdAt", category } = query;
    const {products, total} = await productRepository.findAll({
        search,
        category,
        page: Number(page),
        limit: Number(limit),
        sort,
        isListed:undefined
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



    
    if (files && files.variantImages && files.variantImages.length > 0) {
        const mappings = data.variantImageMappings || [];
        const variantImagesMap = {};

        
        for (let i = 0; i < files.variantImages.length; i++) {
            const file = files.variantImages[i];
            const [variantIdx] = mappings[i] || [];
            
            if (variantIdx !== undefined) {
                if (!variantImagesMap[variantIdx]) {
                    variantImagesMap[variantIdx] = [];
                }
                variantImagesMap[variantIdx].push(file);
            }
        }

        
        for (const [variantIdx, imageFiles] of Object.entries(variantImagesMap)) {
            const variantIdxNum = Number(variantIdx);
        
            const uploadPromises = imageFiles.map(async (file) => {
                if (!file.mimetype.startsWith("image/")) {
                    throw new Error(ERROR_MESSAGES.INVALID_IMAGE_FORMAT);
                }
                const uploaded = await uploadBuffer(file.buffer, "products/variants");
                return {
                    image_url: uploaded.secure_url,
                    publicId: uploaded.public_id,
                };
            });

            const uploadedImages = await Promise.all(uploadPromises);
            
            if (!data.variants) {
                
                
                data.variants = [...product.variants];
            }
            
            if (data.variants[variantIdxNum]) {
                const existingImages = data.variants[variantIdxNum].images || [];
                data.variants[variantIdxNum].images = [...existingImages, ...uploadedImages];
            }
        }
    }

    
    delete data.variantImageMappings;

    const result = await productRepository.updateById(id, data);
    return result;
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

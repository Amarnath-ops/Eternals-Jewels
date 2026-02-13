import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { productRepository } from "../../repositories/product.repo.js";

export const getProducts = async (query) => {
    const { page = 1, limit = 12, search, sort = "-createdAt", category, minPrice, maxPrice } = query;
    const isListed = true;
    let materials = query.material || query["material[]"];

    if (materials && !Array.isArray(materials)) {
        materials = [materials];
    }
    let { products, total } = await productRepository.findAll({
        search,
        category,
        page: Number(page),
        limit: Number(limit),
        sort,
        isListed,
        minPrice: minPrice !== undefined && minPrice !== "" ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== undefined && maxPrice !== "" ? Number(maxPrice) : undefined,
        material: materials,
    });
    return {
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
    };
};

export const getProductById = async (id) => {
    const product = await productRepository.findByIdListed(id);

    if (!product) {
        const error = new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    if (!product.category.isListed) {
        const error = new Error(ERROR_MESSAGES.PRODUCT_CATEGORY_IS_NOT_LISTED);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return product;
};

export const getUniqueMaterials = async () => {
    return await productRepository.findDistinctMaterials();
};

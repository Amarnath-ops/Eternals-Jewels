import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { productRepository } from "../../repositories/product.repo.js";

export const getProducts = async (query) => {
    const { page = 1, limit = 12, search = "", sort = "-createdAt", category, minPrice, maxPrice, material } = query;
    
    // Ensure we only fetch listed products for the user side
    const isListed = true;

    const [products, total] = await productRepository.findAll({
        search,
        category,
        page: Number(page),
        limit: Number(limit),
        sort,
        isListed,
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        material
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
        error.statusCode = 404;
        throw error;
    }
    return product;
};

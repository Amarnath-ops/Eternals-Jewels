import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { wishlistRepository } from "../../repositories/wishlist.repo.js";
import { productRepository } from "../../repositories/product.repo.js";
import { addToCartService } from "./cart.service.js";
import { applyOffersToProducts } from "../../utils/offerHelper.js";

export const addToWishlistService = async (userId, productId, variantId) => {
    const product = await productRepository.findById(productId);
    if (!product) {
        const error = new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const variant = product.variants.find((v) => v._id.toString() === variantId.toString());
    if (!variant) {
        const error = new Error(ERROR_MESSAGES.VARIANT_IS_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    let wishlist = await wishlistRepository.findWishlistByUser(userId);
    if (!wishlist) {
        wishlist = await wishlistRepository.createWishlist({
            user: userId,
            items: [],
        });
    }

    const existingItem = wishlist.items.find(
        (item) => String(item.product._id) === String(productId) && String(item.variantId) === String(variantId),
    );

    if (existingItem) {
        return wishlist;
    }

    wishlist.items.push({
        product: productId,
        variantId,
    });

    return wishlistRepository.saveWishlist(wishlist);
};

export const getWishlistService = async (userId) => {
    const wishlist = await wishlistRepository.findWishlistByUser(userId);
    if (!wishlist) {
        return { items: [] };
    }

    const wishlistProducts = wishlist.items.map((item) => item.product);
    const wishlistProductsWithOffers = await applyOffersToProducts(wishlistProducts);

    const items = wishlist.items
        .map((item) => {
            const product = wishlistProductsWithOffers.find((p) => p._id.toString() === item.product._id.toString());
            if (!product) return null; 

            const variant = product.variants.find((v) => v._id.toString() === item.variantId.toString());

            if (!variant) return null;

            return {
                _id: item._id, 
                productId: product._id,
                variantId: item.variantId,
                productName: product.productName,
                category: product.category?.categoryName ,
                price: variant.salePrice,
                regularPrice: variant.regularPrice,
                image: variant.images?.[0]?.image_url || product.thumbnail?.image_url,
                stock: variant.quantity,
                addedAt: item.addedAt,
            };
        })
        .filter(Boolean);

    return { items };
};

export const removeFromWishlistService = async (userId, productId, variantId) => {
    const wishlist = await wishlistRepository.findWishlistByUser(userId);
    if (!wishlist) {
        const error = new Error(ERROR_MESSAGES.WISHLIST_NOT_FOUND); 
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    wishlist.items = wishlist.items.filter(
        (item) => !(String(item.product._id) === String(productId) && String(item.variantId) === String(variantId)),
    );

    return wishlistRepository.saveWishlist(wishlist);
};

export const clearWishlistService = async (userId) => {
    return wishlistRepository.clearWishlist(userId);
};

export const moveItemToCartService = async (userId, productId, variantId) => {
    await addToCartService(userId, productId, variantId, 1);
    await removeFromWishlistService(userId, productId, variantId);
    return { success: true };
};

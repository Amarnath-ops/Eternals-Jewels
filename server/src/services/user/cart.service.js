import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { cartRepository } from "../../repositories/cart.repo.js";
import { productRepository } from "../../repositories/product.repo.js";

export const addToCartService = async (userId, productId, variantId, quantity) => {
    const product = await productRepository.findById(productId);
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
    const variant = product.variants.id(variantId);
    if (!variant) {
        const error = new Error(ERROR_MESSAGES.VARIANT_IS_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (variant.quantity < quantity) {
        const error = new Error(ERROR_MESSAGES.NOT_ENOUGH_STOCK);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    let cart = await cartRepository.findCartByUser(userId);
    if (!cart) {
        cart = await cartRepository.createCart({
            user: userId,
            items: [],
        });
    }
    const existingItem = cart.cartItems.find(
        (item) => String(item.product._id) === String(productId) && String(item.variantId) === String(variantId),
    );
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.cartItems.push({
            product: productId,
            priceSnapshot: variant.salePrice,
            variantId,
            quantity,
        });
    }
    cart.cartTotal = cart.cartItems.length;
    return cartRepository.saveCart(cart);
};

export const getCartService = async (userId) => {
    const cart = await cartRepository.findCartByUser(userId);
    if (!cart)
        return {
            item: [],
            total: 0,
        };

    let total = 0;
    const items = cart.cartItems
        .map((item) => {
            const product = item.product;
            const variant = product.variants.find((v) => v._id.toString() === item.variantId.toString());

            if (!variant) return null;

            const salePrice = variant.salePrice;
            const regularPrice = variant.regularPrice;
            const itemTotal = salePrice * item.quantity;
            total += itemTotal;

            return {
                productId: product._id,
                variantId: item.variantId,
                name: product.productName,
                material: variant.material,
                image: variant.images?.[0]?.image_url,
                salePrice,
                regularPrice,
                quantity: item.quantity,
                total: itemTotal,
            };
        })
        .filter(Boolean);
    return { items, total };
};

export const updateQuantityService = async (userId, productId, variantId, qty) => {
    console.log(userId);
    const cart = await cartRepository.findCartByUser(userId);
    if (!cart) {
        const error = new Error(ERROR_MESSAGES.CART_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    const item = cart.cartItems.find(
        (i) => String(i.product._id) === String(productId) && String(i.variantId) === String(variantId),
    );

    if (!item) {
        const error = new Error(ERROR_MESSAGES.ITEM_NOT_IN_CART);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    item.quantity = qty;
    return cartRepository.saveCart(cart);
};

export const removeFromCartService = async (userId, productId, variantId) => {
    const cart = await cartRepository.findCartByUser(userId);
    if (!cart) {
        const error = new Error(ERROR_MESSAGES.CART_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    cart.cartItems = cart.cartItems.filter(
        (item) => !(item.product._id.toString() === productId && item.variantId.toString() === variantId),
    );

    return cartRepository.saveCart(cart);
};

export const clearCartService = async (userId) => {
    const cart = await cartRepository.findCartByUser(userId);
    if (!cart) {
        const error = new Error(ERROR_MESSAGES.CART_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    cart.cartItems = [];
    return cartRepository.saveCart(cart);
};

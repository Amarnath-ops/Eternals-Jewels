import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { orderRepository } from "../../repositories/order.repo.js";
import { cartRepository } from "../../repositories/cart.repo.js";
import { productRepository } from "../../repositories/product.repo.js";
import { findAddressById } from "../../repositories/address.repo.js";
import  razorpay  from "../../config/razorpay.js";
import { verifySignature } from "../../utils/verify.signature.js";
export const placeOrderService = async (userId, { addressId, paymentMethod }) => {
    const cart = await cartRepository.findCartByUser(userId);
    if (!cart || cart.cartItems.length === 0) {
        const error = new Error(ERROR_MESSAGES.CART_EMPTY);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.cartItems) {
        const product = await productRepository.findById(item.product._id);

        if (!product || !product.isListed || product.isDeleted) {
            const error = new Error(`Product ${product ? product.productName : ""} is unavailable`);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        const variant = product.variants.id(item.variantId);
        if (!variant) {
            const error = new Error(`Variant not found for product ${product.productName}`);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        if (variant.quantity < item.quantity) {
            const error = new Error(`Insufficient stock for ${product.productName} (${variant.material})`);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        const price = variant.salePrice;
        const itemTotal = price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
            product: product._id,
            variantId: variant._id,
            productName: product.productName,
            image: variant.images[0].image_url,
            price: price,
            quantity: item.quantity,
            itemStatus: "Pending",
        });
    }

    const address = await findAddressById(addressId);
    if (!address) {
        const error = new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    let deliveryCharge = 0;
    if (totalAmount < 1000) {
        deliveryCharge = 50;
    }

    const finalAmount = totalAmount + deliveryCharge;

    const orderData = {
        user: userId,
        orderItems,
        shippingAddress: {
            fullname: address.fullname,
            phone: address.phone,
            address: address.address,
            state: address.state,
            district: address.district,
            city: address.city,
            pincode: address.pincode,
            landmark: address.landmark,
        },
        paymentMethod,
        totalAmount,
        finalAmount,
        discountAmount: 0,
        orderStatus: "Pending",
        paymentStatus: "Pending",
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    const newOrder = await orderRepository.createOrder(orderData);
    let razorpayOrder = null;
    if (paymentMethod === "RazorPay") {
        const options = {
            amount: finalAmount * 100,
            currency: "INR",
            receipt: newOrder._id.toString(),
        };
        try {
            razorpayOrder = await razorpay.orders.create(options);
        } catch (error) {
            error.message = ERROR_MESSAGES.RAZORPAY_ERROR;
            error.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw error;
        }
    }
    for (const item of orderItems) {
        await productRepository.updateStock(item.product, item.variantId, item.quantity);
    }

    await cartRepository.clearCart(userId);
    if (razorpayOrder) {
        return {
            ...newOrder.toObject(),
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
        };
    }
    return newOrder;
};

export const getOrdersService = async (userId, page = 1, limit = 5, search = "") => {
    return await orderRepository.findOrdersByUserId(userId, page, limit, search);
};

export const getOrderByIdService = async (userId, orderId) => {
    const order = await orderRepository.findOrderByIdAndUser(orderId, userId);
    if (!order) {
        const error = new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return order;
};

export const cancelOrderService = async (userId, orderId) => {
    const order = await orderRepository.findOrderByIdAndUser(orderId, userId);
    if (!order) {
        const error = new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (["Delivered", "Cancelled", "Returned", "Shipped"].includes(order.orderStatus)) {
        const error = new Error(`Cannot cancel order in ${order.orderStatus} state`);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    for (const item of order.orderItems) {
        await productRepository.updateStock(item.product, item.variantId, -item.quantity);
    }
    return await orderRepository.cancelOrder(orderId);
};

export const returnOrderService = async (userId, orderId, itemId, reason) => {
    const order = await orderRepository.findOrderByIdAndUser(orderId, userId);
    if (!order) {
        const error = new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const item = order.orderItems.id(itemId);
    if (!item) {
        const error = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    if (item.itemStatus !== "Delivered") {
        const error = new Error(`Cannot return item with status ${item.itemStatus}`);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    return await orderRepository.requestReturn(orderId, itemId, reason);
};

export const cancelOrderItemService = async (userId, orderId, itemId) => {
    const order = await orderRepository.findOrderByIdAndUser(orderId, userId);
    if (!order) {
        throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    const item = order.orderItems.id(itemId);
    if (!item) {
        throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
    }

    if (!["Pending", "Processing"].includes(item.itemStatus)) {
        throw new Error(`Cannot cancel item in ${item.itemStatus} state`);
    }

    await productRepository.updateStock(item.product, item.variantId, -item.quantity);

    return await orderRepository.cancelOrderItem(orderId, itemId);
};

export const verifyPaymentService = async (orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature) => {
    const order = await orderRepository.findOrderById(orderId);
    if (!order) {
        const error = new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (isValid) {
        order.paymentStatus = "Completed";
        order.transactionId = razorpayPaymentId;
        await orderRepository.saveOrder(order);
        return true;
    } else {
        order.paymentStatus = "Failed";
        await orderRepository.saveOrder(order);
        return false
    }
};

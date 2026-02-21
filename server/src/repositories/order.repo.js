import Order from "../models/order.model.js";

export const orderRepository = {
    createOrder: async (orderData) => {
        const order = await Order.create(orderData);
        return order;
    },

    findById: async (orderId) => {
        return await Order.findById(orderId).populate("orderItems.product");
    },

    cancelOrder: async (orderId) => {
        const order = await Order.findById(orderId);
        if (!order) return null;

        order.orderStatus = "Cancelled";
        order.orderItems.forEach((item) => {
            item.itemStatus = "Cancelled";
        });
        
        order.totalAmount = 0;
        order.finalAmount = 0;

        return await order.save();
    },

    findOrdersByUserId: async (userId, page = 1, limit = 5, search = "") => {
        const skip = (page - 1) * limit;

        const query = { user: userId };

        if (search) {
            const searchRegex = new RegExp(search, "i");
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);

            if (isObjectId) {
                query._id = search;
            } else {
                query["orderItems.productName"] = searchRegex;
            }
        }

        const totalOrders = await Order.countDocuments(query);
        const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

        return { orders, totalOrders, totalPages: Math.ceil(totalOrders / limit), currentPage: page };
    },

    findOrderByIdAndUser: async (orderId, userId) => {
        return await Order.findOne({ _id: orderId, user: userId }).populate("orderItems.product");
    },

    requestReturn: async (orderId, itemId, reason) => {
        return await Order.findOneAndUpdate(
            { _id: orderId, "orderItems._id": itemId },
            {
                $set: {
                    "orderItems.$.itemStatus": "Return Requested",
                    "orderItems.$.returnReason": reason,
                },
            },
            { new: true },
        );
    },

    cancelOrderItem: async (orderId, itemId) => {
        const order = await Order.findOne({ _id: orderId, "orderItems._id": itemId });
        if (!order) return null;

        const item = order.orderItems.find((item) => item._id.toString() === itemId);
        item.itemStatus = "Cancelled";

        const allCancelled = order.orderItems.every((item) => item.itemStatus === "Cancelled");
        if (allCancelled) {
            order.orderStatus = "Cancelled";
        }

        const deliveryCharge = order.finalAmount - (order.totalAmount - (order.discountAmount || 0));
        let newTotalAmount = 0;
        order.orderItems.forEach((i) => {
            if (i.itemStatus !== "Cancelled" && i.itemStatus !== "Returned") {
                newTotalAmount += i.price * i.quantity;
            }
        });

        order.totalAmount = newTotalAmount;
        if (newTotalAmount === 0) {
            order.finalAmount = 0;
        } else {
            order.finalAmount = newTotalAmount - (order.discountAmount || 0) + deliveryCharge;
            if (order.finalAmount < 0) order.finalAmount = 0;
        }

        return await order.save();
    },

    findAllOrders: async (page = 1, limit = 10, search = "", status = "", days = 0, sortBy = "newest") => {
        const skip = (page - 1) * limit;
        let query = {};

        if (search) {
            const searchRegex = new RegExp(search, "i");
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);

            if (isObjectId) {
                query._id = search;
            } else {
                query["orderItems.productName"] = searchRegex;
            }
        }

        if (status && status !== "All") {
            query.orderStatus = status;
        }

        if (days > 0) {
            const date = new Date();
            date.setDate(date.getDate() - days);
            query.createdAt = { $gte: date };
        }

        let sortOptions = { createdAt: -1 };
        if (sortBy === "oldest") sortOptions = { createdAt: 1 };
        else if (sortBy === "price_asc") sortOptions = { finalAmount: 1 };
        else if (sortBy === "price_desc") sortOptions = { finalAmount: -1 };

        const totalOrders = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate("user", "fullname email")
            .populate("orderItems.product")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        return { orders, totalOrders, totalPages: Math.ceil(totalOrders / limit), currentPage: page };
    },

    findOrderById: async (orderId) => {
        return await Order.findById(orderId).populate("user", "fullname email phone").populate("orderItems.product");
    },

    updateOrderStatus: async (orderId, status) => {
        const order = await Order.findById(orderId);
        if (!order) return null;

        order.orderStatus = status;

        if (status === "Delivered") {
            order.deliveryDate = new Date();
            order.orderItems.forEach((item) => {
                if (item.itemStatus !== "Cancelled" && item.itemStatus !== "Returned" && item.itemStatus !== "Delivered") {
                    item.itemStatus = "Delivered";
                }
            });
        }

        if (status === "Cancelled") {
            order.orderItems.forEach((item) => {
                if (item.itemStatus !== "Cancelled" && item.itemStatus !== "Returned") {
                    item.itemStatus = "Cancelled";
                }
            });
            order.totalAmount = 0;
            order.finalAmount = 0;
        }

        if (status === "Returned") {
            order.orderItems.forEach((item) => {
                if (item.itemStatus !== "Cancelled" && item.itemStatus !== "Returned") {
                    item.itemStatus = "Returned";
                }
            });
            order.totalAmount = 0;
            order.finalAmount = 0;
        }

        return await order.save();
    },

    updateOrderItemStatus: async (orderId, itemId, status) => {
        const order = await Order.findById(orderId);
        if (!order) return null;

        const item = order.orderItems.id(itemId);
        if (!item) return null;

        item.itemStatus = status;

        const statusPrecedence = {
            Pending: 1,
            Processing: 2,
            Shipped: 3,
            Delivered: 4,
            "Return Requested": 4,
        };

        let activeItems = order.orderItems.filter((i) => i.itemStatus !== "Cancelled" && i.itemStatus !== "Returned");

        if (activeItems.length > 0) {
            let minPrecedence = 5;
            let newStatus = order.orderStatus;

            activeItems.forEach((i) => {
                const p = statusPrecedence[i.itemStatus] || 0;
                if (p < minPrecedence && p > 0) {
                    minPrecedence = p;
                }
            });

            if (minPrecedence < 5) {
                const precedenceToStatus = {
                    1: "Pending",
                    2: "Processing",
                    3: "Shipped",
                    4: "Delivered",
                };
                newStatus = precedenceToStatus[minPrecedence];
            }

            if (newStatus && order.orderStatus !== newStatus) {
                order.orderStatus = newStatus;

                if (order.orderStatus !== "Delivered") {
                    order.deliveryDate = null;
                } else {
                    order.deliveryDate = new Date();
                }
            }
        } else {
            const allCancelled = order.orderItems.every((i) => i.itemStatus === "Cancelled");
            const allReturned = order.orderItems.every((i) => i.itemStatus === "Returned");

            if (allCancelled) order.orderStatus = "Cancelled";
            else if (allReturned) order.orderStatus = "Returned";
        }

        const deliveryCharge = order.finalAmount - (order.totalAmount - (order.discountAmount || 0));
        let newTotalAmount = 0;
        order.orderItems.forEach((i) => {
            if (i.itemStatus !== "Cancelled" && i.itemStatus !== "Returned") {
                newTotalAmount += i.price * i.quantity;
            }
        });

        order.totalAmount = newTotalAmount;
        if (newTotalAmount === 0) {
            order.finalAmount = 0;
        } else {
            order.finalAmount = newTotalAmount - (order.discountAmount || 0) + deliveryCharge;
            if (order.finalAmount < 0) order.finalAmount = 0;
        }

        return await order.save();
    },
    saveOrder: (order) => {
        return order.save();
    },
};

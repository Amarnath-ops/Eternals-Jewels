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
        order.orderItems.forEach(item => {
            item.itemStatus = "Cancelled";
        });
        
        return await order.save();
    },

    findOrdersByUserId: async (userId, page = 1, limit = 5) => {
        const skip = (page - 1) * limit;
        const totalOrders = await Order.countDocuments({ user: userId });
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
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
                    "orderItems.$.returnReason": reason 
                } 
            },
            { new: true }
        );
    },

    cancelOrderItem: async (orderId, itemId) => {
        const order = await Order.findOne({ _id: orderId, "orderItems._id": itemId });
        if (!order) return null;

        const item = order.orderItems.find(item => item._id.toString() === itemId);
        item.itemStatus = "Cancelled";
        
        const allCancelled = order.orderItems.every(item => item.itemStatus === "Cancelled");
        if (allCancelled) {
            order.orderStatus = "Cancelled";
        }

        return await order.save();
    }
};

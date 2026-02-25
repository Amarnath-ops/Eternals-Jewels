import Coupon from "../models/coupon.model.js";

export const couponRepository = {
    create: async (data) => {
        const coupon = new Coupon(data);
        return await coupon.save();
    },

    findByCode: async (code) => {
        return await Coupon.findOne({ code, isActive: true });
    },

    findByCodeString: async (code) => {
        return await Coupon.findOne({ code });
    },

    findById: async (id) => {
        return await Coupon.findById(id);
    },

    findAll: async (filter = {}) => {
        return await Coupon.find(filter).sort({ createdAt: -1 });
    },
    
    findWithPagination: async (filter = {}, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await Coupon.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    },

    countAll: async (filter = {}) => {
        return await Coupon.countDocuments(filter);
    },

    update: async (id, data) => {
        return await Coupon.findByIdAndUpdate(id, data, { new: true });
    },

    delete: async (id) => {
        return await Coupon.findByIdAndDelete(id);
    },

    recordUsage: async (couponId, userId) => {
        return await Coupon.findOneAndUpdate(
            {
                _id: couponId,
                "usedBy.user": { $ne: userId }
            },
            {
                $push: { usedBy: { user: userId, usedCount: 1 } }
            },
            { new: true }
        );
    },
    
    incrementUsage: async (couponId, userId) => {
         return await Coupon.findOneAndUpdate(
            {
                _id: couponId,
                "usedBy.user": userId
            },
            {
                $inc: { "usedBy.$.usedCount": 1 }
            },
            { new: true }
         )
    }
};

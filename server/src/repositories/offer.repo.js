import Offer from "../models/offer.model.js";

export const offerRepository = {
    create: async (offerData) => {
        return await Offer.create(offerData);
    },

    findAll: async ({ page = 1, limit = 10, search = "" }) => {
        const query = search ? { offerName: { $regex: search, $options: "i" } } : {};
        const skip = (page - 1) * limit;
        
        const offers = await Offer.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Offer.countDocuments(query);
        return [offers, total];
    },

    findById: async (id) => {
        return await Offer.findById(id);
    },

    updateById: async (id, updateData) => {
        return await Offer.findByIdAndUpdate(id, updateData, { new: true });
    },

    deleteById: async (id) => {
        return await Offer.findByIdAndDelete(id);
    },

    findActiveOffers: async () => {
        const now = new Date();
        return await Offer.find({
            isActive: true,
            endDate: { $gte: now }
        });
    },

    findByType: async (type) => {
        const now = new Date();
        return await Offer.find({
            offerType: type,
            isActive: true,
            endDate: { $gte: now }
        });
    }
};

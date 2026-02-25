import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const productRepository = {
    create: (data) => Product.create(data),

    findById: (id) => Product.findOne({ _id: id, isDeleted: false }).populate("category").populate("offer"),

    findByIdListed: (id) => Product.findOne({ _id: id, isDeleted: false, isListed: true }).populate("category").populate("offer"),

    updateById: (id, data) =>
        Product.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true }).populate("category").populate("offer"),
    softDelete: (id) => Product.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true }),

    toggleList: (id, isListed) => Product.findOneAndUpdate({ _id: id, isDeleted: false }, { isListed }, { new: true }),
    findAll: async ({ search, page, limit, sort, category, isListed, minPrice, maxPrice, material }) => {
        const matchStage = {
            isDeleted: false,
            ...(isListed !== undefined && { isListed }),
        };

        if (search?.trim()) {
            matchStage.productName = { $regex: search.trim(), $options: "i" };
        }

        if (category) {
            matchStage.category = new mongoose.Types.ObjectId(category);
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            matchStage.variants = {
                $elemMatch: {
                    ...(minPrice !== undefined && { salePrice: { $gte: minPrice } }),
                    ...(maxPrice !== undefined && { salePrice: { $lte: maxPrice } }),
                },
            };
        }
        if (material) {
            const materials = Array.isArray(material) ? material : [material];
            matchStage["variants.material"] = {
                $in: materials.map((m) => new RegExp(m, "i")),
            };
        }

        const sortObj = !sort ? { createdAt: -1 } : sort.startsWith("-") ? { [sort.substring(1)]: -1 } : { [sort]: 1 };
        console.log(matchStage);
        const pipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },
            {
                $lookup: {
                    from: "offers",
                    localField: "offer",
                    foreignField: "_id",
                    as: "offer",
                },
            },
            {
                $unwind: {
                    path: "$offer",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $match: { "category.isListed": true } },
            { $sort: sortObj },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ];

        const [products, count] = await Promise.all([
            Product.aggregate(pipeline),
            Product.aggregate([...pipeline.slice(0, 4), { $count: "total" }]),
        ]);

        return {
            products,
            total: count[0]?.total || 0,
        };
    },

    findByName: (name) => Product.findOne({ productName: new RegExp(`^${name}$`, "i"), isDeleted: false }),
    
    findDistinctMaterials: async () => {
        return await Product.distinct("variants.material", { isDeleted: false, isListed: true });
    },

    updateStock: (productId, variantId, quantity) => Product.updateOne(
        { _id: productId, "variants._id": variantId },
        { $inc: { "variants.$.quantity": -quantity } }
    ),
};

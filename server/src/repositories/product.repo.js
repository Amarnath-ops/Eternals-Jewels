import Product from "../models/product.model.js";

export const productRepository = {
    create: (data) => Product.create(data),

    findById: (id) => Product.findOne({ _id: id, isDeleted: false }).populate("category"),

    findByIdListed: (id) => Product.findOne({ _id: id, isDeleted: false, isListed: true }).populate("category"),

    updateById: (id, data) =>
        Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            data,
            { new: true }
        ).populate("category"),
    softDelete: (id) =>
        Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        ),

    toggleList: (id, isListed) =>
        Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isListed },
            { new: true }
        ),

    findAll: ({ search, page, limit, sort, category, isListed, minPrice, maxPrice, material }) => {
        const query = {
            isDeleted: false,

            ...(search && {
                productName: { $regex: search, $options: "i" },
            }),
            ...(category && { category }),
            ...(isListed !== undefined && { isListed }),
        };

        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceQuery = {};
            if (minPrice !== undefined) {
                priceQuery.salePrice = { ...priceQuery.salePrice, $gte: minPrice };
            }
            if (maxPrice !== undefined) {
                priceQuery.salePrice = { ...priceQuery.salePrice, $lte: maxPrice };
            }
            query.variants = { $elemMatch: priceQuery };
        }

        if (material) {
            const materials = Array.isArray(material) ? material : [material];
            const materialRegexes = materials.map(m => new RegExp(m, "i"));
            query["variants.material"] = { $in: materialRegexes };
        }

        return Promise.all([
            Product.find(query)
                .populate("category", "categoryName")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit),
            Product.countDocuments(query),
        ]);
    },
    
    findByName: (name) => Product.findOne({ productName: new RegExp(`^${name}$`, "i"), isDeleted: false }),
};

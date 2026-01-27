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

        // Variants Filter Construction
        const variantConditions = [];

        // Price Range Filter using $elemMatch to ensure a single variant satisfies the range
        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceQuery = {};
            if (minPrice !== undefined) {
                priceQuery.salePrice = { ...priceQuery.salePrice, $gte: minPrice };
            }
            if (maxPrice !== undefined) {
                priceQuery.salePrice = { ...priceQuery.salePrice, $lte: maxPrice };
            }
            // Use $elemMatch on variants array
            query.variants = { $elemMatch: priceQuery };
        }

        // Material Filter
        if (material) {
            const materials = Array.isArray(material) ? material : [material];
            const materialRegexes = materials.map(m => new RegExp(m, "i"));

            // If we already have a variants query (from price), we need to handle it carefully.
            // But 'variants.material' dot notation works independently of 'variants' $elemMatch usually.
            // Check: { variants: { $elemMatch: ... }, "variants.material": ... } works in Mongo.
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

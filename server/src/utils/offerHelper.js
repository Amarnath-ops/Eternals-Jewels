import { offerRepository } from "../repositories/offer.repo.js";

export const applyOffersToProducts = async (products) => {
    if (!products || (Array.isArray(products) && products.length === 0)) return products;

    const isArray = Array.isArray(products);
    const productList = isArray ? products : [products];
    
    const activeOffers = await offerRepository.findActiveOffers();
    
    const updatedProducts = productList.map(product => {
        const p = product.toObject ? product.toObject() : JSON.parse(JSON.stringify(product));
        
        const productOfferId = p.offer?._id || p.offer;
        const categoryOfferId = p.category?.offer?._id || p.category?.offer;
        
        const relevantOffers = activeOffers.filter(o => 
            (productOfferId && o._id.toString() === productOfferId.toString()) ||
            (categoryOfferId && o._id.toString() === categoryOfferId.toString())
        );

        if (relevantOffers.length > 0) {
            const bestOffer = relevantOffers.reduce((max, current) => 
                (current.discountPercentage > max.discountPercentage) ? current : max
            );

            p.variants = p.variants.map(variant => {
                const basePrice = (variant.salePrice && variant.salePrice > 0) ? variant.salePrice : variant.regularPrice;
                const discount = (basePrice * bestOffer.discountPercentage) / 100;
                variant.salePrice = Math.round(basePrice - discount);
                variant.appliedOffer = {
                    name: bestOffer.offerName,
                    discountPercentage: bestOffer.discountPercentage
                };
                return variant;
            });
        } else {
            p.variants = p.variants.map(variant => {
                if (!variant.salePrice && variant.regularPrice) {
                    variant.salePrice = variant.regularPrice;
                }
                return variant;
            });
        }
        return p;
    });

    return isArray ? updatedProducts : updatedProducts[0];
};

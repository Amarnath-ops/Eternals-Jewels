import { categoryRepository } from "../../repositories/categories.repo.js";

export const getLandingCategoriesService = async () => {
    const [categories] = await categoryRepository.findAll({
        search: "",
        page: 1,
        limit: 5,
        sort: "-createdAt",
        select: "categoryName categoryDescription thumbnail",
        isListed:true
    });
    return categories;
};

export const getFilterCategoriesService = async () => {
    const [categories] = await categoryRepository.findAll({
        page: 1,
        limit: 100,
        sort: "categoryName",
        select: "categoryName _id",
        isListed: true,
    });
    return categories;
};

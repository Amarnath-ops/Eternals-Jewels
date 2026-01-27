import multer from "multer";

export const uploadAvatar = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatar");

export const uploadCategoryImage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
}).single("thumbnail");

export const uploadProductImage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImages", maxCount: 4 },
]);

import express from "express";
import {
    addProduct,
    deleteProduct,
    getProducts,
    getProductById,
    toggleProduct,
    updateProduct,
} from "../../controllers/admin/product.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { onlyAdmin } from "../../middlewares/admin.middleware.js";
import { uploadProductImage } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protect, onlyAdmin);

router.post("/add-product", uploadProductImage, addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", uploadProductImage, updateProduct);
router.patch("/:id/toggle", toggleProduct);
router.delete("/:id", deleteProduct);

export default router;

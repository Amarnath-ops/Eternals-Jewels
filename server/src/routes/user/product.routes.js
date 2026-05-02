import express from "express";
import { getProducts, getProductById, getMaterials } from "../../controllers/user/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/materials", getMaterials);
router.get("/:id", getProductById);

export default router;

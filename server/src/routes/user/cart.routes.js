import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { addToCart, getCart, removeFromCart, updateQuantity, clearCart } from "../../controllers/user/cart.controller.js";

const router = express.Router();

router.use(protect)

router.post("/",addToCart);
router.get("/",getCart)
router.patch("/",updateQuantity)
router.delete("/",removeFromCart)
router.delete("/clear",clearCart)
export default router
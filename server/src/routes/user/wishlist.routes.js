import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
    moveItemToCart,
} from "../../controllers/user/wishlist.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", addToWishlist);
router.get("/", getWishlist);
router.delete("/", removeFromWishlist);
router.delete("/clear", clearWishlist);
router.post("/move-to-cart", moveItemToCart);

export default router;

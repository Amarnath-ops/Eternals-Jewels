import express from "express";
import { applyCoupon, getCoupons } from "../../controllers/user/coupon.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getCoupons);
router.post("/apply", protect, applyCoupon);

export default router;

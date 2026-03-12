import express from "express";
import {
    getCoupons,
    createCoupon,
    getCouponById,
    updateCoupon,
    toggleCouponStatus,
    deleteCoupon
} from "../../controllers/admin/coupon.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { onlyAdmin } from "../../middlewares/admin.middleware.js";

const router = express.Router();

router.use(protect, onlyAdmin);

router.get("/", getCoupons);
router.post("/", createCoupon);
router.get("/:id", getCouponById);
router.put("/:id", updateCoupon);
router.patch("/:id/status", toggleCouponStatus);
router.delete("/:id", deleteCoupon);

export default router;

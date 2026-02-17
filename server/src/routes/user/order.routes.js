import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { placeOrder, getOrders, cancelOrder } from "../../controllers/user/order.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", placeOrder);
router.get("/", getOrders);
router.patch("/:orderId/cancel", cancelOrder);

export default router;

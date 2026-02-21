import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { placeOrder, getOrders, cancelOrder, getOrderById, returnOrder, cancelOrderItem, verifyPayment, retryPayment } from "../../controllers/user/order.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", placeOrder);
router.get("/", getOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/cancel", cancelOrder);
router.patch("/:orderId/cancel/:itemId", cancelOrderItem);
router.patch("/:orderId/return/:itemId", returnOrder);
router.post("/verify-payment", verifyPayment);
router.post("/:orderId/retry-payment", retryPayment);

export default router;

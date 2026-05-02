import express from "express";
import { 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus, 
    updateOrderItemStatus 
} from "../../controllers/admin/order.controller.js";
import { protect } from "../../middlewares/auth.middleware.js"; 

const router = express.Router();

router.get("/", protect, getAllOrders);
router.get("/:orderId", protect, getOrderById);
router.patch("/:orderId/status", protect, updateOrderStatus);
router.patch("/:orderId/items/:itemId/status", protect, updateOrderItemStatus);

export default router;

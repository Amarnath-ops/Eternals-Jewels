import express from "express";
import { 
    getSalesReport, 
    downloadSalesReport,
    getDashboardStats
} from "../../controllers/admin/report.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { onlyAdmin } from "../../middlewares/admin.middleware.js";
const router = express.Router();

router.use(protect, onlyAdmin);
router.get("/", getSalesReport);
router.get("/stats", getDashboardStats);
router.get("/download", downloadSalesReport);

export default router;

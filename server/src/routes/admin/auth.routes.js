import express from "express";
import { adminLogin, adminLogout, adminRefresh } from "../../controllers/admin/auth.controller.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.post("/refresh", adminRefresh);

export default router;

import express from "express";
import { getWallet } from "../../controllers/user/wallet.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", protect, getWallet);

export default router;

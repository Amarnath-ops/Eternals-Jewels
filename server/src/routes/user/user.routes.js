import express from "express";
import {
    getUserData,
    requestEmailChange,
    updateProfile,
    verifyEmailChangeOtp,
} from "../../controllers/user/user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadAvatar } from "../../middlewares/upload.middleware.js";
import { addAddress, deleteAddress, getAddress, updateAddress } from "../../controllers/user/address.controller.js";

const router = express.Router();

router.get("/me", protect, getUserData);
router.put("/edit", protect, uploadAvatar, updateProfile);
router.post("/email/change", protect, requestEmailChange);
router.post("/email/verify", protect, verifyEmailChangeOtp);
router.post("/address", protect, addAddress);
router.get("/address", protect, getAddress);
router.put("/address/:addressId",protect,updateAddress)
router.delete("/address/:addressId",protect,deleteAddress)
export default router;

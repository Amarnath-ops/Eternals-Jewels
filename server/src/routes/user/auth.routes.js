import express from "express"
import {forgotPasswordOTP, forgotPasswordVerify, login, logout, refresh, resendOTP, resetPassword, signup, verifyOTP } from "../../controllers/user/auth.controller.js"

const router = express.Router()

router.post("/register",signup);
router.post("/refresh",refresh);
router.post("/login",login);
router.post("/logout",logout);
router.post("/verify-otp",verifyOTP)
router.post("/resend-otp",resendOTP)
router.post("/forgot-password",forgotPasswordOTP)
router.post("/forgot-password-verify",forgotPasswordVerify)
router.post("/reset-password",resetPassword)
export default router
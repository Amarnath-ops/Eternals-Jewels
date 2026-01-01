import express from "express"
import {forgotPasswordOTP, forgotPasswordVerify, googleCallback, login, logout, refresh, resendOTP, resetPassword, signup, verifyOTP } from "../../controllers/user/auth.controller.js"
import passport from "passport";

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
router.get("/google",passport.authenticate("google",{
  scope:["profile","email"],
  session:false
}));
router.get("/google/callback",
  passport.authenticate("google",{
    session:false,
    failureRedirect:`${process.env.FRONTEND_URL}/login`
  }),
  googleCallback
)
export default router
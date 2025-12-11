import express from "express"
import { signUp } from "../../controllers/user/auth.controller.js"

const router = express.Router()

router.post("/register",signUp)

export default router
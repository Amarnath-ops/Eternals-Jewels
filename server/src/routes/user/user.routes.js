import express from "express"
import { getUserData } from "../../controllers/user/user.controller.js"
import { protect } from "../../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/me",protect,getUserData)

export default router
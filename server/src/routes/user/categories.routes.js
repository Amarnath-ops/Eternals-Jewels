import express from "express"
import { getLandingCategories, getFilterCategories } from "../../controllers/user/categories.controller.js"

const router = express.Router()

router.get("/filters", getFilterCategories)
router.get("/landing",getLandingCategories)

export default router
import express from "express"
import { getAllCustomers, toggleBlockUser } from "../../controllers/admin/customers.controller.js"
import { protect } from "../../middlewares/auth.middleware.js"
import { onlyAdmin } from "../../middlewares/admin.middleware.js"


const router = express.Router()

router.get("/",protect,onlyAdmin,getAllCustomers)
router.patch("/:id/status",protect,onlyAdmin,toggleBlockUser)

export default router
import express from "express"
import { getAllCustomers, toggleBlockUser } from "../../controllers/admin/customers.controller.js"


const router = express.Router()

router.get("/",getAllCustomers)
router.patch("/:id/status",toggleBlockUser)

export default router
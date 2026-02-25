import express from "express";
import {
    createOffer,
    getOffers,
    updateOffer,
    deleteOffer,
    toggleOffer,
    getActiveOffersByType,
    getOfferById,
} from "../../controllers/admin/offer.controller.js";
import { onlyAdmin } from "../../middlewares/admin.middleware.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect,onlyAdmin)
router.get("/active", getActiveOffersByType);
router.post("/", createOffer);
router.get("/",  getOffers);
router.get("/:id", getOfferById);
router.patch("/:id",  updateOffer);
router.delete("/:id",  deleteOffer);
router.patch("/:id/toggle", toggleOffer);

export default router;

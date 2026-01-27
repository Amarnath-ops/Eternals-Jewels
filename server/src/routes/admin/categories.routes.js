  import express from "express";
  import {
      addCategory,
      deleteCategory,
      getCategory,
      toggleCategory,
      updateCategory,
  } from "../../controllers/admin/categories.controller.js";
  import { protect } from "../../middlewares/auth.middleware.js";
  import { onlyAdmin } from "../../middlewares/admin.middleware.js";
  import { uploadCategoryImage } from "../../middlewares/upload.middleware.js";

  const router = express.Router();

  router.use(protect, onlyAdmin);
  router.post("/add-category", uploadCategoryImage, addCategory);
  router.get("/", getCategory);
  router.put("/:id", uploadCategoryImage, updateCategory);
  router.patch("/:id/toggle", toggleCategory);
  router.delete("/:id", deleteCategory);
  export default router;

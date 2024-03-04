import express from "express";
import { isAdmin, requiredSignIn } from "../middleware/authMiddleware.js";
import {
  AllCategoryController,
  DeleteCategoryController,
  SingleCategoryController,
  createCategoryController,
  updateCategoryController,
} from "../controller/CreateCategoryController.js";

const router = express.Router();

router.post(
  "/create-category",
  requiredSignIn,
  isAdmin,
  createCategoryController
);

router.put(
  "/update-category/:id",
  requiredSignIn,
  isAdmin,
  updateCategoryController
);

router.get("/get-category", AllCategoryController);

router.get("/categories/:slug", SingleCategoryController);

router.delete("/delete-categroy/:id", DeleteCategoryController);

export default router;

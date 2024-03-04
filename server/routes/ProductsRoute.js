import express from "express";
import { isAdmin, requiredSignIn } from "../middleware/authMiddleware.js";

import formidable from "express-formidable";
import {
  SearchProductController,
  SingleProdctControllr,
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getAllProductController,
  productCategroyController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoContrller,
  relatedProductController,
  updateProductController,
} from "../controller/ProductController.js";

const router = express.Router();

router.post(
  "/create-product",
  requiredSignIn,
  isAdmin,
  formidable(),
  createProductController
);
router.put(
  "/update-products/:id",
  requiredSignIn,
  isAdmin,
  formidable(),
  updateProductController
);
router.get("/get-product", getAllProductController);

router.get("/get-product/:slug", SingleProdctControllr);

router.delete("/delete-product/:pid", deleteProductController);

// get photo img

router.get("/product-photo/:pid", productPhotoContrller);

// filter Product
router.post("/product-filters", productFiltersController);

router.get("/product-count", productCountController);

router.get("/product-list/:page", productListController);

router.get("/search/:keyword", SearchProductController);

// similar Products

router.get("/related-product/:pid/:cid", relatedProductController);

// product id mean product itself and want to show the category  of that product

router.get("/product-category/:slug", productCategroyController);

router.get("/braintree/token", braintreeTokenController);

router.post("/braintree/payment", requiredSignIn, braintreePaymentController);

export default router;

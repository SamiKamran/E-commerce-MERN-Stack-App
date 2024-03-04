import express from "express";
import {
  forgotPasswordController,
  registerController,
  loginController,
  updateProfileController,
  getOrderController,
  getAllOrdersController,
  OrderStatusController,
} from "../controller/authController.js";
import { isAdmin, requiredSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-Password", forgotPasswordController);

// protected route   not get into webesite unless he provide his email and password

router.get("/user-auth", requiredSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", requiredSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put("/profile", requiredSignIn, updateProfileController);

router.get("/orders", requiredSignIn, getOrderController);

router.get("/all-orders", requiredSignIn, isAdmin, getAllOrdersController);

router.put(
  "/order-status/:orderId",
  requiredSignIn,
  isAdmin,
  OrderStatusController
);

export default router;

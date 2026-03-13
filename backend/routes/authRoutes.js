// routes/authRoute.js

import express from "express";
import {
  registerController,
  loginController,
  addressController,
  orderStatusController,
  getAllOrdersController,
  getOrdersController,
  sendInvoiceController,
  getOrderByIdController,
  forgotPasswordController,
} from "../controllers/userController.js";
import { isAdmin, isSuperAdmin, requireSignIn } from "../middleware/authMiddleware.js";


const router = express.Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
// Protected Routes
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/super-admin-auth", requireSignIn, isSuperAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});



// user orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

// order- address
router.post(
  "/order-address",
  requireSignIn,
  addressController
);
router.get("/order/:orderId", getOrderByIdController);

router.post(
  "/send-invoice/:orderId",
  requireSignIn,
  sendInvoiceController
);


export default router;

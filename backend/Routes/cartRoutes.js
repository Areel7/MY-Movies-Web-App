import express from "express";

const router = express.Router();

// Controllers
import {
  addToCart,
  clearCart,
  getUserCart,
  removeCartItem,
} from "../Controllers/cartController.js";

// MiddleWares
import { athunticate } from "../Middlewares/authMiddleware.js";

// Restricted routes
router.route("/").get(athunticate, getUserCart);
router.route("/add").post(athunticate, addToCart);
router.route("/remove/:movieId").delete(athunticate, removeCartItem);
router.route("/clear").delete(athunticate, clearCart);

export default router;

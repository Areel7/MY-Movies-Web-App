import express from "express";

const router = express.Router();

// Controller
import { placeOrder } from "../Controllers/orderController.js";

// Middleware
import { athunticate } from "../Middlewares/authMiddleware.js";

router.route("/").post(athunticate, placeOrder);

export default router;

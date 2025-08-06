import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import './Utils/cronJob.js';

// Files
import connectDB from "./Config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import genreRoutes from "./Routes/genreRoutes.js";
import moviesRoutes from "./Routes/moviesRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";

// configuration

dotenv.config();

connectDB();

const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


const PORT = process.env.PORT || 3000;

// Routes

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movie", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

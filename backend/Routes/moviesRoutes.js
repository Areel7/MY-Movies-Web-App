import express from "express"

const router = express.Router();

// Controller
import { createMovie, getAllMovies, getSpecificMovie, updateMovie, movieRivew, deleteMovie, deleteComment, getNewMovies, getTopMovies, getRandomMovies } from "../Controllers/movieController.js";

// Middleware
import { athunticate, authorizeAdmin } from "../Middlewares/authMiddleware.js";
import checkId from "../Middlewares/checkId.js";


// Public Routes
router.get('/all-movies', getAllMovies);
router.get('/specific-movie/:id', getSpecificMovie);
router.get('/new-movies', getNewMovies);
router.get('/top-movies', getTopMovies);
router.get('/random-movies', getRandomMovies);

// Restricted Routes
router.post('/:id/reviews', athunticate, checkId, movieRivew);


// Admin
router.post("/create-movie", athunticate, authorizeAdmin, createMovie);
router.put('/update-movie/:id', athunticate, authorizeAdmin, updateMovie);
router.delete('/delete-movie/:id', athunticate, authorizeAdmin, deleteMovie);
router.delete('/delete-comment', athunticate, authorizeAdmin, deleteComment);


export default router; 
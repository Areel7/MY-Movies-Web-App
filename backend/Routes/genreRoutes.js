import express from 'express';

const router = express.Router();

// Controller functions
import { createGenre, updateGenre, removeGenre, listGenres, readGenre } from '../Controllers/genreController.js';

// Middleware
import { athunticate, authorizeAdmin } from '../Middlewares/authMiddleware.js';

router.route('/').post(athunticate, authorizeAdmin, createGenre)

router.route('/:id').put(athunticate, authorizeAdmin, updateGenre) 

router.route('/:id').delete(athunticate, authorizeAdmin, removeGenre)

router.route('/genres').get(listGenres)

router.route('/:id').get(readGenre);

export default router;
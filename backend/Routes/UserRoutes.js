import express from 'express';

// Controllers
import { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile } from '../Controllers/userController.js';

// Middleware
import { athunticate, authorizeAdmin } from '../Middlewares/authMiddleware.js';



const router = express.Router();

router.route('/').post(createUser).get(athunticate, authorizeAdmin, getAllUsers);

router.post('/auth', loginUser);

router.post('/logout', logoutCurrentUser);

router.route('/profile').get(athunticate, getCurrentUserProfile).put( athunticate, updateCurrentUserProfile);


export default router;
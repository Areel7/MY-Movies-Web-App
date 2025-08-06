import jwt from 'jsonwebtoken';

import  User  from '../Models/User.js';

import asyncHandler from './asyncHandler.js';


// Check if user is authenticated or not
const athunticate = asyncHandler(async (req, res, next) => {
    let token;
    
    //Read JWT from jwt cookie
    token = req.cookies.jwt;

    if(token) {
        try{
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find the user by ID from the decoded token
            req.user = await User.findById(decoded.userId).select('-password');
            
            next();

        }catch(error){
            console.error(error);
            res.status(401)
            throw new Error('Not authorized, token failed');
            return;
        }
    }else{
        res.status(401);
        throw new Error('Not authorized, no token');
    };
});

// Check if the user is admin or not 
const authorizeAdmin = asyncHandler(async (req, res, next) => {
    if(req.user && req.user.isAdmin)
    {
        next();
    }
    else{
        res.status(401).send("Not authorized as admin");
    };
}); 

export {athunticate, authorizeAdmin};
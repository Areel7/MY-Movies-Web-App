import User from "../Models/User.js";

import bcrypt from "bcryptjs";

import asyncHsandler from "../Middlewares/asyncHandler.js";

import genrateToken from "../Utils/createToken.js";

// Controller

const createUser = asyncHsandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    genrateToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Internal server error");
  }
});

const loginUser = asyncHsandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordMatched) {
      genrateToken(res, existingUser._id);
      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } else {
    res.status(400);
    throw new Error("User does not exist");
  }
});

const logoutCurrentUser = asyncHsandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "User logged out successfully",
  });
});

const getAllUsers = asyncHsandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

const getCurrentUserProfile = asyncHsandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  
  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateCurrentUserProfile = asyncHsandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        }); 
    }else {
        res.status(404);
        throw new Error("User not found");
    }
}); 

export { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile };

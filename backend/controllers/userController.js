import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";
import { uploadImage } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// User Registration
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  // Check if avatar is provided and is a valid image
  const avatarPath = req.file?.path;
  if (
    !avatarPath ||
    !(
      avatarPath.endsWith(".png") ||
      avatarPath.endsWith(".jpg") ||
      avatarPath.endsWith(".jpeg")
    )
  ) {
    throw new ApiError(400, "Avatar is required and should be an image");
  }
  const avatar = await uploadImage(avatarPath); // Upload avatar

  // Create user
  const user = await User.create({
    username,
    password,
    email,
    avatar: avatar.url,
  });

  // Get Created User and remove Password and refreshToken fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering User");
  }

  // Send response
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});

// User Login
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // Check if Password matches
  if (!(await user.verifyPassword(password))) {
    throw new ApiError(401, "Username or Password invalid");
  }

  // Generate Refresh Token and Access Token
  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();
  await User.findByIdAndUpdate(user._id, {
    refreshToken: refreshToken,
  });

  // Send Refresh and Access Token as httpOnly cookies
  const cookieOptions = { httpOnly: true, secure: true };
  res
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, user, "User logged in successfully"));
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  // Revoke Refresh Token of currently logged in User (verifyJWT handles user extraction)
  await User.findByIdAndUpdate(user._id, {
    refreshToken: null,
  });

  // Send Response
  res
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Renew Access Token
const renewTokens = asyncHandler(async (req, res) => {
  // Get refresh token sent in cookie
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Unauthorised request! Refresh Token is Invalid");
  }

  // Decode refresh token to get user_id stored in it
  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  // Get user and check validity of refresh token
  const user = await User.findById(decodedToken._id);
  if (!user || user?.refreshToken !== refreshToken) {
    throw new ApiError(403, "Invalid Refresh Token");
  }

  // Generate and send a new Access Token as httpOnpy cookie
  const newAccessToken = user.generateAccessToken();
  res
    .cookie("accessToken", newAccessToken, { httpOnly: true, secure: true })
    .send(new ApiResponse(200, {}, "Access Token Renewed Successfully"));
});

const getLoggedInUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.send(new ApiResponse(200, user, "User fetched successfully"));
});

export { registerUser, loginUser, logoutUser, renewTokens, getLoggedInUser };

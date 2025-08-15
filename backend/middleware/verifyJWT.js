import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
  try {
    // Get the access token from cookies or headers
    const accessToken =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      throw new ApiError(403, "Unauthorized request");
    }

    // Decode the access token to get user info stored in it
    const decodedToken = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    // If no valid user found, return Error
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(403, "Invalid Access Token");
    }

    // Add the user info to the request to be used by the other middlewares/routes
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(403, "Unauthorized Access");
  }
};

export { verifyJWT };

import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  renewTokens,
  getLoggedInUser,
} from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

// normal routes
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/refresh-token").get(renewTokens);
router.route("/logged-in").get(verifyJWT, getLoggedInUser);

export default router;

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

// Initialize Express app
const app = express();
app.use(express.static("./public/tmp")); // Save files like avatar images, documents, etc, temporarily in /public/temp directory
app.use(express.json({ limit: "16kB" })); // JSON body parser
app.use(express.urlencoded({ limit: "16kB" })); // URL-encoded body parser
app.use(cookieParser()); // Cookie Parser
// Setup CORS
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
  })
);

// Routes
app.use("/user", userRoutes);

// Error Handling Middleware
app.use(errorHandler);

// setup server
const startServer = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI); // Connect to MongoDB
    console.log("Database connected successfully");
    console.log("Database Host: ", connectionInstance.connection.host);
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};
startServer();

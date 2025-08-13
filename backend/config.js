import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

export const config = {
  port: process.env.PORT || 3000,
  frontendBaseURL: process.env.FRONTEND_BASE_URL,
};

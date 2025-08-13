import express from "express";
import cors from "cors";
import session from "express-session";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import { config } from "./config.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: config.frontendBaseURL,
    credentials: true,
  })
);
const sessionOptions = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
};
app.use(session(sessionOptions));

app.use("/chatbot", chatbotRoutes);

app.listen(config.port, async () => {
  try {
    console.log("Server is initializing....");
    console.log("Status: OK");
  } catch (e) {
    console.error(e);
  }
});

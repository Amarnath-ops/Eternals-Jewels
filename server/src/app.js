import express from "express"
import cors from "cors"
import authUserRoutes from "./routes/user/auth.routes.js"
import userRoutes from "./routes/user/user.routes.js"
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.js"

const app = express()

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())
app.use(passport.initialize())

// Routes
app.use("/api/v1/auth",authUserRoutes);
app.use("/api/v1/users",userRoutes);

export default app
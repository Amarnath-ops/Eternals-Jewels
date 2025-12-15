import express from "express"
import cors from "cors"
import authUserRoutes from "./routes/user/auth.routes.js"
import cookieParser from "cookie-parser";

const app = express()

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Routes
app.use("/api/v1/auth",authUserRoutes);

export default app
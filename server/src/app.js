import express from "express"
import cors from "cors"
import authUserRoutes from "./routes/user/auth.routes.js"

const app = express()

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth",authUserRoutes);

export default app
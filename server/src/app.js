import express from "express";
import cors from "cors";
import authUserRoutes from "./routes/user/auth.routes.js";
import adminAuthRoutes from "./routes/admin/auth.routes.js";
import userRoutes from "./routes/user/user.routes.js";
import adminCustomersRoutes from "./routes/admin/customers.routes.js";
import adminCategoriesRoutes from "./routes/admin/categories.routes.js";
import adminProductRoutes from "./routes/admin/product.routes.js";
import userCategoryRoutes from "./routes/user/categories.routes.js"
import userProductRoutes from "./routes/user/product.routes.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.js";

const app = express();


app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.use("/api/v1/auth", authUserRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", userCategoryRoutes);
app.use("/api/v1/products", userProductRoutes);



app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin/customers", adminCustomersRoutes);
app.use("/api/v1/admin/categories", adminCategoriesRoutes);
app.use("/api/v1/admin/products", adminProductRoutes);

export default app;


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
import userCartRoutes from "./routes/user/cart.routes.js"
import wishlistRoutes from "./routes/user/wishlist.routes.js";
import userOrderRoutes from "./routes/user/order.routes.js";
import userWalletRoutes from "./routes/user/wallet.route.js"
import adminOrderRoutes from "./routes/admin/order.routes.js";
import adminOfferRoutes from "./routes/admin/offer.routes.js";
import couponRoutes from "./routes/user/coupon.route.js"
import adminCouponRoutes from "./routes/admin/coupon.routes.js"
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
app.use("/api/v1/cart", userCartRoutes)
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/orders", userOrderRoutes);
app.use("/api/v1/wallet", userWalletRoutes)
app.use("/api/v1/coupons", couponRoutes)


app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin/customers", adminCustomersRoutes);
app.use("/api/v1/admin/categories", adminCategoriesRoutes);
app.use("/api/v1/admin/products", adminProductRoutes);
app.use("/api/v1/admin/orders", adminOrderRoutes);
app.use("/api/v1/admin/coupons", adminCouponRoutes);
app.use("/api/v1/admin/offers", adminOfferRoutes);


export default app;


import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/user/Login";
import Navbar from "../components/Navbar";
import SignUpPage from "../pages/user/Signup";
import HomePage from "../pages/user/Home";
import Footer from "../components/Footer";
import AboutUsPage from "@/pages/user/About";
import ContactPage from "@/pages/user/ContactUs";
import ShopPage from "@/pages/user/Shop";
import OtpVerification from "@/pages/user/OtpVerify";
import ForgotPasswordPage from "@/pages/user/ForgotPassword";
import ResetPassword from "@/pages/user/ResetPassword";

const UserRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<SignUpPage />} />
                <Route path="/" element={<HomePage/>} />
                <Route path="/about" element={<AboutUsPage/>} />
                <Route path="/contact" element={<ContactPage/>} />
                <Route path="/shop" element={<ShopPage/>} />
                <Route path="/verify-otp" element={<OtpVerification/>} />
                <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
                <Route path="/reset-password" element={<ResetPassword/>} />
            </Routes>
            <Footer/>

        </>
    );
};

export default UserRoutes;

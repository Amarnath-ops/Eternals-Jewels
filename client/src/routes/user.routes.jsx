import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/user/Login";
import SignUpPage from "../pages/user/Signup";
import HomePage from "../pages/user/Home";
import Footer from "../components/Footer";
import AboutUsPage from "@/pages/user/About";
import ContactPage from "@/pages/user/ContactUs";
import ShopPage from "@/pages/user/Shop";
import OtpVerification from "@/pages/user/OtpVerify";
import ForgotPasswordPage from "@/pages/user/ForgotPassword";
import ResetPassword from "@/pages/user/ResetPassword";
import { useSelector } from "react-redux";
import GoogleSuccess from "@/pages/user/GoogleSuccess";
import MyProfile from "@/pages/user/MyProfile";
import EditProfile from "@/pages/user/EditProfile";
import MyAddressPage from "@/pages/user/MyAddress";
import AddressEditPage from "@/pages/user/AddressEditPage";
import AddressAddPage from "@/pages/user/AddAddress";
import ChangePassword from "@/pages/user/ChangePassword";
import ProfileDashboard from "@/layouts/ProfileDashboard";

const UserRoutes = () => {
    const accessToken = useSelector((state) => state.user.accessToken);
    const isLogin = useSelector((state) => state.user.isLogin);
    console.log("access token recieved", accessToken);
    return (
        <>
            <Routes>
                <Route path="/login" element={accessToken ? <Navigate to="/" replace /> : <LoginPage />} />
                <Route path="/register" element={accessToken ? <Navigate to="/" replace /> : <SignUpPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/verify-otp" element={accessToken ? <Navigate to="/" replace /> : <OtpVerification />} />
                <Route
                    path="/forgot-password"
                    element={accessToken ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
                />
                <Route path="/reset-password" element={accessToken ? <Navigate to="/" replace /> : <ResetPassword />} />
                <Route
                    path="/google-success"
                    element={accessToken ? <Navigate to="/" replace /> : <GoogleSuccess />}
                ></Route>
                <Route path="/account" element={isLogin ? <ProfileDashboard /> : <LoginPage />}>
                    <Route index path="profile" element={<MyProfile />}></Route>
                    <Route path="edit-profile" element={<EditProfile />}></Route>
                    <Route path="address" element={<MyAddressPage />}></Route>
                    <Route path="edit-address/:addressId" element={<AddressEditPage />}></Route>
                    <Route path="add-address/" element={<AddressAddPage />}></Route>
                    <Route path="change-password" element={<ChangePassword />}></Route>
                </Route>
            </Routes>
            <Footer />
        </>
    );
};

export default UserRoutes;

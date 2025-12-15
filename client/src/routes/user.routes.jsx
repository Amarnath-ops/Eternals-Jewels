import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/user/Login";
import Navbar from "../components/Navbar";
import SignUpPage from "../pages/user/Signup";

const UserRoutes = () => {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<SignUpPage />} />
            </Routes>
        </>
    );
};

export default UserRoutes;

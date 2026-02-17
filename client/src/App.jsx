import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminRoutes from "./routes/Admin.routes";
import UserRoutes from "./routes/User.routes";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/*" element={<UserRoutes />} />
            </Routes>
        </>
    );
}

export default App;

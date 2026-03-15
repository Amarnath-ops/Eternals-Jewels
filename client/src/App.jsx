import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminRoutes from "./routes/admin.routes";
import UserRoutes from "./routes/user.routes";
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

import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminRoutes from "./routes/Admin.routes";
import UserRoutes from "./routes/User.routes";
import {  Toaster } from "sonner";
function App() {
    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/*" element={<UserRoutes />} />
            </Routes>
        </>
    );
}

export default App;

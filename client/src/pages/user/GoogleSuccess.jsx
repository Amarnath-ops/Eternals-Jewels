import { SpinnerBadge } from "@/components/Spinner";
import { setCredentials } from "@/store/user/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const GoogleSuccess = () => {
    const disptach = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            disptach(setCredentials({ accessToken: token }));
            navigate("/", { replace: true });
        } else {
            navigate("/login");
        }
    });
    return <div>
        <SpinnerBadge content={"Logging with Google."}/>
    </div>;
};

export default GoogleSuccess;

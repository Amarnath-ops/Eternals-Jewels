import React, { useState } from "react";
import { Heart, ShoppingCart, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import axiosInstance from "@/api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/user/authSlice";
import { SpinnerBadge } from "@/components/Spinner";
import { resetPasswordSchema } from "@/validations/auth.schema";
import useZodForm from "@/hooks/useZodForm";
import FormWrapper from "@/components/form/Form";
import FormInput from "@/components/form/FormInput";

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const { handleSubmit, register, formState:{errors}} = useZodForm(resetPasswordSchema);
    const location = useLocation();
    const email = location.state.email;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onSubmit = async (data) => {
      setLoading(true)
        try {
            const res = await axiosInstance.post("/auth/reset-password", {
                email,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });
            dispatch(setCredentials({ accessToken: res.data.data.token, user: res.data.data.user }));
            navigate("/");
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally{
          setLoading(false)
        }
    };
    return (
        <>
        {loading&&<SpinnerBadge content={"Hang on, resetting your password..."}/>}
            <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
                <Navbar />

                <div className="grow flex flex-col items-center justify-center pb-32">
                    <h1 className="text-3xl font-bold mb-16">Enter new Password</h1>
                    <FormWrapper onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5 w-full max-w-md">
                        <FormInput
                            type="password"
                            name="password"
                            placeholder="Enter new Password"
                            className="w-full p-4 bg-white rounded-xl text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#1D4C43]"
                            register={register}
                            error={errors.password}
                        />
                        <FormInput
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            className="w-full p-4 bg-white rounded-xl text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#1D4C43]"
                            register={register}
                            error={errors.confirmPassword}
                        />
                        <button className="w-full p-4 bg-[#1D4C43] text-white font-medium rounded-xl hover:bg-[#163a33] transition-colors mt-4">
                            Verify
                        </button>
                    </FormWrapper>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;

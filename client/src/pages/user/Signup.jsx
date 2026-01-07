import React, { useState } from "react";
import { signupSchema } from "../../validations/auth.schema";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Eye, EyeClosed } from "lucide-react";
import useZodForm from "@/hooks/useZodForm";
import FormWrapper from "@/components/form/Form";
import FormInput from "@/components/form/FormInput";
import { SpinnerBadge } from "@/components/Spinner";
import {  useSignupUser } from "@/hooks/tanstack_Queries/auth/useSignupUser";
const SignUpPage = () => {
    const navigate = useNavigate()
    const {mutateAsync,isPending} = useSignupUser()
    const initialState = {
        password: false,
        confirmPassword: false,
    };
    const [eyeButton, setEyeButton] = useState(initialState);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useZodForm(signupSchema);
    const onSignup = async (data) => {
        data.phone = `+91 ${data.phone}`;
        try {
            await mutateAsync(data)
            navigate("/verify-otp", { state: { email: data.email } });
        } catch (error) {
            console.log(error);
            if (error.response.data.fieldName) {
                setError(error.response.data.fieldName, { message: error.response.data.message });
            }
        }
    };
    if(isPending){
        return <SpinnerBadge content={"Sending OTP..."}/>
    }
    return (
        <>
            <Navbar homePage={false} />
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md p-6">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">SignUp</h1>

                    {/* Form */}
                    <FormWrapper className="space-y-4" onSubmit={handleSubmit(onSignup)}>
                        {/* Full Name */}
                        <div>
                            <FormInput
                                label="Full Name"
                                type="text"
                                name="fullname"
                                placeholder="John Doe"
                                className={`w-full px-4 py-2 rounded-lg border ${
                                    errors.fullname ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700 placeholder-gray-400 bg-white`}
                                register={register}
                                error={errors.fullname}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <FormInput
                                label="Email"
                                type="text"
                                name="email"
                                placeholder="name@company.com"
                                className={`w-full px-4 py-2 rounded-lg border ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700 placeholder-gray-400 bg-white`}
                                register={register}
                                error={errors.email}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <div className="relative">
                                <span className="absolute left-4 top-10 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none border-e-2 pe-2 border-gray-500">
                                    +91
                                </span>
                                <FormInput
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    placeholder="123-456-7890"
                                    className={`w-full px-16 py-2 rounded-lg border ${
                                        errors.phone ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700 placeholder-gray-400 bg-white`}
                                    register={register}
                                    error={errors.phone}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="relative">
                                <FormInput
                                    label="Password"
                                    type={eyeButton.password ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        errors.password ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700 placeholder-gray-400 bg-white`}
                                    register={register}
                                    error={errors.password}
                                />
                                <span
                                    className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 cursor-pointer "
                                    onClick={() => setEyeButton({ ...eyeButton, password: !eyeButton.password })}
                                >
                                    {eyeButton.password ? <Eye /> : <EyeClosed />}
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <div className="relative">
                                <FormInput
                                    label="Confirm Password"
                                    type={eyeButton.confirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700 placeholder-gray-400 bg-white`}
                                    register={register}
                                    error={errors.confirmPassword}
                                />
                                <span
                                    className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 cursor-pointer "
                                    onClick={() =>
                                        setEyeButton({ ...eyeButton, confirmPassword: !eyeButton.confirmPassword })
                                    }
                                >
                                    {eyeButton.confirmPassword ? <Eye /> : <EyeClosed />}
                                </span>
                            </div>
                        </div>

                        {/* Referral Section */}
                        <div className="mt-6">
                            <p className="text-center text-sm text-gray-600 mb-2">
                                Anyone has referred You? Claim the reward
                            </p>
                            <FormInput
                                type="text"
                                placeholder="AD14761"
                                name="referralCode"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700 placeholder-gray-400 bg-white"
                                register={register}
                                error={errors.referralCode}
                            />
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-600 mt-4">
                            Already have an account?{" "}
                            <a href="/login" className="font-bold text-gray-800 hover:underline">
                                Log in
                            </a>
                        </p>

                        {/* Sign Up Button */}
                        <Button
                            type="submit"
                            className="w-full py-3 px-4 bg-[#1F463E] hover:bg-[#16332d] text-white font-bold rounded-lg transition duration-200"
                        >
                            Sign Up
                        </Button>
                    </FormWrapper>

                    {/* Or Login with */}
                    <div className="mt-6">
                        <div className="relative flex py-4 items-center">
                            <div className="grow border-t border-gray-600/50"></div>
                            <span className="shrink mx-4 text-gray-900 text-sm ">Or Login with</span>
                            <div className="grow border-t border-gray-600/50"></div>
                        </div>
                        <button className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                            <span className="font-medium text-gray-700">Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;

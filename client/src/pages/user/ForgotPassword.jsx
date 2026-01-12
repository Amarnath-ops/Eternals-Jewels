import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, OtpSchema } from "@/validations/auth.schema";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SpinnerBadge } from "@/components/Spinner";
import { useForgotPassword } from "@/hooks/tanstack_Queries/auth/useForgotPassword";
import { useForgotPasswordVerify } from "@/hooks/tanstack_Queries/auth/useForgotPasswordVerify";
const ForgotPasswordPage = () => {
    const emailForm = useForm({ resolver: zodResolver(emailSchema) });
    const OTPForm = useForm({ resolver: zodResolver(OtpSchema) });
    const [emailEdit, setEmailEdit] = useState(false);
    const { mutateAsync, isPending } = useForgotPassword();
    const { mutateAsync: VerifyEmailandOTP, isPending: Verifying } = useForgotPasswordVerify();
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const onSubmitEmail = async (data) => {
        setEmail(data.email);
        try {
            await mutateAsync(data);
            setEmailEdit(true);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };
    const onSubmitOTP = async (data) => {
        try {
            await VerifyEmailandOTP({...data,email})
            navigate("/reset-password", { state: { email } });
        } catch (error) {
            setEmailEdit(false);
            console.log(error);
            toast.error(error.response.data.message);
        }
    };
    if (Verifying) {
        return <SpinnerBadge content={"Verifying"} />;
    }
    return (
        <>
            <div className="min-h-screen bg-[#D9D9D9] font-sans flex flex-col">
                <Navbar />

                {/* Main Content Section */}
                <main className="flex-grow flex flex-col items-center justify-center -mt-10">
                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-black mb-12 tracking-wide">Forgot Password ?</h1>

                    {/* Form Container */}
                    <div className="w-full max-w-[500px] px-4 flex flex-col gap-6">
                        {/* Email Section */}
                        <form onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
                            <label className="block text-gray-800 text-sm mb-2 pl-1 font-medium">
                                Enter your registered email
                            </label>
                            <div className="flex">
                                <input
                                    disabled={emailEdit}
                                    type="text"
                                    placeholder="helloworld@gmail.com"
                                    className={`grow bg-white text-gray-800 rounded-s-lg px-6 py-3.5 outline-none placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-gray-300 transition-all ${
                                        emailEdit ? "cursor-not-allowed" : ""
                                    }`}
                                    {...emailForm.register("email")}
                                />
                                <button
                                    className={`bg-[#c8966a] hover:bg-[#977353] text-white px-6 py-3.5 rounded-e-lg font-medium text-sm shadow-sm transition-colors whitespace-nowrap ${
                                        emailEdit ? "cursor-not-allowed" : ""
                                    }`}
                                    type="submit"
                                    disabled={emailEdit || isPending}
                                >
                                    {isPending ? "OTP Sending.." : "Send OTP"}
                                </button>
                            </div>
                            {emailForm.formState.errors.email && (
                                <p className="text-red-500 text-xs mt-1">{emailForm.formState.errors.email.message}</p>
                            )}
                        </form>

                        {/* OTP Section */}
                        <form onSubmit={OTPForm.handleSubmit(onSubmitOTP)}>
                            <label className="block text-gray-800 text-sm mb-2 pl-1 font-medium">Enter OTP Code</label>
                            <input
                                type="text"
                                placeholder="123456"
                                maxLength={6}
                                className="w-full bg-white text-gray-800 rounded-lg px-6 py-3.5 outline-none placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-gray-300 transition-all tracking-widest text-center"
                                {...OTPForm.register("otp")}
                            />
                            {OTPForm.formState.errors.otp && (
                                <p className="text-red-500 text-xs mt-1">{OTPForm.formState.errors.otp.message}</p>
                            )}
                            {/* Verify Button */}
                            <div className="flex justify-center mt-4">
                                <button
                                    type="submit"
                                    className="bg-[#1A3C34] text-white px-16 py-3 rounded-lg font-medium text-sm shadow-md hover:bg-[#142e28] transition-colors w-full md:w-auto"
                                >
                                    Verify Email
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ForgotPasswordPage;

import Navbar from "@/components/Navbar";
import { SpinnerBadge } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { OtpSchema } from "@/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useVerifyOtp } from "@/hooks/tanstack_Queries/auth/useVerifyOtp";
import { useResendOtp } from "@/hooks/tanstack_Queries/auth/useResendOtp";

const OtpVerification = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const email = location.state?.email;
    const {mutateAsync , isPending} = useVerifyOtp()
    const {mutateAsync:ResendOtpRequest } = useResendOtp()
    const [timeLeft, setTimeLeft] = useState(59);
    const canResend = timeLeft === 0;
    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }
        const timerId = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timerId);
    }, [timeLeft]);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            otp: "",
        },
    });

    const onSubmit = async (data) => {
        setTimeLeft(59);
        try {
            await mutateAsync({...data,email})
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message);
        }
    };

    const onResend = async () => {
        setTimeLeft(59);
        setLoading(true);
        try {
            await ResendOtpRequest(email)
        } catch (error) {
            console.log(email);
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {loading && <SpinnerBadge content={"Loading..."} />}
            <Navbar />
            <div className="min-h-screen flex items-center justify-center font-poppins px-4 -mt-20">
                <div className="w-full max-w-md text-center">
                    {/* Header */}
                    <h1 className="text-3xl font-bold text-black mb-3">Verify OTP</h1>
                    <p className="text-[#4F4F4F] text-base mb-10 leading-relaxed">
                        We've sent an email with an one time password to{" "}
                        <span className="font-bold text-black">{email}</span>
                    </p>

                    {/* OTP Inputs */}
                    <div className="flex flex-col items-center justify-center w-full min-h-75">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="otp"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col items-center">
                                        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                                            <InputOTPGroup className="gap-2 sm:gap-3">
                                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                        className="w-12 h-12 sm:w-16.25 sm:h-16.25 text-lg sm:text-2xl rounded-md border border-[#AFAFAF]"
                                                    />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>

                                        {/* Manual Error Message */}
                                        {errors.otp && <p className="text-red-500 text-sm mt-2">{errors.otp.message}</p>}
                                    </div>
                                )}
                            />
                            {/* Timer */}
                            <p className="text-[#4F4F4F] text-sm font-medium mb-4">
                                Send code again{" "}
                                <span className="text-[#4F4F4F]">
                                    {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
                                </span>
                            </p>

                            {/* Resend Link */}
                            <p className="text-[#4F4F4F] text-sm mb-12">
                                I didn't receive a code{" "}
                                <button
                                    onClick={onResend}
                                    disabled={!canResend}
                                    className={`font-bold text-black underline bg-transparent border-none  ${
                                        !canResend ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                    }`}
                                >
                                    Resend
                                </button>
                            </p>

                            {/* Verify Button */}
                            <Button
                                // onClick={handleVerify}
                                className="w-full max-w-100 py-7 bg-[#1A4D3E] text-white text-base font-semibold rounded-lg hover:bg-[#143d31] transition-colors"
                            >
                                {isPending?"Verifying..":"Verify"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OtpVerification;

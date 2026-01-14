import { useVerifyEmailOtp } from "@/hooks/tanstack_Queries/user/profile/useEmailChange";
import useZodForm from "@/hooks/useZodForm";
import { OtpSchema } from "@/validations/auth.schema";
import { toast } from "sonner";
import FormWrapper from "../form/Form";

const EmailOtpModal = ({ onClose, email }) => {
    const { mutateAsync, isPending } = useVerifyEmailOtp();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useZodForm(OtpSchema);

    const onSubmit = async (data) => {
        await mutateAsync(data.otp);
        toast.success("Email updated successfully.");
        onClose(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <FormWrapper onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl w-96 space-y-4">
                <h2 className="text-lg font-semibold">Verify Email {email}</h2>

                <input {...register("otp")} placeholder="Enter OTP" className="w-full border px-3 py-2 rounded" />
                {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}

                <button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded"
                >
                    {isPending ? "Verifying..." : "Verify OTP"}
                </button>
            </FormWrapper>
        </div>
    );
};

export default EmailOtpModal;

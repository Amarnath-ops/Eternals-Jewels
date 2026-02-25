import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrentUser } from '@/hooks/tanstack_Queries/user/profile/useCurrentUser';

const ReferralPage = () => {
    const [copied, setCopied] = useState(false);
    const {data} = useCurrentUser()
    console.log(data)
    const referralCode = data?.referalCode || "N/A";
    
    const displayCode = referralCode.split('').join(' ');

    const handleCopy = () => {
        if (referralCode !== "N/A") {
            navigator.clipboard.writeText(referralCode);
            setCopied(true);
            toast.success("Referral code copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } else {
            toast.error("Referral code not available.");
        }
    };

    return (
        <div className="w-full flex-1 flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-8 font-bold tracking-wide mt-4 md:mt-2 shadow-sm drop-shadow-md">
                My Referral Code
            </h1>
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-8 sm:p-12 md:p-16 w-full max-w-4xl min-h-[400px] flex flex-col justify-center gap-12">
                <p className="text-gray-600 text-base md:text-lg leading-relaxed text-left font-serif tracking-wide px-2 md:px-8">
                    "Invite your friends and earn rewards! Share your unique referral code to get ₹100 credited to your wallet when they join, and your friend receives ₹50 too. Spread the word and start earning together!"
                </p>
                <div className="flex justify-center w-full mt-4">
                    <div className="bg-[#D1C6BE] rounded-xl flex items-center justify-center relative w-full max-w-lg h-24 md:h-32 shadow-inner">
                        <div className="absolute top-3 right-4 cursor-pointer text-white/80 hover:text-white transition-colors p-2" onClick={handleCopy} title="Copy code">
                            {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                        </div>
                        <div className="text-white font-extrabold text-2xl md:text-3xl tracking-[0.4em] uppercase font-mono">
                            {displayCode}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReferralPage;

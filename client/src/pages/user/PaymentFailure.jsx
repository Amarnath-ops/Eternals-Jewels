import React from "react";
import Navbar from "@/components/Navbar";
import { X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useRetryPayment from "@/hooks/tanstack_Queries/user/order/useRetryPayment";
import useVerifyPayment from "@/hooks/tanstack_Queries/user/order/useVerifyPayment";
import toast from "react-hot-toast";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PaymentFailurePage = () => {
    const location = useLocation();
    
    const errorMessage = location.state?.error || "Your payment could not be processed at this time.";
    const fallbackOrderId = location.state?.orderId;
    const navigate = useNavigate();
    const { mutateAsync: retryPayment, isPending: isRetrying } = useRetryPayment();
    const { mutateAsync: verifyPayment } = useVerifyPayment();

    const handleRetryPayment = async () => {
        if (!fallbackOrderId) {
            navigate("/account/orders");
            return;
        }

        try {
            const response = await retryPayment(fallbackOrderId);
            
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                 toast.error("Failed to load Razorpay SDK. Are you online?");
                 return;
            }

            const options = {
                 key: response.key,
                 amount: response.amount,
                 currency: "INR",
                 name: "Eternals Jewels",
                 description: "Jewelry Purchase",
                 order_id: response.razorpayOrderId, 
                 handler: async function (paymentResponse) {
                      const verificationData = {
                           orderId: response.orderId,
                           razorpayPaymentId: paymentResponse.razorpay_payment_id,
                           razorpayOrderId: paymentResponse.razorpay_order_id,
                           razorpaySignature: paymentResponse.razorpay_signature
                      };
                      
                      try {
                           await verifyPayment(verificationData);
                           toast.success("Payment Successful!");
                           navigate(`/account/orders/${fallbackOrderId}`);
                      } catch (error) {
                           toast.error("Payment verification failed.");
                      }
                 },
                 prefill: {
                      name: "Customer",
                      contact: ""
                 },
                 theme: { color: "#8B6D51" },
                 modal: {
                      ondismiss: function() {
                           navigate("/payment-failed", { state: { error: "Payment was cancelled.", orderId: fallbackOrderId }, replace: true });
                      }
                 }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on("payment.failed", function (res) {
                 toast.error(res.error.description || "Payment failed!");
                 try {
                     const razorpayContainer = document.querySelector(".razorpay-container");
                     if (razorpayContainer) {
                         razorpayContainer.style.display = "none";
                         razorpayContainer.remove();
                     }
                 } catch (e) {
                     console.log(e);
                 }
            });
            paymentObject.open();

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to initiate payment retry");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
            <Navbar />
            
            <main className="flex-grow w-full flex flex-col items-center justify-center px-4 py-16 text-center">
                <div className="max-w-xl w-full bg-white px-8 py-16 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                    
                    {}
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
                                <X className="text-white w-8 h-8" strokeWidth={3} />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-gray-900 mb-4 tracking-wide">
                        Payment Failed
                    </h1>
                    
                    <p className="text-gray-500 mb-6 text-base md:text-lg max-w-sm px-4">
                        {errorMessage}
                    </p>

                    {}
                    <div className="flex items-center gap-2 mb-10 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.43 2.73199L12 20.893C11.666 21.493 11 21.849 10.334 21.849H2.33301L3.92101 19.141H8.79901C9.68901 19.141 10.51 18.666 10.96 17.882L15.309 10.233L10.312 2.73199H22.43Z" fill="#3395FF"/>
                            <path d="M22.43 2.73199L15.311 10.231M10.312 2.73199L15.311 10.231M15.311 10.231L13.723 13.064M5.33301 2.73199L13.723 13.064M13.723 13.064L2.33301 13.064M2.33301 13.064L8.23201 2.73199H22.43Z" fill="#3395FF"/>
                        </svg>
                        <span className="text-sm font-semibold text-gray-700 tracking-wide">Secured by Razorpay</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                        <button 
                            onClick={handleRetryPayment}
                            disabled={isRetrying}
                            className={`w-full sm:w-auto px-8 py-3.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all uppercase tracking-widest shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${isRetrying ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            {isRetrying ? "Processing..." : "Retry Payment"}
                        </button>
                        
                        <Link 
                            to="/shop" 
                            className="w-full sm:w-auto px-8 py-3.5 border border-gray-300 text-gray-700 text-sm font-medium bg-white hover:bg-gray-50 transition-colors uppercase tracking-widest"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentFailurePage;

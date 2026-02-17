import React from "react";
import Navbar from "@/components/Navbar";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F5F2ED]">
            <Navbar />
            
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 text-center">
                <div className="mb-6">
                    <div className="w-24 h-24 bg-[#D1F2EB] rounded-full flex items-center justify-center mx-auto">
                        <div className="w-16 h-16 bg-[#2ECC71] rounded-full flex items-center justify-center">
                            <Check className="text-white w-10 h-10" strokeWidth={3} />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-4">
                    Order Placed Successfully !
                </h1>
                
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                    Your order has been successfully placed
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
                    <Link 
                        to="/account/orders" 
                        className="px-8 py-3 bg-[#C5A280] text-white font-medium rounded hover:bg-[#b08d6b] transition-colors uppercase tracking-wide w-full sm:w-auto min-w-[160px]"
                    >
                        View Orders
                    </Link>
                    
                    <Link 
                        to="/shop" 
                        className="px-8 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors uppercase tracking-wide w-full sm:w-auto min-w-[160px]"
                    >
                        continue shopping
                    </Link>
                </div>
                
                <div className="w-full max-w-2xl border-b border-gray-200 mt-16"></div>
            </main>
        </div>
    );
};

export default OrderSuccessPage;

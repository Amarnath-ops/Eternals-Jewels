import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";

const ContactPage = () => {
    return (
        <>
            <Navbar homePage={false} />
            <div className="w-full min-h-screen flex items-center justify-center p-4 font-sans">
                {/* Contact Info Card */}
                <div className="bg-white max-w-md w-full p-8 md:p-12 shadow-sm  mb-30">
                    {/* Section 1: Call To Us */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-black rounded-full p-2">
                                <Phone className="text-white w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Call To Us</h3>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 pl-14">
                            <p>We are available 24/7, 7 days a week.</p>
                            <p className="font-medium text-gray-900">Phone: +91 000-000-0000</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-gray-200 mb-8 ml-14"></div>

                    {/* Section 2: Write To Us */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-black rounded-full p-2">
                                <Mail className="text-white w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Write To US</h3>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 pl-14">
                            <p>Fill out our form and we will contact you within 24 hours.</p>
                            <p>Emails: customer@exclusive.com</p>
                            <p>Emails: support@exclusive.com</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-gray-200 mb-8 ml-14"></div>

                    {/* Section 3: Address (Location) */}
                    <div>
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                {/* Using MapPin icon to represent the location marker */}
                                <MapPin className="text-gray-400 w-6 h-6" />
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed">
                                <p>Eternal Jewels, Business</p>
                                <p>Gate, Ernakulam , Kerala</p>
                                <p>600031</p>
                                <p>CA 90280</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactPage;

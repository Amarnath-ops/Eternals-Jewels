import React from "react";
import { Instagram, Twitter, Facebook, Youtube, Linkedin } from "lucide-react";
import Navbar from "./Navbar";

const Footer = () => {
    const footerLinks = [
        {
            title: "CUSTOMER SERVICES",
            links: [
                "Contact Us",
                "Track your Order",
                "Shipping & Returns",
                "Frequently Asked Questions",
                "Schedule an appointment",
            ],
        },
        { title: "ABOUT US", links: ["Origins", "Our Purpose", "Careers", "Sustainability", "Giving Back"] },
        { title: "MATERIAL CARE", links: ["Jewelry Repair", "Ring Sizing", "Metal Allergy Resources", "Styling Tips"] },
        { title: "MAIN LOCATIONS", links: ["Chicago, IL", "San Francisco, CA", "New York, NY", "Seattle, WA"] },
    ];

    return (
        <>
            <footer className="bg-[#F5F2ED] text-gray-800 font-sans w-full overflow-hidden pt-30">
                {/* Removed max-w constraints.
         Reduced horizontal padding to px-4 (mobile) and px-6 (desktop) 
         to push content as close to the edges as possible.
      */}
                <div className="w-full px-4 md:px-6 2xl:px-8 pt-10 pb-8">
                    {/* Main Content Wrapper */}
                    <div className="flex flex-col xl:flex-row justify-between gap-10 xl:gap-0 w-full">
                        {/* Links Grid: Stretches to fill available space */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 grow xl:pr-20">
                            {footerLinks.map((column, index) => (
                                <div key={index}>
                                    <h3 className="font-serif text-xs md:text-sm 2xl:text-lg font-bold tracking-wider mb-4 uppercase text-gray-900">
                                        {column.title}
                                    </h3>
                                    <ul className="space-y-2 md:space-y-3 2xl:space-y-4 text-xs md:text-sm 2xl:text-base text-gray-600">
                                        {column.links.map((link, i) => (
                                            <li key={i}>
                                                <a href="#" className="hover:text-black transition block whitespace-nowrap">
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Newsletter Section: Fixed width on large screens to keep it neat */}
                        <div className="xl:w-100 2xl:w-125 shrink-0">
                            <h2 className="font-serif text-2xl md:text-3xl 2xl:text-4xl text-black mb-2 2xl:mb-4 leading-tight">
                                You can be one step ahead.
                            </h2>
                            <p className="text-gray-600 mb-4 2xl:mb-8 text-sm 2xl:text-lg">
                                Sign up to hear about our updates on the dot.
                            </p>

                            <div className="relative mb-6 2xl:mb-10 w-full">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full bg-white border-none p-3 2xl:p-4 pr-20 2xl:pr-28 text-sm 2xl:text-lg focus:ring-1 focus:ring-gray-300 placeholder-gray-400 rounded-sm"
                                />
                                <button className="absolute right-0 top-0 h-full px-4 2xl:px-6 text-xs 2xl:text-base font-bold tracking-widest text-gray-400 hover:text-black transition">
                                    SIGN UP
                                </button>
                            </div>

                            <div className="flex gap-6 2xl:gap-8 text-gray-600">
                                <Instagram className="w-5 h-5 2xl:w-7 2xl:h-7 hover:text-black cursor-pointer transition" />
                                <Twitter className="w-5 h-5 2xl:w-7 2xl:h-7 hover:text-black cursor-pointer transition" />
                                <Facebook className="w-5 h-5 2xl:w-7 2xl:h-7 hover:text-black cursor-pointer transition" />
                                <Youtube className="w-5 h-5 2xl:w-7 2xl:h-7 hover:text-black cursor-pointer transition" />
                                <Linkedin className="w-5 h-5 2xl:w-7 2xl:h-7 hover:text-black cursor-pointer transition" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-10 2xl:mt-20 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs 2xl:text-sm text-gray-500 uppercase tracking-wide gap-4 border-t border-gray-200/50 w-full">
                        <div className="flex items-center gap-1">
                            <span>&copy;</span> <span>ETERNALS, LLC</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                            <a href="#" className="hover:text-black transition">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-black transition">
                                Terms of Use
                            </a>
                            <a href="#" className="hover:text-black transition">
                                Sitemap
                            </a>
                            <a href="#" className="hover:text-black transition">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;

import React, { useState } from "react";
import { Heart, ShoppingCart, User, Menu, X, LogOut, ShoppingBag, ShoppingBagIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountDropdown, { MenuItem } from "./AccountDropdown";
import { useLogoutUser } from "@/hooks/tanstack_Queries/user/auth/useLogoutUser";
import { useGetCartItems } from "@/hooks/tanstack_Queries/user/cart/useGetCartItems";

const Navbar = ({ homePage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [mobileDropDown, setMobileDropdown] = useState(false);
    const { mutateAsync } = useLogoutUser();
    const isLogin = useSelector((state) => state.user.isLogin);
    const { data} = useGetCartItems()
    const handleLogout = async () => {
        try {
            await mutateAsync();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <nav className={`w-full px-4 pt-4 md:px-4 md:pt-6 ${homePage ? "absolute" : "relative"} z-50`}>
            <div
                className={`bg-white/25 backdrop-blur-md border ${homePage ? "border-white/20" : "border-black/10"} rounded-full px-5 py-3 md:px-8 md:py-4 2xl:px-12 2xl:py-6 flex justify-between items-center shadow-sm w-full max-w-7xl 2xl:max-w-[90%] mx-auto transition-all duration-300`}
            >
                <button
                    className={`md:hidden ${
                        homePage ? "text-white  hover:text-white/70" : "text-black hover:text-gray-600"
                    } p-1 rounded-full transition`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isLogin ? (
                        isOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )
                    ) : (
                        <Link
                            to="/login"
                            className={`${
                                homePage ? "hover:text-white" : "hover:text-black"
                            } transition text-sm md:text-base 2xl:text-lg`}
                        >
                            Login
                        </Link>
                    )}
                </button>

                <Link
                    to="/"
                    className={`text-lg md:text-2xl 2xl:text-3xl font-bold tracking-tight text-whiteflex-grow md:grow-0 text-center md:text-left cursor-pointer ${
                        homePage ? "text-white" : "text-black/75"
                    }`}
                >
                    Eternals
                </Link>

                <div
                    className={`hidden md:flex space-x-8 lg:space-x-10 2xl:space-x-16 ${
                        homePage ? "text-gray-100" : "text-gray-700"
                    } font-medium`}
                >
                    {["Home", "Shop", "About", "Contact"].map((item) => (
                        <Link
                            key={item}
                            to={item === "Home" ? "/" : "/" + item.toLowerCase()}
                            className={`${
                                homePage ? "hover:text-white" : "hover:text-black"
                            } transition text-sm md:text-base 2xl:text-lg`}
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {isLogin ? (
                    <div className="flex items-center space-x-3 md:space-x-6 2xl:space-x-8">
                        <button
                            className={`${
                                homePage ? "text-white hover:text-gray-300" : "text-black/75 hover:text-black"
                            }  transition hidden sm:block p-1 rounded-full `}
                        >
                            <Heart className="w-5 h-5 md:w-6 md:h-6 2xl:w-7 2xl:h-7" />
                        </button>
                        <Link
                            to="/cart"
                            className={`${
                                homePage ? "text-white hover:text-gray-300" : "text-black/75 hover:text-black"
                            }  transition p-1 rounded-full `}
                        > {data?.cart?.items?.length}
                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 2xl:w-7 2xl:h-7" />
                        </Link>
                        <button
                            className={`${
                                homePage ? "text-white hover:text-gray-300" : "text-black/75 hover:text-black"
                            }  transition hidden sm:block p-1 rounded-full `}
                        >
                            <User
                                className="w-5 h-5 md:w-6 md:h-6 2xl:w-7 2xl:h-7"
                                onClick={() => setAccountOpen(!accountOpen)}
                            />
                        </button>
                    </div>
                ) : (
                    <div
                        className={`hidden md:flex space-x-8 lg:space-x-10 2xl:space-x-16 ${
                            homePage ? "text-gray-100" : "text-gray-700"
                        } font-medium`}
                    >
                        <Link
                            to="/login"
                            className={`${
                                homePage ? "hover:text-white" : "hover:text-black"
                            } transition text-sm md:text-base 2xl:text-lg`}
                        >
                            Login
                        </Link>
                    </div>
                )}
            </div>

            {isOpen && isLogin && (
                <div className="absolute top-full left-0 w-full px-4 mt-2 md:hidden">
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 shadow-xl flex flex-col space-y-3 text-center font-medium border border-white/10 text-white">
                        {["Home", "Shop", "About", "Contact"].map((item) => (
                            <Link
                                key={item}
                                to={item === "Home" ? "/" : "/" + item.toLowerCase()}
                                className="hover:bg-white/10 py-2 rounded-lg transition"
                            >
                                {item}
                            </Link>
                        ))}
                        <div className="border-t border-white/20 pt-3 flex justify-center space-x-8 text-gray-300">
                            <Heart size={20} className="text-white" />
                            <User size={20} className="text-white" onClick={() => setMobileDropdown(!mobileDropDown)} />
                        </div>
                        {mobileDropDown && (
                            <div className="mobile-dropdown">
                                <Link to="/account/profile">
                                    <MenuItem icon={User} label="Account" onClick={() => console.log("Account clicked")} />
                                </Link>

                                <MenuItem
                                    icon={ShoppingBagIcon}
                                    label="My Order"
                                    onClick={() => console.log("Orders clicked")}
                                />

                                <MenuItem icon={LogOut} label="Logout" isLast={true} onClick={handleLogout} />
                            </div>
                        )}
                    </div>
                </div>
            )}
            {accountOpen && isLogin && <AccountDropdown onClose={() => setAccountOpen(false)} />}
        </nav>
    );
};

export default Navbar;

import { User, MapPin, ShoppingBag, Heart, Wallet, Lock, Users, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ user }) => {
    const location = useLocation();
    
    const menuItems = [
        { icon: User, label: "My Profile", path: "/account/profile" },
        { icon: MapPin, label: "My Address", path: "/account/address" },
        { icon: ShoppingBag, label: "My Order", path: "/account/orders" },
        { icon: Heart, label: "My Wishlist", path: "/wishlist" },,
        { icon: Wallet, label: "My Wallet", path: "/account/wallet" },
        { icon: Lock, label: "Change password", path: "/account/change-password" },
        { icon: Users, label: "Referral Code", path: "/account/referral" }, 
        { icon: LogOut, label: "Log out", path: "/account/logout" },
    ];

    
    const isActive = (path) => path.includes(location.pathname);
    return (
        <div className="w-25 lg:w-80 shrink-0 bg-white rounded-3xl shadow-sm py-7.5 px-5 md:p-12 lg:p-6 h-fit transition-all duration-300 ease-in-out">
            {}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full shrink-0 flex items-center justify-center">
                    <img
                        src={user?.avatar || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-2 lg:border-4 border-gray-200 shadow-sm"
                    />
                </div>
                {}
                <div className="hidden lg:block overflow-hidden">
                    <h3 className="font-semibold text-lg truncate">{user?.fullname}</h3>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
            </div>

            {}
            <nav className="space-y-2">
                {menuItems.map((item, index) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            title={item.label} 
                            className={`w-full flex items-center justify-center lg:justify-start gap-4 px-0 lg:px-4 py-3 rounded-xl transition-all duration-200 ${
                                active
                                    ? "bg-gray-100 text-black font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                            }`}
                        >
                            <item.icon size={20} className={`flex-shrink-0 ${active ? "text-black" : "text-gray-500"}`} />
                            {}
                            <span className="hidden lg:block text-sm md:text-base whitespace-nowrap">{item.label}</span>
                        </Link> 
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
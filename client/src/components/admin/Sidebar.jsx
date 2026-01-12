import { useLogoutUser } from "@/hooks/tanstack_Queries/user/auth/useLogoutUser";
import { Box, DollarSign, Grid, ImageIcon, LayoutDashboard, List, Tag, Users, LogOut} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const {mutateAsync} = useLogoutUser()
  const handleLogOut = async()=>{
    await mutateAsync()
  }
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true, path:"dashboard"},
    { name: 'Products', icon: Box, active: false, path:"products"},
    { name: 'Order List', icon: List, active: false, path:"orders"},
    { name: 'Customer', icon: Users, active: false, path:"customers"},
    { name: 'Sales', icon: DollarSign, active: false, path:"sales" },
    { name: 'Category', icon: Grid, active: false, path:"categories"},
    { name: 'Coupons', icon: Tag, active: false , path:"coupons"},
    { name: 'Banner', icon: ImageIcon, active: false, path:"banners" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col justify-between z-10">
      <div>
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-2xl font-bold italic text-black">Eternals</h1>
        </div>

        {/* Menu Items */}
        <nav className="mt-2 px-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
            to={`/admin/${item.path}`}
              key={index}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                item.active
                  ? 'bg-white shadow-sm border border-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${item.active ? 'text-gray-900' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 space-y-3 mb-4">
        <button onClick={handleLogOut} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar
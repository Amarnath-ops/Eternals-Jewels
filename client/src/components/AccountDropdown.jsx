import { authService } from '@/services/auth.service';
import { User, ShoppingBag, LogOut } from 'lucide-react';
const AccountDropdown = () => {
  const handleLogout = ()=>{
    try {
      authService.logout()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="relative">
      {/* Dropdown Menu */}
        <div className="absolute right-25 hidden mt-5 md:block w-64 opacity-80 bg-white/20 backdrop-blur-md  rounded-3xl shadow-xl border border-white/25 overflow-hidden z-50 py-4 px-2">
          <div className="flex flex-col gap-2">
            
           {/* Account Item */}
            <MenuItem 
              icon={User} 
              label="Account" 
              onClick={() => console.log("Account clicked")} 
            />

            {/* My Order Item */}
            <MenuItem 
              icon={ShoppingBag} 
              label="My Order" 
              onClick={() => console.log("Orders clicked")}
            />

            {/* Logout Item */}
            <MenuItem 
              icon={LogOut} 
              label="Logout" 
              isLast={true} // specific styling for logout if needed
              onClick={handleLogout} 
            />
            
          </div>
        </div>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
export const MenuItem = ({ icon: Icon, label, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group flex items-center gap-6 w-full p-4 rounded-2xl hover:bg-white/10 transition-colors duration-200 text-left"
    >
      <Icon
        size={32} 
        strokeWidth={1.5} 
        className="text-white group-hover:text-white transition-colors" 
      />
      <span className="text-xl font-medium text-white group-hover:text-white tracking-wide">
        {label}
      </span>
    </button>
  );
};
export default AccountDropdown
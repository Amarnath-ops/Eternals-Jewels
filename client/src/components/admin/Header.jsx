import { ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white h-16 flex items-center justify-end px-8 sticky top-0 z-0 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
           <img 
             src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
             alt="Admin" 
             className="w-full h-full object-cover"
           />
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900">Amarnath T</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </header>
  );
};

export default Header
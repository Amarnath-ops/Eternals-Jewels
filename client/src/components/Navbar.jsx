import { Heart, ShoppingCart, User} from 'lucide-react';
const Navbar = () => {
  return (
    <nav className="w-full px-6 pt-6">
      <div className="bg-white rounded-full px-8 py-4 flex justify-between items-center shadow-sm max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight text-black">
          Eternals
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-12 text-black font-medium">
          <a href="#" className="hover:text-gray-600 transition">Home</a>
          <a href="#" className="hover:text-gray-600 transition">Shop</a>
          <a href="#" className="hover:text-gray-600 transition">About</a>
          <a href="#" className="hover:text-gray-600 transition">Contact</a>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <button className="text-black hover:text-gray-600 transition">
            <Heart size={24} />
          </button>
          <button className="text-black hover:text-gray-600 transition">
            <ShoppingCart size={24} />
          </button>
          <button className="text-black hover:text-gray-600 transition">
            <User size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
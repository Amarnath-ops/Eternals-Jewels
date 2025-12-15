import { EyeOff, CheckCircle } from 'lucide-react';
const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-10 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-12 text-black">Login</h1>

      <div className="w-full max-w-md space-y-6">
        
        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-900 font-medium ml-1 block">
            Email address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder='johndoe@gmail.com'
              className="w-full bg-white rounded-xl py-3.5 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-900 font-medium ml-1 block">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder='Password@123'
              className="w-full bg-white rounded-xl py-3.5 px-4 text-gray-700 tracking-widest focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <EyeOff size={20} />
            </button>
          </div>
          <div className="flex justify-end pt-1">
            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Login Button */}
        <button className="w-full py-3.5 rounded-lg text-white font-medium text-lg hover:opacity-90 transition shadow-md bg-[#1F463E]">
          Log in
        </button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">
            New user? <a href="#" className="hover:text-white transition">Sign up</a>
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex py-4 items-center">
            <div className="grow border-t border-gray-600/50"></div>
            <span className="shrink mx-4 text-gray-900 text-sm ">Or Login with</span>
            <div className="grow border-t border-gray-600/50"></div>
        </div>

        {/* Google Login Button */}
        <button className="w-full bg-white text-black py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition shadow-sm">
          {/* Google Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Google</span>
        </button>

      </div>
    </div>
  );
};

export default LoginPage
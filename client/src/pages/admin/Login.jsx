import React, { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import useZodForm from '@/hooks/useZodForm';
import { loginSchema } from '@/validations/auth.schema';
import FormWrapper from '@/components/form/Form';
import FormInput from '@/components/form/FormInput';
import { useLoginAdmin } from '@/hooks/tanstack_Queries/user/auth/useLoginAdmin';
import { SpinnerBadge } from '@/components/Spinner';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {handleSubmit,register , formState:{errors}} = useZodForm(loginSchema);
  const {mutateAsync:login,isPending} = useLoginAdmin()
  const onSubmit = async (data)=>{
    await login(data)
  }
  if(isPending){
    return <SpinnerBadge content={"Please wait..."}/>
  }
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      
      {/* Top Navigation / Header */}
      <header className="flex justify-between items-center px-8 py-6">
        {/* Logo */}
        <div className="text-2xl font-extrabold italic tracking-tight text-black">
          Eternals
        </div>
        
        {/* User Profile Stub */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Admin</span>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
            <User size={18} strokeWidth={2.5} />
          </div>
        </div>
      </header>

      {/* Main Login Content */}
      <main className="flex-1 flex flex-col items-center pt-24 px-4">
        <div className="w-full max-w-[400px]">
          
          <h1 className="text-3xl font-medium text-center text-gray-800 mb-12">
            Admin Login
          </h1>

          <FormWrapper onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <FormInput 
              label={"Email"}
              name="email"
              register={register}
              error={errors.email}
              className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all text-gray-800`}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className='text-sm text-gray-900 font-medium ml-1 block'>Password</label>
                {/* Show/Hide Toggle */}
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex  items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 cursor-pointer mb-1"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  <span className="font-medium">{showPassword ? 'Show' : 'Hide'}</span>
                </button>
              </div>

              <FormInput 
                type={showPassword ? "text" : "password"} 
                name="password"
                register={register}
                error={errors.password}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all text-gray-800"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full py-3 px-4 bg-[#cf9868] hover:bg-[#bd8656] text-white font-semibold rounded-lg shadow-sm transition-colors mt-4"
            >
              Log in
            </button>
          </FormWrapper>

        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
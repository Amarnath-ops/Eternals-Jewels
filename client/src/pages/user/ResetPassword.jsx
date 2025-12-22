import React from 'react';
import { Heart, ShoppingCart, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/api/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/user/authSlice';

const ResetPassword = () => {
  const {handleSubmit,register} = useForm();
  const location = useLocation()
  const email = location.state.email
  const navigate =useNavigate()
  const dispatch = useDispatch()
  const onSubmit = async (data)=>{
    try {
      const res = await axiosInstance.post("/auth/reset-password",{
        email,
        password:data.password,
        confirmPassword:data.confirmPassword
      })
      dispatch(setCredentials({accessToken:res.data.data.token , user:res.data.data.user}))
      navigate("/")
      toast.success(res.data.message)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
      <Navbar/>

      <div className="grow flex flex-col items-center justify-center pb-32">
        <h1 className="text-3xl font-bold mb-16">Enter new Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5 w-full max-w-md">
          <input
            type="password"
            placeholder="Enter new Password"
            className="w-full p-4 bg-white rounded-xl text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#1D4C43]"
            {...register("password")}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full p-4 bg-white rounded-xl text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#1D4C43]"
            {...register("confirmPassword")}
        />
          <button className="w-full p-4 bg-[#1D4C43] text-white font-medium rounded-xl hover:bg-[#163a33] transition-colors mt-4">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
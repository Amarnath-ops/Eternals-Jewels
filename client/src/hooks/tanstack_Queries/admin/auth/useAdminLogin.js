import { adminService } from "@/services/admin.service"
import { setAdminCredentials } from "@/store/admin/adminAuthSlice"
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";

export const useAdminLogin = ()=>{
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return useMutation({
    mutationFn:adminService.login,
    onSuccess:(data)=>{
      localStorage.setItem("adminData",JSON.stringify(data.admin))
      dispatch(setAdminCredentials({accessToken : data.accessToken , adminData : data.admin}))
      navigate("/admin/dashboard");
      toast.success("You've logged In successfully.")
    },
    onError:(error)=>{
      toast.error(error?.response?.data?.message);
    }
  })
}
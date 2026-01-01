import { logoutApi } from "@/api/auth.api"
import store from "@/store/store"
import { logOut } from "@/store/user/authSlice"
import { toast } from "sonner";

export const authService = {
  logout :async ()=>{
    const res = await logoutApi();
    console.log(res)
    store.dispatch(logOut())
    toast.success("You've logged out successfully.")
  }
}
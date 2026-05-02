import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./user/authSlice"
import adminAuthReducer from "./admin/adminAuthSlice"
const store = configureStore({
  reducer:{
    user:userAuthReducer,
    admin:adminAuthReducer
  }
})

export default store
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/authSlice"
const store = configureStore({
  reducer:{
    user:userReducer
  }
})

export default store
import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./user/authSlice"
const store = configureStore({
  reducer:{
    user:userAuthReducer
  }
})

export default store
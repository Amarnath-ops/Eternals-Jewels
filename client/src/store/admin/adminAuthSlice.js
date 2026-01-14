import { createSlice }  from "@reduxjs/toolkit"

const initialState = {
  isLoggedIn :false,
  adminData: JSON.parse(localStorage.getItem("adminData")) || null,
  accessToken:null
}

const adminSlice = createSlice({
  name:"admin",
  initialState,
  reducers:{
    setAdminCredentials:(state,action)=>{
      if(action.payload.accessToken){
        state.accessToken = action.payload.accessToken
      }
      if(action.payload.adminData){
        state.adminData = action.payload.adminData
      }
      state.isLoggedIn = true
    },
    adminLogout:(state)=>{
      state.accessToken = null,
      state.adminData = null,
      state.isLoggedIn = false,
      localStorage.removeItem("adminData")
    }
  }
})


export const {setAdminCredentials , adminLogout} = adminSlice.actions

export default adminSlice.reducer
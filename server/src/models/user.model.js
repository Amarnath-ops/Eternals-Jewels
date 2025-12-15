import mongoose from "mongoose";

const {Schema} =mongoose

const userSchema = new Schema({
  fullname : {
    type : String, 
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  phone:{
    type : String,
  },
  password:{
    type : String,
    required : true
  },
  isAdmin :{
    type : Boolean,
    default : false
  },
  isBlocked : {
    type : Boolean,
    default : false
  },
  referralCode :{
    type: String,
    unique: true,
    index: true
  },
  referredBy :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  refreshToken :{
    type:String,
    default:null
  }
},{timestamps:true})

export default mongoose.model("User",userSchema)
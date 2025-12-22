import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service:"gmail",
  host:"smtp.gmail.com",
  port:587,
  secure:false,
  auth:{
    user:process.env.GOOGLE_EMAIL,
    pass:process.env.GOOGLE_PASSWORD
  }
})

export const sendMail = async(email,otp)=>{
   await transporter.sendMail({
    from:process.env.GOOGLE_EMAIL,
    to:email,
    subject:"ETERNALS : OTP VERIFICATION",
    text:`Your one time password is ${otp}`
   })
}
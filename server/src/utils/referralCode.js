import crypto from "crypto"

export const generateReferralCode = (fullname = "")=>{
  const initials = fullname.trim()[0].toUpperCase() || "ET"

  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase()
  return `${initials}${randomPart}`
}
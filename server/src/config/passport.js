import passport from "passport";
import { Strategy as GoogleStrategy} from "passport-google-oauth20"
import { createUser, findUserByEmail, findUserByReferralCode } from "../repositories/user.repo.js";
import { generateReferralCode } from "../utils/referralCode.js";
import bcrypt from "bcrypt"
passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"/api/v1/auth/google/callback"
    },
    async (googleAccessToken,googleRefreshToken,profile, done)=>{
      try{
        console.log(profile)
        let user = await findUserByEmail(profile.emails[0].value);
        profile.password = bcrypt.hashSync(Math.random().toString(36), 10);

        let referalCode;
            for (let i = 0; i < 5; i++) {
                const codeForTest = generateReferralCode(profile?.displayName);
                const userFound = await findUserByReferralCode(codeForTest);
                if (!userFound) {
                    referalCode = codeForTest;
                    break;
                }
            }
        if(!user){
          user = await createUser(
            {
              fullname:profile.displayName,
              email:profile.emails[0].value,
              phone:null,
              password:profile.password,
              googleId:profile.id,
              avatar:{
                url:profile.photos[0].value,
                provider:profile.provider
              },
              isVerified:true,
              referralCode:referalCode,
              provider:profile.provider
            }
          )
        }
        return done(null,user)
      }catch(error){
        return done(error,null)
      }
    }
  )
)
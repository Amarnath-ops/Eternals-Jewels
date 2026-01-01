import passport from "passport";
import { Strategy as GoogleStrategy} from "passport-google-oauth20"
import { createUser, findUserByEmail, findUserByReferralCode } from "../repositories/user.repo.js";
import { generateReferralCode } from "../utils/referralCode.js";

passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"/api/v1/auth/google/callback"
    },
    async (googleAccessToken,googleRefreshToken,profile, done)=>{
      try{
        let user = await findUserByEmail(profile.emails[0].value);
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
              googleId:profile.id,
              avatar:profile.photos[0].value,
              isVerified:true,
              referralCode:referalCode,
              provider:"google"
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
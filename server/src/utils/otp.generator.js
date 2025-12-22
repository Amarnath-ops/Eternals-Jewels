import { generate } from 'otp-generator';

const generateOTP = () => {
  const OTP = generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
  return OTP;
};

export default generateOTP // Outputs something like: "829102"
import sendVerificationEmail from '../services/email.services.js';

export const emailHandlers = {
  "send-verification-email  ": async (data) => {
    await sendVerificationEmail(data.email,  data.otp);
  },
};
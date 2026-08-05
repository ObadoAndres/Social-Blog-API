import { sendMail } from "../config/email.js";

const sendMailWithMailtrap = async ({ to, subject, text, html }) => {
  return sendMail({ to, subject, text, html });
};

export const sendVerificationEmail = async (email, otp) => {
  try {
    const subject = "Verify your email address";
    const text = `Your verification code is: ${otp}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #111827;">Verify your email</h2>
        </div>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Thanks for joining Social Blog. Use the code below to verify your account and get started.
        </p>
        <div style="margin: 24px 0; text-align: center;">
          <div style="display: inline-block; padding: 14px 24px; border-radius: 8px; background-color: #2563eb; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 4px;">
            ${otp}
          </div>
        </div>
        <p style="font-size: 14px; color: #6b7280;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    `;

    return sendMailWithMailtrap({ to: email, subject, text, html });
  } catch (error) {
    throw new Error("Failed to send verification email: " + error.message);
  }
};

export const sendWelcomeEmail = async (email, username) => {
  try {
    const subject = "Welcome to Social Blog!";
    const text = `Hi ${username}, welcome to Social Blog. Start sharing your ideas and connecting with others today.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: linear-gradient(135deg, #eff6ff, #f8fafc);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #111827;">Welcome to Social Blog, ${username}!</h2>
        </div>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Your account is ready. Start posting, engaging with others, and building your community.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://socialblog.com" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; display: inline-block; font-weight: 600;">
            Go to Social Blog
          </a>
        </div>
        <p style="font-size: 14px; color: #6b7280;">
          We’re excited to have you here. If you need anything, just reply to this email.
        </p>
      </div>
    `;

    return sendMailWithMailtrap({ to: email, subject, text, html });
  } catch (error) {
    throw new Error("Failed to send welcome email: " + error.message);
  }
};

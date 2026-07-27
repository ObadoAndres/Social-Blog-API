import nodemailer from "nodemailer";

// Reusable transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. "smtp.gmail.com"
  port: process.env.SMTP_PORT || 587,
  secure: false,                     // true for port 465, false for others
  auth: {
    user: process.env.SMTP_USER,     // your email address
    pass: process.env.SMTP_PASS,     // your email password or app password
  },
});

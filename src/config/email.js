import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const createTransporter = () => {
  const host = process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io';
  const port = Number(process.env.MAILTRAP_PORT || 2525);
  const user = process.env.MAILTRAP_USER;
  const pass = process.env.MAILTRAP_PASS;

  if (!user || !pass) {
    throw new Error('MAILTRAP_USER and MAILTRAP_PASS must be configured');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user,
      pass,
    },
  });
};

const getFromAddress = () => {
  const configuredEmail = process.env.MAILTRAP_FROM_EMAIL?.trim();
  const configuredName = process.env.MAILTRAP_FROM_NAME?.trim() || 'Social Blog';

  if (!configuredEmail) {
    throw new Error('MAILTRAP_FROM_EMAIL must be configured with a real sender address');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  if (!emailPattern.test(configuredEmail)) {
    throw new Error('MAILTRAP_FROM_EMAIL must be a valid email address');
  }

  return {
    email: configuredEmail,
    name: configuredName,
  };
};

const buildMailOptions = ({ to, subject, text, html }) => {
  const { email, name } = getFromAddress();

  return {
    from: `${name} <${email}>`,
    to,
    subject,
    text,
    html,
  };
};

const sendMail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();
  const mailOptions = buildMailOptions({ to, subject, text, html });
  return transporter.sendMail(mailOptions);
};

export { buildMailOptions, getFromAddress, sendMail };

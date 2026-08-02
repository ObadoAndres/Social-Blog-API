import dotenv from 'dotenv';
import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';

dotenv.config();

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const getFromAddress = () => ({
  email: process.env.MAILERSEND_FROM_EMAIL || 'no-reply@socialblog.com',
  name: process.env.MAILERSEND_FROM_NAME || 'Social Blog',
});

const buildEmailParams = ({ to, subject, text, html }) => {
  const { email, name } = getFromAddress();
  const sender = new Sender(email, name);
  const recipient = new Recipient(to, to);

  return new EmailParams()
    .setFrom(sender)
    .setTo([recipient])
    .setReplyTo(sender)
    .setSubject(subject)
    .setText(text)
    .setHtml(html);
};

export { buildEmailParams, getFromAddress, mailersend };

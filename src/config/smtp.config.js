import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SMTP Configuration
 * Tạo transporter để gửi email qua Gmail
 */
export const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  // Validate credentials
  if (!smtpUser || !smtpPassword) {
    const missing = [];
    if (!smtpUser) missing.push('SMTP_USER');
    if (!smtpPassword) missing.push('SMTP_PASSWORD');
    
    throw new Error(
      `SMTP credentials are missing. Please set the following environment variables: ${missing.join(', ')}. ` +
      `Check Vercel Dashboard → Settings → Environment Variables.`
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

/**
 * Verify SMTP connection
 */
export const verifyConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP Server is ready to send emails');
    return true;
  } catch (error) {
    console.error('SMTP Server connection failed:', error.message);
    return false;
  }
};

export default { createTransporter, verifyConnection };


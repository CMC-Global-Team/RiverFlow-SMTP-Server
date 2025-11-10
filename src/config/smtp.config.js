import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SMTP Configuration
 * Tạo transporter để gửi email qua Gmail
 */
export const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
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
    console.log('✅ SMTP Server is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ SMTP Server connection failed:', error.message);
    return false;
  }
};

export default { createTransporter, verifyConnection };


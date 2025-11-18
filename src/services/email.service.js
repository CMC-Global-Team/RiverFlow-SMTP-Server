import { createTransporter } from '../config/smtp.config.js';
import { config } from '../config/app.config.js';

/**
 * Email Service
 * Xử lý các chức năng gửi email
 */
class EmailService {
  constructor() {
    this.transporter = createTransporter();
  }

  /**
   * Gửi email chung
   */
  async sendEmail({ to, subject, html, text }) {
    try {
      // Recreate transporter to ensure credentials are fresh
      this.transporter = createTransporter();
      
      const mailOptions = {
        from: config.smtp.from || config.smtp.user,
        to,
        subject,
        html,
        text: text || '',
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: info.messageId,
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Provide helpful error message
      if (error.message.includes('Missing credentials') || error.message.includes('SMTP credentials')) {
        throw new Error(
          `SMTP configuration error: ${error.message}. ` +
          `Please check environment variables SMTP_USER and SMTP_PASSWORD in Vercel Dashboard.`
        );
      }
      
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Gửi email xác thực tài khoản
   */
  async sendVerificationEmail({ to, token, frontendUrl }) {
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background-color: #4F46E5; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RiverFlow - Email Verification</h1>
          </div>
          <div class="content">
            <h2>Welcome to RiverFlow!</h2>
            <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${verificationLink}</p>
            <p><strong>Note:</strong> This link will expire in 15 minutes.</p>
          </div>
          <div class="footer">
            <p>If you didn't create an account with RiverFlow, please ignore this email.</p>
            <p>&copy; 2024 RiverFlow. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject: 'RiverFlow - Verify Your Email Address',
      html,
      text: `Welcome to RiverFlow! Please verify your email by visiting: ${verificationLink}`,
    });
  }

  /**
   * Gửi email reset password
   */
  async sendResetPasswordEmail({ to, token, frontendUrl }) {
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #DC2626; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background-color: #DC2626; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .warning { background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RiverFlow - Password Reset</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #DC2626;">${resetLink}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 15 minutes</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Your password won't change until you create a new one</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>If you didn't request a password reset, please contact support immediately.</p>
            <p>&copy; 2024 RiverFlow. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject: 'RiverFlow - Reset Your Password',
      html,
      text: `Reset your RiverFlow password by visiting: ${resetLink}`,
    });
  }

  /**
   * Gửi email mời cộng tác
   */
  async sendInvitationEmail({ to, token, inviterName, mindmapTitle, frontendUrl }) {
    const acceptInviteLink = `${frontendUrl}/accept-invitation?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background-color: #4F46E5; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .mindmap-title { color: #4F46E5; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 RiverFlow - Collaboration Invitation</h1>
          </div>
          <div class="content">
            <h2>You're Invited to Collaborate!</h2>
            <p><strong>${inviterName}</strong> has invited you to collaborate on a mindmap:</p>
            <div style="background-color: #E5E7EB; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4F46E5;">
              <p class="mindmap-title">"${mindmapTitle}"</p>
            </div>
            <p>Click the button below to accept the invitation and start collaborating:</p>
            <div style="text-align: center;">
              <a href="${acceptInviteLink}" class="button">Accept Invitation</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${acceptInviteLink}</p>
            <p><strong>Note:</strong> This invitation will expire in 7 days.</p>
          </div>
          <div class="footer">
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            <p>&copy; 2024 RiverFlow. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject: `RiverFlow - ${inviterName} invited you to collaborate on "${mindmapTitle}"`,
      html,
      text: `${inviterName} invited you to collaborate on "${mindmapTitle}". Visit: ${acceptInviteLink}`,
    });
  }
}

export default new EmailService();


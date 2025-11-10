import emailService from '../services/email.service.js';

/**
 * Email Controller
 * Xử lý các requests liên quan đến email
 */
class EmailController {
  /**
   * Gửi email chung
   * POST /api/email/send
   */
  async sendEmail(req, res, next) {
    try {
      const { to, subject, html, text } = req.body;
      
      const result = await emailService.sendEmail({
        to,
        subject,
        html,
        text,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gửi email xác thực
   * POST /api/email/verification
   */
  async sendVerificationEmail(req, res, next) {
    try {
      const { to, token, frontendUrl } = req.body;
      
      const result = await emailService.sendVerificationEmail({
        to,
        token,
        frontendUrl,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gửi email reset password
   * POST /api/email/reset-password
   */
  async sendResetPasswordEmail(req, res, next) {
    try {
      const { to, token, frontendUrl } = req.body;
      
      const result = await emailService.sendResetPasswordEmail({
        to,
        token,
        frontendUrl,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Health check
   * GET /api/email/health
   */
  async healthCheck(req, res) {
    res.status(200).json({
      success: true,
      message: 'SMTP Server is running',
      timestamp: new Date().toISOString(),
    });
  }
}

export default new EmailController();


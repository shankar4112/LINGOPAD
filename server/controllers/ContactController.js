import EmailService from '../services/EmailService.js';

class ContactController {
  constructor() {
    this.emailService = new EmailService();
  }

  // POST /contact - Handle contact form submission
  submitContactForm = async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields (name, email, subject, message) are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide a valid email address'
        });
      }

      // Validate message length
      if (message.length < 10) {
        return res.status(400).json({
          status: 'error',
          message: 'Message must be at least 10 characters long'
        });
      }

      if (message.length > 1000) {
        return res.status(400).json({
          status: 'error',
          message: 'Message must be less than 1000 characters'
        });
      }

      // Send contact email
      await this.emailService.sendContactEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim()
      });

      res.json({
        status: 'success',
        message: 'Your message has been sent successfully! We\'ll get back to you soon.'
      });

    } catch (error) {
      console.error('Contact form submission error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to send your message. Please try again later.'
      });
    }
  };

  // GET /contact/verify - Verify email service
  verifyEmailService = async (req, res) => {
    try {
      const result = await this.emailService.verifyConnection();
      
      res.json({
        status: 'success',
        message: result.message
      });

    } catch (error) {
      console.error('Email service verification error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Email service verification failed'
      });
    }
  };

  // POST /contact/newsletter - Handle newsletter subscription (future feature)
  subscribeNewsletter = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: 'error',
          message: 'Email is required for newsletter subscription'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide a valid email address'
        });
      }

      // TODO: Implement newsletter subscription logic
      // For now, just send a confirmation email

      await this.emailService.sendNotificationEmail(
        email.trim().toLowerCase(),
        'Welcome to LingoPad Newsletter! 🌍',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; text-align: center;">Welcome to LingoPad Newsletter! 🌍</h2>
          <p>Thank you for subscribing to our newsletter. You'll be the first to know about:</p>
          <ul>
            <li>New language support</li>
            <li>Feature updates and improvements</li>
            <li>Tips for better translation and language learning</li>
            <li>Special announcements</li>
          </ul>
          <p>Stay tuned for exciting updates!</p>
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
            Best regards,<br>The LingoPad Team
          </p>
        </div>
        `
      );

      res.json({
        status: 'success',
        message: 'Successfully subscribed to newsletter! Check your email for confirmation.'
      });

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to subscribe to newsletter'
      });
    }
  };
}

export default ContactController;

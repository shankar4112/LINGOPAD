import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER || 'shankar4112004@gmail.com',
          pass: process.env.EMAIL_PASS || 'your-app-password' // Use App Password for Gmail
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });

      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  // Send contact form email
  async sendContactEmail(contactData) {
    try {
      const { name, email, subject, message } = contactData;

      if (!name || !email || !subject || !message) {
        throw new Error('All contact form fields are required');
      }

      // Email to admin
      const adminMailOptions = {
        from: process.env.EMAIL_USER || 'shankar4112004@gmail.com',
        to: 'shankar4112004@gmail.com',
        subject: `LingoPad Contact: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center; margin-bottom: 30px;">
              🌍 New Contact Message - LingoPad
            </h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1e293b; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
              <p style="line-height: 1.6; color: #374151;">${message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #6b7280; font-size: 14px;">
                This message was sent from the LingoPad contact form.<br>
                <strong>Received:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        `
      };

      // Auto-reply to user
      const userMailOptions = {
        from: process.env.EMAIL_USER || 'shankar4112004@gmail.com',
        to: email,
        subject: 'Thank you for contacting LingoPad! 🌍',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center; margin-bottom: 30px;">
              🌍 Thank You for Contacting LingoPad!
            </h2>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <p style="color: #1e293b; margin: 0;">Hi <strong>${name}</strong>,</p>
              <p style="color: #374151; margin: 15px 0;">
                Thank you for reaching out to us! We've received your message about "<strong>${subject}</strong>" 
                and our team will get back to you as soon as possible.
              </p>
              <p style="color: #374151; margin: 15px 0;">
                We typically respond within 24 hours during business days.
              </p>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #1e293b;">Your Message Summary:</h3>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #374151;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 10px 0 0 0; color: #6b7280; font-style: italic;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
              </div>
            </div>
            
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #059669; margin-top: 0;">While you wait, why not try LingoPad?</h3>
              <p style="color: #374151; margin: 10px 0;">
                🚀 Translate between 17 supported languages with AI precision<br>
                🔊 Get pronunciation guides for better learning<br>
                💾 Save your favorite translations for later
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong>The LingoPad Team</strong>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                This is an automated response. Please do not reply to this email.
              </p>
            </div>
          </div>
        `
      };

      // Send both emails
      await Promise.all([
        this.transporter.sendMail(adminMailOptions),
        this.transporter.sendMail(userMailOptions)
      ]);

      return {
        success: true,
        message: 'Contact email sent successfully'
      };

    } catch (error) {
      console.error('Failed to send contact email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Send notification email
  async sendNotificationEmail(to, subject, content) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'shankar4112004@gmail.com',
        to: to,
        subject: subject,
        html: content
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Notification email sent successfully' };
    } catch (error) {
      console.error('Failed to send notification email:', error);
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  // Verify email service connection
  async verifyConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service connection verified' };
    } catch (error) {
      console.error('Email service verification failed:', error);
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }
}

export default EmailService;

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendLoginNotification(userEmail) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Successful Login - Social Media Manager',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <h2 style="color: #333;">Welcome Back!</h2>
            <p>Hello,</p>
            <p>You have successfully logged in to your Social Media Manager account.</p>
            <p>If you did not perform this login, please contact our support team immediately.</p>
            <p>Time of login: ${new Date().toLocaleString()}</p>
            <br>
            <p>Best regards,</p>
            <p>Social Media Manager Team</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Login notification email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending login notification email:', error);
      return false;
    }
  }

  async sendAdminNotification(userEmail) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'yillipillinikitha4804@gmail.com';
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: 'New User Login - Social Media Manager',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <h2 style="color: #333;">New User Login Alert</h2>
            <p>Hello Admin,</p>
            <p>A user has just logged in to the Social Media Manager platform.</p>
            <p><strong>User Email:</strong> ${userEmail}</p>
            <p><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
            <br>
            <p>Best regards,</p>
            <p>Social Media Manager System</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Admin notification email sent for user ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      return false;
    }
  }
}

module.exports = new EmailService(); 
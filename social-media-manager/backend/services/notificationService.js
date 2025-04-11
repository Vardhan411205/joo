const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

class NotificationService {
  static async sendEmail(userId, subject, html) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.notificationPreferences.email) return;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject,
        html
      });
    } catch (error) {
      console.error('Email notification error:', error);
    }
  }

  static async sendPushNotification(userId, title, body) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.notificationPreferences.push) return;

      // Implement push notification logic here
      // You might want to use a service like Firebase Cloud Messaging
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }

  static async sendSMS(userId, message) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.notificationPreferences.sms) return;

      // Implement SMS logic here
      // You might want to use a service like Twilio
    } catch (error) {
      console.error('SMS notification error:', error);
    }
  }
}

module.exports = NotificationService; 
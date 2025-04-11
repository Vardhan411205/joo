const User = require('../models/User');
const SocialAccount = require('../models/SocialAccount');

const settingsController = {
  // Update profile settings
  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = await User.findById(req.user._id);

      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  },

  // Update notification preferences
  updateNotifications: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update only the provided notification preferences
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...req.body
      };

      await user.save();

      res.json({
        success: true,
        message: 'Notification preferences updated',
        preferences: user.notificationPreferences
      });
    } catch (error) {
      console.error('Update notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating notification preferences'
      });
    }
  },

  // Connect social media account
  connectSocialAccount: async (req, res) => {
    try {
      const { platform, accessToken, platformUserId, username } = req.body;
      
      let socialAccount = await SocialAccount.findOne({
        user: req.user._id,
        platform
      });

      if (!socialAccount) {
        socialAccount = new SocialAccount({
          user: req.user._id,
          platform,
          accessToken,
          platformUserId,
          platformUsername: username
        });
      } else {
        socialAccount.accessToken = accessToken;
        socialAccount.platformUserId = platformUserId;
        socialAccount.platformUsername = username;
      }

      await socialAccount.save();

      res.json({
        success: true,
        message: `Connected to ${platform}`
      });
    } catch (error) {
      console.error('Social connect error:', error);
      res.status(500).json({ message: 'Error connecting account' });
    }
  },

  // Get connected social accounts
  getSocialAccounts: async (req, res) => {
    try {
      const accounts = await SocialAccount.find({ 
        user: req.user._id,
        isActive: true
      });

      res.json({
        success: true,
        accounts
      });
    } catch (error) {
      console.error('Get social accounts error:', error);
      res.status(500).json({ message: 'Error fetching accounts' });
    }
  },

  // Update preferences
  updatePreferences: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.preferences = {
        ...user.preferences,
        ...req.body
      };
      await user.save();

      res.json({
        success: true,
        preferences: user.preferences
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ message: 'Error updating preferences' });
    }
  },

  // Get preferences
  getPreferences: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      res.json({
        success: true,
        data: user.preferences
      });
    } catch (error) {
      console.error('Get preferences error:', error);
      res.status(500).json({ message: 'Error fetching preferences' });
    }
  },

  // Get notification preferences
  getNotifications: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        preferences: user.notificationPreferences
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching notification preferences'
      });
    }
  }
};

module.exports = settingsController; 
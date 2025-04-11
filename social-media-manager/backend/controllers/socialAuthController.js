const SocialMediaIntegration = require('../services/socialMediaIntegration');
const User = require('../models/User');

const socialAuthController = {
  // Facebook OAuth
  facebookAuth: async (req, res) => {
    try {
      const { code } = req.body;
      const result = await SocialMediaIntegration.connectFacebook(code, req.user.id);
      
      await User.findByIdAndUpdate(req.user.id, {
        'socialAccounts.facebook': {
          connected: true,
          accessToken: result.accessToken
        }
      });

      res.json({ message: 'Facebook connected successfully' });
    } catch (error) {
      console.error('Facebook auth error:', error);
      res.status(500).json({ message: 'Failed to connect Facebook' });
    }
  },

  // Twitter OAuth
  twitterAuth: async (req, res) => {
    try {
      const { oauthToken, oauthVerifier } = req.body;
      const result = await SocialMediaIntegration.connectTwitter(oauthToken, oauthVerifier);
      
      await User.findByIdAndUpdate(req.user.id, {
        'socialAccounts.twitter': {
          connected: true,
          accessToken: result.accessToken
        }
      });

      res.json({ message: 'Twitter connected successfully' });
    } catch (error) {
      console.error('Twitter auth error:', error);
      res.status(500).json({ message: 'Failed to connect Twitter' });
    }
  },

  // LinkedIn OAuth
  linkedinAuth: async (req, res) => {
    try {
      const { code } = req.body;
      const result = await SocialMediaIntegration.connectLinkedIn(code);
      
      await User.findByIdAndUpdate(req.user.id, {
        'socialAccounts.linkedin': {
          connected: true,
          accessToken: result.accessToken
        }
      });

      res.json({ message: 'LinkedIn connected successfully' });
    } catch (error) {
      console.error('LinkedIn auth error:', error);
      res.status(500).json({ message: 'Failed to connect LinkedIn' });
    }
  },

  // Get connected platforms
  getConnectedPlatforms: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('socialAccounts');
      const platforms = {
        facebook: user.socialAccounts.facebook.connected,
        twitter: user.socialAccounts.twitter.connected,
        linkedin: user.socialAccounts.linkedin.connected,
        instagram: user.socialAccounts.instagram.connected
      };
      
      res.json(platforms);
    } catch (error) {
      console.error('Get platforms error:', error);
      res.status(500).json({ message: 'Failed to get connected platforms' });
    }
  }
};

module.exports = socialAuthController; 
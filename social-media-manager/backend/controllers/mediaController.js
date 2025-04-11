const Media = require('../models/Media');
const User = require('../models/User');
const SocialAccount = require('../models/SocialAccount');
const { streamUpload } = require('../utils/streamUpload');
const axios = require('axios');

const mediaController = {
  // Upload media
  uploadMedia: async (req, res) => {
    try {
      const result = await streamUpload(req);
      res.json(result);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Error uploading file' });
    }
  },

  // Get all media
  getAllMedia: async (req, res) => {
    try {
      const media = await Media.find({ user: req.user._id });
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching media' });
    }
  },

  // Delete media
  deleteMedia: async (req, res) => {
    try {
      await Media.findByIdAndDelete(req.params.id);
      res.json({ message: 'Media deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting media' });
    }
  },

  // Update media
  updateMedia: async (req, res) => {
    try {
      const media = await Media.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update media' });
    }
  },

  // Connect social media account
  connectSocialAccount: async (req, res) => {
    try {
      const { platform, accessToken, userId } = req.body;
      
      const socialAccount = await SocialAccount.create({
        user: userId,
        platform,
        accessToken,
        isActive: true
      });

      res.status(201).json({
        success: true,
        data: socialAccount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error connecting social account'
      });
    }
  },

  // Get connected social accounts
  getConnectedAccounts: async (req, res) => {
    try {
      const accounts = await SocialAccount.find({
        user: req.user._id,
        isActive: true
      });

      res.json({
        success: true,
        data: accounts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching connected accounts'
      });
    }
  },

  // Disconnect social account
  disconnectAccount: async (req, res) => {
    try {
      const { platform } = req.params;
      
      await SocialAccount.findOneAndUpdate(
        {
          user: req.user._id,
          platform
        },
        { isActive: false }
      );

      res.json({
        success: true,
        message: `${platform} account disconnected`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error disconnecting account'
      });
    }
  },

  // Facebook authentication callback
  facebookCallback: async (req, res) => {
    try {
      const { code } = req.query;
      const response = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          code,
          redirect_uri: process.env.FACEBOOK_CALLBACK_URL
        }
      });

      const { access_token } = response.data;

      // Get user profile from Facebook
      const profileResponse = await axios.get('https://graph.facebook.com/me', {
        params: {
          fields: 'id,name,email',
          access_token
        }
      });

      const socialAccount = await SocialAccount.create({
        user: req.user._id,
        platform: 'facebook',
        accessToken: access_token,
        platformUserId: profileResponse.data.id,
        platformUsername: profileResponse.data.name,
        isActive: true
      });

      res.redirect(`${process.env.FRONTEND_URL}/settings?connection=success`);
    } catch (error) {
      console.error('Facebook auth error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/settings?connection=failed`);
    }
  },

  // Twitter authentication callback
  twitterCallback: async (req, res) => {
    try {
      const { oauth_token, oauth_verifier } = req.query;
      
      // Get access token from Twitter
      const response = await axios.post('https://api.twitter.com/oauth/access_token', null, {
        params: {
          oauth_token,
          oauth_verifier
        }
      });

      const params = new URLSearchParams(response.data);
      const access_token = params.get('oauth_token');
      const screen_name = params.get('screen_name');
      const user_id = params.get('user_id');

      const socialAccount = await SocialAccount.create({
        user: req.user._id,
        platform: 'twitter',
        accessToken: access_token,
        platformUserId: user_id,
        platformUsername: screen_name,
        isActive: true
      });

      res.redirect(`${process.env.FRONTEND_URL}/settings?connection=success`);
    } catch (error) {
      console.error('Twitter auth error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/settings?connection=failed`);
    }
  }
};

module.exports = mediaController; 
const SocialAccount = require('../models/SocialAccount');
const User = require('../models/User');
const oauthConfig = require('../config/oauthConfig');
const axios = require('axios');

const socialMediaController = {
  connectAccount: async (req, res) => {
    try {
      const { platform } = req.params;
      const { accessToken, userData } = req.body;

      let account = await SocialAccount.findOne({
        user: req.user._id,
        platform
      });

      if (account) {
        account.accessToken = accessToken;
        account.platformUserId = userData.id;
        account.platformUsername = userData.username;
      } else {
        account = new SocialAccount({
          user: req.user._id,
          platform,
          accessToken,
          platformUserId: userData.id,
          platformUsername: userData.username
        });
      }

      await account.save();

      // Update user's social accounts
      const user = await User.findById(req.user._id);
      user.socialAccounts[platform].connected = true;
      await user.save();

      res.json({
        success: true,
        message: `Successfully connected to ${platform}`,
        account: {
          platform,
          username: userData.username
        }
      });
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to connect to ${platform}`
      });
    }
  },

  disconnectAccount: async (req, res) => {
    try {
      const { platform } = req.params;

      await SocialAccount.findOneAndUpdate(
        { user: req.user._id, platform },
        { isActive: false }
      );

      // Update user's social accounts
      const user = await User.findById(req.user._id);
      user.socialAccounts[platform].connected = false;
      await user.save();

      res.json({
        success: true,
        message: `Successfully disconnected from ${platform}`
      });
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to disconnect from ${platform}`
      });
    }
  },

  getConnectedAccounts: async (req, res) => {
    try {
      const accounts = await SocialAccount.find({
        user: req.user._id,
        isActive: true
      });

      res.json({
        success: true,
        accounts: accounts.map(acc => ({
          platform: acc.platform,
          username: acc.platformUsername
        }))
      });
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch connected accounts'
      });
    }
  },

  facebookCallback: async (req, res) => {
    try {
      const { code } = req.query;
      
      // Exchange code for access token
      const tokenResponse = await axios.get(oauthConfig.facebook.tokenUrl, {
        params: {
          client_id: oauthConfig.facebook.clientId,
          client_secret: oauthConfig.facebook.clientSecret,
          code,
          redirect_uri: oauthConfig.facebook.callbackUrl
        }
      });

      const { access_token } = tokenResponse.data;

      // Get user profile
      const profileResponse = await axios.get('https://graph.facebook.com/me', {
        params: {
          fields: 'id,name,email',
          access_token
        }
      });

      // Connect account
      await socialMediaController.connectAccount(req, res, {
        platform: 'facebook',
        accessToken: access_token,
        userData: {
          id: profileResponse.data.id,
          username: profileResponse.data.name
        }
      });

      // Redirect to frontend with success
      res.redirect(`${process.env.FRONTEND_URL}/settings?connection=success`);
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/settings?connection=error`);
    }
  },

  twitterCallback: async (req, res) => {
    try {
      const { code } = req.query;

      // Exchange code for access token
      const tokenResponse = await axios.post(oauthConfig.twitter.tokenUrl, {
        code,
        grant_type: 'authorization_code',
        client_id: oauthConfig.twitter.clientId,
        client_secret: oauthConfig.twitter.clientSecret,
        redirect_uri: oauthConfig.twitter.callbackUrl
      });

      const { access_token } = tokenResponse.data;

      // Get user profile
      const profileResponse = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });

      // Connect account
      await socialMediaController.connectAccount(req, res, {
        platform: 'twitter',
        accessToken: access_token,
        userData: {
          id: profileResponse.data.data.id,
          username: profileResponse.data.data.username
        }
      });

      res.redirect(`${process.env.FRONTEND_URL}/settings?connection=success`);
    } catch (error) {
      console.error('Twitter OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/settings?connection=error`);
    }
  },

  initiateOAuth: async (req, res) => {
    try {
      const { platform } = req.params;
      const config = oauthConfig[platform];

      if (!config) {
        return res.status(400).json({
          success: false,
          message: `Unsupported platform: ${platform}`
        });
      }

      const authUrl = new URL(config.authUrl);
      authUrl.searchParams.append('client_id', config.clientId);
      authUrl.searchParams.append('redirect_uri', config.callbackUrl);
      authUrl.searchParams.append('scope', config.scope.join(' '));
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('state', req.user._id.toString());

      res.json({
        success: true,
        authUrl: authUrl.toString()
      });
    } catch (error) {
      console.error('OAuth initiation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initiate OAuth flow'
      });
    }
  }
};

module.exports = socialMediaController; 
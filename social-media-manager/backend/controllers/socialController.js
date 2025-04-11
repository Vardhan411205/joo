const User = require('../models/User');
const SocialMediaIntegration = require('../services/socialMediaIntegration');

// Get platform connection status
const getPlatformStatus = async (req, res) => {
  try {
    // Get user from middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Default platform status
    const platforms = {
      facebook: false,
      twitter: false,
      instagram: false,
      linkedin: false
    };

    // Update status if user has social connections
    if (user.socialConnections) {
      Object.keys(platforms).forEach(platform => {
        platforms[platform] = user.socialConnections[platform]?.connected || false;
      });
    }

    res.json(platforms);
  } catch (error) {
    console.error('Error fetching platform status:', error);
    res.status(500).json({ message: 'Failed to fetch platform status' });
  }
};

// Connect platform
const connectPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const { accessToken, refreshToken } = req.body;

    const user = await User.findById(req.user.id);
    user.socialConnections[platform] = {
      accessToken,
      refreshToken,
      connected: true
    };
    await user.save();

    res.json({ message: `Connected to ${platform}` });
  } catch (error) {
    res.status(500).json({ message: 'Error connecting platform' });
  }
};

// Disconnect platform
const disconnectPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    
    const user = await User.findById(req.user.id);
    user.socialConnections[platform] = {
      connected: false
    };
    await user.save();

    res.json({ message: `Disconnected from ${platform}` });
  } catch (error) {
    res.status(500).json({ message: 'Error disconnecting platform' });
  }
};

const getConnectedPlatforms = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('socialConnections');
    const platforms = Object.entries(user.socialConnections).reduce((acc, [platform, data]) => {
      acc[platform] = data.connected;
      return acc;
    }, {});

    res.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ message: 'Error fetching connected platforms' });
  }
};

module.exports = {
  getPlatformStatus,
  connectPlatform,
  disconnectPlatform,
  getConnectedPlatforms
}; 
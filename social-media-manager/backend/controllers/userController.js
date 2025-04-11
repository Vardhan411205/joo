const User = require('../models/User');
const Activity = require('../models/Activity');
const cloudinary = require('../config/cloudinary');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Update password if provided
    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Update failed' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    // Log activity
    await Activity.create({
      user: user._id,
      action: 'Password changed',
      timestamp: new Date()
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
};

const updateNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.notificationPreferences = req.body.preferences;
    await user.save();

    res.json({
      message: 'Notification preferences updated',
      preferences: user.notificationPreferences
    });
  } catch (error) {
    console.error('Notification update error:', error);
    res.status(500).json({ message: 'Failed to update preferences' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findById(req.user.id);
    
    user.avatar = result.secure_url;
    await user.save();

    res.json({
      message: 'Avatar updated successfully',
      avatar: result.secure_url
    });
  } catch (error) {
    console.error('Avatar update error:', error);
    res.status(500).json({ message: 'Failed to update avatar' });
  }
};

const getActivityHistory = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(activities);
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch activity history' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  updateNotifications,
  updateAvatar,
  getActivityHistory
}; 
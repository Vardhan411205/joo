const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Admin = require('../models/Admin');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

const adminController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json({ success: true, users });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching users'
      });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email, role } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Don't allow changing the last admin's role
      if (user.role === 'admin' && role !== 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Cannot remove the last admin'
          });
        }
      }

      user.name = name;
      user.email = email;
      user.role = role;

      await user.save();

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating user'
      });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Don't allow deleting the last admin
      if (user.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete the last admin'
          });
        }
      }

      await user.remove();

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting user'
      });
    }
  },

  getCampaigns: async (req, res) => {
    try {
      const campaigns = await Campaign.find().populate('user', 'name');
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching campaigns' });
    }
  },

  createAdmin: async (req, res) => {
    try {
      const { name, email, password, role, permissions } = req.body;

      if (req.admin.role !== 'super-admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const admin = await Admin.create({
        name,
        email,
        password,
        role,
        permissions
      });

      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating admin' });
    }
  },

  getAnalytics: async (req, res) => {
    try {
      const [users, campaigns, posts] = await Promise.all([
        User.countDocuments(),
        Campaign.countDocuments({ status: 'active' }),
        Post.countDocuments()
      ]);

      const userGrowth = await User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const platformStats = await Post.aggregate([
        {
          $unwind: "$platforms"
        },
        {
          $group: {
            _id: "$platforms",
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        totalUsers: users,
        activeCampaigns: campaigns,
        totalPosts: posts,
        userGrowth: userGrowth.map(item => ({
          date: item._id,
          users: item.count
        })),
        platformDistribution: platformStats.map(item => ({
          platform: item._id,
          value: item.count
        }))
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching analytics' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });

      if (!admin || !(await admin.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        token,
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  }
};

module.exports = adminController; 
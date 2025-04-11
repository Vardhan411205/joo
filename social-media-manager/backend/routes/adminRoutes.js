const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  login,
  getUsers,
  updateUserStatus,
  getCampaigns,
  getAnalytics,
  createAdmin,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/adminController');

// Public routes
router.post('/login', login);

// Protected routes
router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.get('/campaigns', getCampaigns);
router.get('/analytics', getAnalytics);
router.post('/create', createAdmin);

module.exports = router; 
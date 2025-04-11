const Admin = require('../models/Admin');

exports.adminOnly = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

exports.superAdminOnly = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin || admin.role !== 'super-admin') {
      return res.status(403).json({ message: 'Access denied. Super admin only.' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
}; 
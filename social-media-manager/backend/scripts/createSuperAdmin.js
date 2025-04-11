require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const superAdmin = await Admin.create({
      name: 'Super Admin',
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com',
      password: process.env.SUPER_ADMIN_PASSWORD || 'admin123',
      role: 'super-admin',
      permissions: [
        'manage_users',
        'manage_campaigns',
        'view_analytics',
        'manage_settings'
      ]
    });

    console.log('Super admin created successfully:', superAdmin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin(); 
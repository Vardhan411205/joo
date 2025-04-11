const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

class MediaUploader {
  static uploadMiddleware = upload.array('media', 4); // Max 4 files

  static async uploadToCloud(files) {
    try {
      const uploadPromises = files.map(file => 
        cloudinary.uploader.upload(file.path, {
          folder: 'social-media-posts',
          resource_type: 'auto'
        })
      );

      const results = await Promise.all(uploadPromises);

      // Clean up local files
      await Promise.all(
        files.map(file => fs.unlink(file.path))
      );

      return results.map(result => result.secure_url);
    } catch (error) {
      console.error('Error uploading to cloud:', error);
      throw error;
    }
  }
}

module.exports = MediaUploader; 
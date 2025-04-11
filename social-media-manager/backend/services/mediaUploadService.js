const cloudinary = require('cloudinary').v2;
const Media = require('../models/Media');

class MediaUploadService {
  static async uploadMedia(file, userId) {
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: `social-media-manager/${userId}`
      });

      // Create media record
      const media = await Media.create({
        user: userId,
        url: result.secure_url,
        publicId: result.public_id,
        type: result.resource_type,
        format: result.format,
        size: file.size
      });

      return media;
    } catch (error) {
      console.error('Media upload error:', error);
      throw error;
    }
  }

  static async deleteMedia(mediaId, userId) {
    try {
      const media = await Media.findOne({ _id: mediaId, user: userId });
      if (!media) {
        throw new Error('Media not found');
      }

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(media.publicId);

      // Delete from database
      await media.remove();

      return true;
    } catch (error) {
      console.error('Media deletion error:', error);
      throw error;
    }
  }

  static async getUserMedia(userId, page = 1, limit = 20) {
    try {
      const media = await Media.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Media.countDocuments({ user: userId });

      return {
        media,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Get user media error:', error);
      throw error;
    }
  }
}

module.exports = MediaUploadService; 
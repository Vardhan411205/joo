import imageCompression from 'browser-image-compression';

class ImageOptimizer {
  static async optimizeImage(file) {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Image compression error:', error);
      return file;
    }
  }

  static async optimizeMultiple(files) {
    return Promise.all(files.map(file => this.optimizeImage(file)));
  }
}

export default ImageOptimizer; 
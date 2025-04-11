import React, { useState, useRef } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ASPECT_RATIOS = {
  facebook: 1.91, // 1200x630
  instagram: 1, // Square
  twitter: 1.91, // 1200x630
  linkedin: 1.91 // 1200x630
};

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageCropper = ({ open, onClose, image, platform, onCropComplete }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const aspect = ASPECT_RATIOS[platform] || 16 / 9;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    const croppedImageUrl = canvas.toDataURL('image/jpeg');
    onCropComplete(croppedImageUrl);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Crop Image for {platform}
        </Typography>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={ASPECT_RATIOS[platform]}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={image}
              style={{ maxWidth: '100%' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleCropComplete}
          variant="contained"
          disabled={!completedCrop?.width || !completedCrop?.height}
        >
          Apply Crop
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper; 
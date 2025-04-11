import React, { useState } from 'react';
import {
  Box,
  ImageList,
  ImageListItem,
  IconButton,
  Dialog,
  DialogContent,
  Typography
} from '@mui/material';
import { ZoomIn as ZoomInIcon, Close as CloseIcon } from '@mui/icons-material';

const MediaPreview = ({ urls, onPreview }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!urls || urls.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Attached Media
      </Typography>
      <ImageList cols={4} rowHeight={164}>
        {urls.map((url, index) => (
          <ImageListItem key={url}>
            <img
              src={url}
              alt={`Media ${index + 1}`}
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 5,
                right: 5,
                bgcolor: 'background.paper'
              }}
              size="small"
              onClick={() => setSelectedImage(url)}
            >
              <ZoomInIcon />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>

      <Dialog 
        open={!!selectedImage} 
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'background.paper'
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImage}
            alt="Preview"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MediaPreview; 
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const platformIcons = {
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />
};

const PostPreview = ({ open, onClose, post }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Post Preview</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Platforms
          </Typography>
          <Box sx={{ mt: 1 }}>
            {post.platforms.map((platform) => (
              <Chip
                key={platform}
                icon={platformIcons[platform]}
                label={platform}
                sx={{ mr: 1 }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Content
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {post.content}
          </Typography>
        </Box>

        {post.scheduledDate && (
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Scheduled for
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {new Date(post.scheduledDate).toLocaleString()}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostPreview; 
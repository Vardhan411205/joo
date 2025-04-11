import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import postService from '../../services/postService';

const HashtagGenerator = ({ open, onClose, content, onSelect }) => {
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateHashtags = async () => {
    try {
      setLoading(true);
      const response = await postService.generateHashtags(content);
      setHashtags(response.data.hashtags);
    } catch (error) {
      console.error('Error generating hashtags:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open && content) {
      generateHashtags();
    }
  }, [open, content]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Suggested Hashtags</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            {hashtags.map((hashtag) => (
              <Chip
                key={hashtag}
                label={hashtag}
                onClick={() => onSelect(hashtag)}
                sx={{ m: 0.5 }}
                clickable
              />
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HashtagGenerator; 
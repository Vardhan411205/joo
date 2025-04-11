import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import MediaUpload from './MediaUpload';
import MediaPreview from './MediaPreview';

const PostGenerator = ({ open, onClose, onSave, campaignId }) => {
  const [formData, setFormData] = useState({
    platform: '',
    topic: '',
    tone: '',
    length: 'medium'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/generate',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setGeneratedContent(response.data.content);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate content');
    }
    setLoading(false);
  };

  const handleMediaUpload = (urls) => {
    setMediaUrls(urls);
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        content: generatedContent,
        platform: formData.platform,
        campaignId,
        scheduledDate: new Date().toISOString(),
        mediaUrls
      };
      await onSave(postData);
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Generate Social Media Post</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
            >
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tone</InputLabel>
            <Select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              required
            >
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="humorous">Humorous</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Length</InputLabel>
            <Select
              name="length"
              value={formData.length}
              onChange={handleChange}
            >
              <MenuItem value="short">Short</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="long">Long</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Media
          </Typography>
          <MediaUpload 
            onUploadComplete={handleMediaUpload} 
            platform={formData.platform} 
          />
          <MediaPreview urls={mediaUrls} />
        </Box>

        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading || !formData.platform || !formData.topic || !formData.tone}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Content'}
        </Button>

        {generatedContent && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Generated Content:</Typography>
            <TextField
              multiline
              rows={6}
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          disabled={!generatedContent}
          variant="contained"
        >
          Save Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostGenerator; 
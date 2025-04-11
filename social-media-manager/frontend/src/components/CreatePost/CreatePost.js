import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useAuth } from '../../contexts/AuthContext';

const CreatePost = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    platform: '',
    topic: '',
    scheduleTime: null,
    tone: '',
    campaignId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.platform || !formData.scheduleTime || !formData.topic) {
      setError('Please fill in all required fields');
      return;
    }

    if (!token) {
      setError('Authentication required. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Store post in localStorage instead of making API call
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const newPost = {
        id: Date.now(),
        content: generatedContent || formData.topic,
        platform: formData.platform,
        scheduleTime: formData.scheduleTime.toISOString(),
        tone: formData.tone,
        campaignId: formData.campaignId || null,
        createdAt: new Date().toISOString()
      };
      
      posts.push(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));

      setSuccess('Post created and scheduled successfully!');
      
      // Reset form
      setFormData({
        platform: '',
        topic: '',
        scheduleTime: null,
        tone: '',
        campaignId: ''
      });
      setGeneratedContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      scheduleTime: date
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              select
              label="Platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
            >
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
            >
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <DateTimePicker
              label="Schedule Time"
              value={formData.scheduleTime}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {/* Generate content logic */}}
              disabled={loading || !formData.topic || !formData.platform || !formData.tone}
            >
              Generate Content
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ float: 'right' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Post'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreatePost; 
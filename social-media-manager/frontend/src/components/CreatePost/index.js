import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
    platform: '',
    campaignName: '',
    tone: '',
    scheduleTime: new Date()
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const platforms = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'];
  const tones = ['Professional', 'Casual', 'Friendly', 'Formal', 'Humorous'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      scheduleTime: newDate
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.content || !formData.platform || !formData.tone || !formData.scheduleTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Get existing posts
      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      
      // Create new post
      const newPost = {
        id: Date.now().toString(),
        ...formData,
        scheduleTime: formData.scheduleTime.toISOString(),
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      };
      
      // Add new post to existing posts
      const updatedPosts = [...existingPosts, newPost];
      localStorage.setItem('posts', JSON.stringify(updatedPosts));

      // Verify the post was saved
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      if (!savedPosts.find(post => post.id === newPost.id)) {
        throw new Error('Failed to save post');
      }

      setSuccess('Post created successfully! Redirecting to schedule page...');

      // Reset form
      setFormData({
        content: '',
        platform: '',
        campaignName: '',
        tone: '',
        scheduleTime: new Date()
      });

      // Redirect to schedule page after 1.5 seconds
      setTimeout(() => {
        navigate('/schedule');
      }, 1500);
    } catch (err) {
      setError('Error saving post. Please try again.');
      console.error('Error saving post:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {(error || success) && (
        <Alert 
          severity={error ? "error" : "success"} 
          sx={{ mb: 3, width: '100%', maxWidth: 800, mx: 'auto' }}
          onClose={() => error ? setError('') : setSuccess('')}
        >
          {error || success}
        </Alert>
      )}

      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Create New Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Post Content"
            name="content"
            multiline
            rows={4}
            value={formData.content}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Platform *</InputLabel>
            <Select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
              label="Platform *"
            >
              {platforms.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Campaign Name"
            name="campaignName"
            value={formData.campaignName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tone *</InputLabel>
            <Select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              required
              label="Tone *"
            >
              {tones.map((tone) => (
                <MenuItem key={tone} value={tone}>
                  {tone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Schedule Time"
              value={formData.scheduleTime}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  required 
                  sx={{ mb: 2 }}
                />
              )}
              minDateTime={new Date()}
            />
          </LocalizationProvider>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            SAVE POST
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreatePost;
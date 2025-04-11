import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';

const SchedulePosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    content: '',
    platform: '',
    campaignName: '',
    tone: '',
    scheduleTime: new Date()
  });

  const platforms = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'];
  const tones = ['Professional', 'Casual', 'Friendly', 'Formal', 'Humorous'];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    try {
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      // Sort posts by schedule time
      const sortedPosts = savedPosts.sort((a, b) => 
        new Date(a.scheduleTime) - new Date(b.scheduleTime)
      );
      setPosts(sortedPosts);
      setError(''); // Clear any existing errors
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts. Please refresh the page.');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      content: post.content,
      platform: post.platform,
      campaignName: post.campaignName || '',
      tone: post.tone,
      scheduleTime: new Date(post.scheduleTime)
    });
    setOpenDialog(true);
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const updatedPosts = posts.filter(post => post.id !== postId);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
        setSuccess('Post deleted successfully!');
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Failed to delete post. Please try again.');
      }
    }
  };

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPost(null);
    setFormData({
      content: '',
      platform: '',
      campaignName: '',
      tone: '',
      scheduleTime: new Date()
    });
  };

  const handleSubmit = () => {
    if (!formData.content || !formData.platform || !formData.tone || !formData.scheduleTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const updatedPosts = posts.map(post => 
        post.id === editingPost.id 
          ? {
              ...formData,
              id: post.id,
              scheduleTime: formData.scheduleTime.toISOString(),
              status: 'Scheduled',
              updatedAt: new Date().toISOString()
            }
          : post
      );

      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      setSuccess('Post updated successfully!');
      handleCloseDialog();
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post. Please try again.');
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4">Scheduled Posts</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create-post')}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          CREATE NEW POST
        </Button>
      </Box>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Paper sx={{ 
                p: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Platform: {post.platform}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {post.content}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Campaign: {post.campaignName || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tone: {post.tone}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Scheduled for: {new Date(post.scheduleTime).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton 
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(post)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleDelete(post.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
          {posts.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  No scheduled posts yet. Create your first post to get started!
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ 
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Update Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchedulePosts;
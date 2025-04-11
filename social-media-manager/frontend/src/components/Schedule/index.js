import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../contexts/PostContext';

const Schedule = () => {
  const navigate = useNavigate();
  const { posts } = usePost();

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Schedule
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreatePost}
        >
          Schedule New Post
        </Button>
      </Box>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box sx={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="textSecondary" align="center">
            No scheduled posts found. Create a new post to get started!
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Schedule; 
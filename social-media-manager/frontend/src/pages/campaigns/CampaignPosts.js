import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const CampaignPosts = ({ campaignId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (campaignId) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `http://localhost:5000/api/posts/campaign/${campaignId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setPosts(response.data);
        } catch (error) {
          setError('Error fetching posts');
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [campaignId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Typography>Loading posts...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Campaign Posts
      </Typography>
      {posts.length > 0 ? (
        <List>
          {posts.map((post) => (
            <Paper key={post._id} sx={{ mb: 2, p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip label={post.platform} color="primary" size="small" />
                <Box>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {post.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Scheduled for: {formatDate(post.scheduledDate)}
              </Typography>
            </Paper>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No posts created yet for this campaign.
        </Typography>
      )}
    </Box>
  );
};

export default CampaignPosts; 
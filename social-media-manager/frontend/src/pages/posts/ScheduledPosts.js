import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import PostAnalytics from './PostAnalytics';
import MediaPreview from './MediaPreview';

const ScheduledPosts = ({ posts, onEdit, onDelete, onSchedule }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Scheduled Posts
      </Typography>
      
      {posts.length > 0 ? (
        <List>
          {posts.map((post) => (
            <ListItem
              key={post._id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                flexDirection: 'column',
                alignItems: 'stretch'
              }}
            >
              <ListItemText
                primary={post.content}
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {post.scheduledDate && (
                      <Chip
                        size="small"
                        label={format(new Date(post.scheduledDate), 'PPp')}
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                    )}
                    {post.platforms.map(platform => (
                      <Chip
                        key={platform}
                        size="small"
                        label={platform}
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    ))}
                  </Box>
                }
              />
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <MediaPreview urls={post.mediaUrls} />
                </Box>
              )}
              <Box>
                <IconButton size="small" onClick={() => onSchedule(post)}>
                  <ScheduleIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onEdit(post)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(post._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              {post.published && (
                <Box sx={{ mt: 2, width: '100%' }}>
                  <PostAnalytics postId={post._id} />
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center">
          No scheduled posts yet.
        </Typography>
      )}
    </Paper>
  );
};

export default ScheduledPosts; 
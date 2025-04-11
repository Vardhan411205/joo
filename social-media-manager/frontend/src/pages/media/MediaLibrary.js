import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  IconButton,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete, ContentCopy } from '@mui/icons-material';
import axios from 'axios';

const MediaLibrary = ({ onSelect, multiple = false }) => {
  const [media, setMedia] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });

  const fetchMedia = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/media');
      setMedia(response.data);
    } catch (error) {
      showNotification('Error fetching media', 'error');
    }
  }, []);

  useEffect(() => {
    const loadMedia = async () => {
      await fetchMedia();
    };
    loadMedia();
  }, [fetchMedia]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/media/${id}`);
      fetchMedia();
      showNotification('Media deleted successfully', 'success');
    } catch (error) {
      showNotification('Error deleting media', 'error');
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    showNotification('URL copied to clipboard', 'success');
  };

  const handleSelect = (item) => {
    if (multiple) {
      setSelectedItems(prev => 
        prev.includes(item) 
          ? prev.filter(i => i !== item)
          : [...prev, item]
      );
    } else {
      onSelect(item);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ open: true, message, type });
  };

  const handleConfirmSelection = () => {
    onSelect(selectedItems);
  };

  return (
    <Dialog open maxWidth="md" fullWidth>
      <DialogTitle>Media Library</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {media.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedItems.includes(item) ? 2 : 0,
                  borderColor: 'primary.main'
                }}
                onClick={() => handleSelect(item)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={item.url}
                  alt={item.name}
                />
                <Box p={1} display="flex" justifyContent="space-between">
                  <Typography variant="caption" noWrap>{item.name}</Typography>
                  <Box>
                    <IconButton size="small" onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(item.url);
                    }}>
                      <ContentCopy />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => onSelect(null)}>Cancel</Button>
          {multiple && (
            <Button 
              variant="contained" 
              onClick={handleConfirmSelection}
              disabled={selectedItems.length === 0}
            >
              Select ({selectedItems.length})
            </Button>
          )}
        </Box>
      </DialogContent>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.type} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default MediaLibrary; 
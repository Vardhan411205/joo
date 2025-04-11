import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Typography,
  CircularProgress,
  TextField
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import PostScheduler from '../services/postScheduler';

const BulkOperations = ({ open, onClose, selectedPosts, onComplete }) => {
  const [action, setAction] = useState('schedule');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      switch (action) {
        case 'schedule':
          await Promise.all(selectedPosts.map(post => 
            PostScheduler.schedulePost({
              ...post,
              platforms,
              scheduledDate
            })
          ));
          break;
        case 'delete':
          await Promise.all(selectedPosts.map(post => 
            PostScheduler.cancelScheduledPost(post._id)
          ));
          break;
        default:
          console.log('Unknown action:', action);
          break;
      }
      onComplete();
      onClose();
    } catch (error) {
      console.error('Bulk operation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bulk Operations</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Action</InputLabel>
            <Select value={action} onChange={(e) => setAction(e.target.value)}>
              <MenuItem value="schedule">Schedule Posts</MenuItem>
              <MenuItem value="delete">Delete Posts</MenuItem>
            </Select>
          </FormControl>

          {action === 'schedule' && (
            <>
              <DateTimePicker
                label="Schedule Date"
                value={scheduledDate}
                onChange={setScheduledDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDateTime={new Date()}
              />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Platforms</InputLabel>
                <Select
                  multiple
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="facebook">Facebook</MenuItem>
                  <MenuItem value="twitter">Twitter</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <Typography variant="body2" sx={{ mt: 2 }}>
            Selected Posts: {selectedPosts.length}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || (action === 'schedule' && platforms.length === 0)}
        >
          {loading ? <CircularProgress size={24} /> : 'Apply'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkOperations; 
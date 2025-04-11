import React from 'react';
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
  Box
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

const PostScheduler = ({ open, onClose, onSchedule, initialDate }) => {
  const [scheduledDate, setScheduledDate] = React.useState(initialDate || null);
  const [frequency, setFrequency] = React.useState('once');

  const handleSubmit = () => {
    onSchedule({
      scheduledDate,
      frequency
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Post</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Frequency</InputLabel>
            <Select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              label="Frequency"
            >
              <MenuItem value="once">Once</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
          </FormControl>

          <DateTimePicker
            label="Schedule Date"
            value={scheduledDate}
            onChange={setScheduledDate}
            renderInput={(params) => <TextField {...params} fullWidth />}
            minDate={new Date()}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostScheduler; 
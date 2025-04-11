import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import campaignService from '../../services/campaignService';

const CampaignScheduler = ({ open, onClose, campaign, onSchedule }) => {
  const [schedule, setSchedule] = useState({
    frequency: 'once',
    startDate: null,
    endDate: null,
    timeSlots: [],
    postsPerDay: 1
  });
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    try {
      setLoading(true);
      await campaignService.scheduleCampaign(campaign._id, schedule);
      onSchedule();
      onClose();
    } catch (error) {
      console.error('Error scheduling campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Campaign</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Posting Frequency</InputLabel>
            <Select
              value={schedule.frequency}
              onChange={(e) => setSchedule({ ...schedule, frequency: e.target.value })}
              label="Posting Frequency"
            >
              <MenuItem value="once">Once</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          <DateTimePicker
            label="Start Date"
            value={schedule.startDate}
            onChange={(date) => setSchedule({ ...schedule, startDate: date })}
            renderInput={(params) => <TextField {...params} fullWidth />}
            minDate={new Date()}
          />

          {schedule.frequency !== 'once' && (
            <DateTimePicker
              label="End Date"
              value={schedule.endDate}
              onChange={(date) => setSchedule({ ...schedule, endDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={schedule.startDate || new Date()}
            />
          )}

          {schedule.frequency !== 'once' && (
            <TextField
              type="number"
              label="Posts Per Day"
              value={schedule.postsPerDay}
              onChange={(e) => setSchedule({ ...schedule, postsPerDay: parseInt(e.target.value) })}
              inputProps={{ min: 1, max: 10 }}
              fullWidth
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSchedule}
          variant="contained"
          disabled={loading || !schedule.startDate}
        >
          {loading ? <CircularProgress size={24} /> : 'Schedule Campaign'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignScheduler; 
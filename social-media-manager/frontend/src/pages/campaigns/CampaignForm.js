import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

const CampaignForm = ({ open, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    platforms: [],
    goals: [],
    targetAudience: {
      ageRange: { min: 18, max: 65 },
      locations: [],
      interests: []
    },
    ...initialData
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Campaign' : 'Create New Campaign'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Campaign Name"
              value={formData.name}
              onChange={handleChange('name')}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={4}
              fullWidth
            />

            <DateTimePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />

            <DateTimePicker
              label="End Date"
              value={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />

            <FormControl fullWidth>
              <InputLabel>Platforms</InputLabel>
              <Select
                multiple
                value={formData.platforms}
                onChange={handleChange('platforms')}
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

            <FormControl fullWidth>
              <InputLabel>Campaign Goals</InputLabel>
              <Select
                multiple
                value={formData.goals}
                onChange={handleChange('goals')}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="awareness">Brand Awareness</MenuItem>
                <MenuItem value="engagement">Engagement</MenuItem>
                <MenuItem value="traffic">Website Traffic</MenuItem>
                <MenuItem value="conversions">Conversions</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CampaignForm; 
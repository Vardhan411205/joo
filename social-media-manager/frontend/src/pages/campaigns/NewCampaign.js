import React, { useState } from 'react';
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
  Box,
  Chip
} from '@mui/material';

const NewCampaign = ({ open, onClose, onSubmit }) => {
  const [campaign, setCampaign] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    platforms: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(campaign);
    setCampaign({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      platforms: []
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Campaign</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="name"
            label="Campaign Name"
            fullWidth
            value={campaign.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={campaign.description}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            value={campaign.startDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            value={campaign.endDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Platforms</InputLabel>
            <Select
              multiple
              name="platforms"
              value={campaign.platforms}
              onChange={handleChange}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Campaign
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewCampaign; 
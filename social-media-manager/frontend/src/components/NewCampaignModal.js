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
  Typography,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import aiService from '../services/aiService';

const NewCampaignModal = ({ open, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    startDate: null,
    endDate: null,
    description: '',
    targetAudience: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const generateContent = async () => {
    try {
      setLoading(true);
      const prompt = `Create an engaging social media post for ${formData.platform} about ${formData.description}. Target audience: ${formData.targetAudience}`;
      const content = await aiService.generateContent(prompt);
      setFormData((prev) => ({ ...prev, content }));
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Campaign</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={2}>
          <TextField
            name="name"
            label="Campaign Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <FormControl fullWidth required>
            <InputLabel>Platform</InputLabel>
            <Select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              label="Platform"
            >
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" gap={2}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={handleDateChange('startDate')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={handleDateChange('endDate')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
          </LocalizationProvider>

          <TextField
            name="description"
            label="Campaign Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            name="targetAudience"
            label="Target Audience"
            value={formData.targetAudience}
            onChange={handleChange}
            fullWidth
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Content
            </Typography>
            <TextField
              name="content"
              value={formData.content}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            <Button
              onClick={generateContent}
              variant="outlined"
              color="primary"
              sx={{ mt: 1 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                'Generate with ChatGPT'
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!formData.name || !formData.platform}
        >
          Create Campaign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewCampaignModal; 
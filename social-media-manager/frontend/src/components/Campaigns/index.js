import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Campaigns = () => {
  const [open, setOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Summer Sale 2024',
      description: 'Promotional campaign for summer products',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      status: 'Active'
    },
    {
      id: 2,
      name: 'Back to School',
      description: 'Back to school special offers',
      startDate: new Date('2024-08-15'),
      endDate: new Date('2024-09-15'),
      status: 'Planned'
    }
  ]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    status: 'Planned'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClickOpen = (campaign = null) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        name: campaign.name,
        description: campaign.description,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        status: campaign.status
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        name: '',
        description: '',
        startDate: null,
        endDate: null,
        status: 'Planned'
      });
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCampaign(null);
    setFormData({
      name: '',
      description: '',
      startDate: null,
      endDate: null,
      status: 'Planned'
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.startDate > formData.endDate) {
      setError('End date must be after start date');
      return;
    }

    if (editingCampaign) {
      // Update existing campaign
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === editingCampaign.id 
          ? { ...formData, id: campaign.id }
          : campaign
      ));
      setSuccess('Campaign updated successfully!');
    } else {
      // Add new campaign
      const newCampaign = {
        id: campaigns.length + 1,
        ...formData
      };
      setCampaigns(prev => [...prev, newCampaign]);
      setSuccess('Campaign created successfully!');
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    setSuccess('Campaign deleted successfully!');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleClickOpen()}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          CREATE CAMPAIGN
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} key={campaign.id}>
            <Paper sx={{ 
              p: 3, 
              position: 'relative',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {campaign.name}
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    {campaign.description}
                  </Typography>
                </Box>
                <Box>
                  <IconButton 
                    size="small" 
                    sx={{ mr: 1 }}
                    onClick={() => handleClickOpen(campaign)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(campaign.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Start Date
                  </Typography>
                  <Typography>
                    {campaign.startDate.toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    End Date
                  </Typography>
                  <Typography>
                    {campaign.endDate.toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: campaign.status === 'Active' ? 'success.main' : 'info.main',
                      mt: 1,
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: campaign.status === 'Active' ? 'success.light' : 'info.light',
                    }}
                  >
                    {campaign.status}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCampaign ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Campaign Name"
              fullWidth
              value={formData.name}
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
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ mt: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                  minDate={formData.startDate}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            {editingCampaign ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Campaigns;
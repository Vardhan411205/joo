import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

const CampaignDetails = ({ campaign, onEdit, onDelete }) => {
  if (!campaign) return null;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h5" gutterBottom>
            {campaign.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {campaign.description}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={() => onEdit(campaign)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(campaign._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Duration
          </Typography>
          <Typography>
            {format(new Date(campaign.startDate), 'MMM dd, yyyy')} -{' '}
            {format(new Date(campaign.endDate), 'MMM dd, yyyy')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Status
          </Typography>
          <Chip
            label={campaign.status}
            color={
              campaign.status === 'active'
                ? 'success'
                : campaign.status === 'draft'
                ? 'default'
                : 'error'
            }
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Platforms
          </Typography>
          <Box sx={{ mt: 1 }}>
            {campaign.platforms.map((platform) => (
              <Chip
                key={platform}
                label={platform}
                sx={{ mr: 1 }}
                size="small"
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CampaignDetails; 
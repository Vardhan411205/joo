import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const platformIcons = {
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
};

const CampaignCard = ({ campaign, onUpdate }) => {
  const getStatusColor = () => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    if (now < start) return 'warning';
    if (now > end) return 'error';
    return 'success';
  };

  const getStatusText = () => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    if (now < start) return 'Scheduled';
    if (now > end) return 'Ended';
    return 'Active';
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            {campaign.name}
          </Typography>
          <IconButton size="small">
            {platformIcons[campaign.platform.toLowerCase()]}
          </IconButton>
        </Box>

        <Box display="flex" gap={1} mb={2}>
          <Chip
            label={getStatusText()}
            color={getStatusColor()}
            size="small"
          />
          <Chip
            label={campaign.platform}
            variant="outlined"
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {campaign.description}
        </Typography>

        <Box mt={2}>
          <Typography variant="caption" display="block" color="text.secondary">
            Start: {format(new Date(campaign.startDate), 'MMM dd, yyyy')}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            End: {format(new Date(campaign.endDate), 'MMM dd, yyyy')}
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onUpdate(campaign.id)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default CampaignCard; 
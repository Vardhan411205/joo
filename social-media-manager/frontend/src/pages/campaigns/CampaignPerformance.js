import React from 'react';
import {
  Paper,
  Typography,
  Grid
} from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const CampaignPerformance = ({ metrics }) => {
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>Campaign Performance</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="engagement.likes" fill="#8884d8" name="Likes" />
              <Bar dataKey="engagement.shares" fill="#82ca9d" name="Shares" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reach" stroke="#8884d8" />
              <Line type="monotone" dataKey="impressions" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CampaignPerformance; 
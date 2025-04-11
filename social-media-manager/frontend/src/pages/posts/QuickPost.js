import React, { useState } from 'react';
import { Paper, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const QuickPost = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');

  const handleGenerate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/ai/generate', {
        topic,
        platform: 'all',
        tone: 'professional'
      });
      onGenerate(response.data.content);
    } catch (error) {
      console.error('Error generating post:', error);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button variant="contained" onClick={handleGenerate}>
          Generate Post
        </Button>
      </Box>
    </Paper>
  );
};

export default QuickPost; 
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
  CircularProgress,
  Typography,
  Chip
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import postService from '../../services/postService';

const AIPostGenerator = ({ open, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await postService.generateContent({
        prompt,
        tone,
        platforms
      });
      setGeneratedContent(response.data.content);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUse = () => {
    onGenerate(generatedContent);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Generate Post Content with AI</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="What would you like to post about?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Tone</InputLabel>
            <Select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              label="Tone"
            >
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="humorous">Humorous</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Platforms</InputLabel>
            <Select
              multiple
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
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

          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={handleGenerate}
            disabled={loading || !prompt}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Content'}
          </Button>

          {generatedContent && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Generated Content:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {generatedContent}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleUse}
          variant="contained"
          disabled={!generatedContent}
        >
          Use This Content
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIPostGenerator; 
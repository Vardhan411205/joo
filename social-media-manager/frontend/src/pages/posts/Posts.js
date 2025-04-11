import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  MenuItem,
  Chip,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import postService from '../../services/postService';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    platforms: [],
    scheduledDate: null,
    campaign: '',
    useAI: false,
    aiPrompt: '',
    tone: 'professional'
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    try {
      setAiGenerating(true);
      const response = await postService.generateContent({
        prompt: formData.aiPrompt,
        tone: formData.tone,
        platforms: formData.platforms
      });
      setFormData(prev => ({
        ...prev,
        content: response.data.content
      }));
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedPost) {
        await postService.updatePost(selectedPost._id, formData);
      } else {
        await postService.createPost(formData);
      }
      setOpenDialog(false);
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await postService.deletePost(id);
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedPost(null);
            setFormData({
              content: '',
              platforms: [],
              scheduledDate: null,
              campaign: '',
              useAI: false,
              aiPrompt: '',
              tone: 'professional'
            });
            setOpenDialog(true);
          }}
        >
          New Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post._id}>
            <Card>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {post.content}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {post.platforms.map((platform) => (
                    <Chip
                      key={platform}
                      label={platform}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
                <Typography color="textSecondary" sx={{ mt: 2 }}>
                  {post.scheduledDate
                    ? `Scheduled for: ${new Date(post.scheduledDate).toLocaleString()}`
                    : 'Draft'}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={() => {
                      setSelectedPost(post);
                      setFormData({
                        ...post,
                        useAI: false,
                        aiPrompt: '',
                        tone: 'professional'
                      });
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(post._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {selectedPost ? 'Edit Post' : 'New Post'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.useAI}
                  onChange={(e) => setFormData({ ...formData, useAI: e.target.checked })}
                />
              }
              label="Use AI to generate content"
            />

            {formData.useAI && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="What would you like to post about?"
                  value={formData.aiPrompt}
                  onChange={(e) => setFormData({ ...formData, aiPrompt: e.target.value })}
                  margin="normal"
                  multiline
                  rows={2}
                />
                <TextField
                  select
                  fullWidth
                  label="Tone"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  margin="normal"
                >
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="humorous">Humorous</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  onClick={handleGenerateContent}
                  disabled={aiGenerating}
                  startIcon={<AutoAwesomeIcon />}
                  sx={{ mt: 1 }}
                >
                  {aiGenerating ? 'Generating...' : 'Generate Content'}
                </Button>
              </Box>
            )}

            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
            />

            <TextField
              select
              fullWidth
              label="Platforms"
              value={formData.platforms}
              onChange={(e) => setFormData({ ...formData, platforms: e.target.value })}
              margin="normal"
              SelectProps={{
                multiple: true,
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                ),
              }}
            >
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
            </TextField>

            <DateTimePicker
              label="Schedule Date"
              value={formData.scheduledDate}
              onChange={(date) => setFormData({ ...formData, scheduledDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save'}
              </Button>
            </Box>
          </form>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Posts; 
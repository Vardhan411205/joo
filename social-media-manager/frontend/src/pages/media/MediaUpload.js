import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  CircularProgress,
  Typography,
  LinearProgress
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload, Add as AddIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ImageOptimizer from '../services/imageOptimizer';
import retryOperation from '../utils/retryUtil';
import ImageCropper from './ImageCropper';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MediaLibrary from './MediaLibrary';

const MediaUpload = ({ onUploadComplete, platform }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [optimizing, setOptimizing] = useState(false);
  const [uploadAttempt, setUploadAttempt] = useState(0);
  const [cropImage, setCropImage] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length + files.length > 4) {
      setError('Maximum 4 files allowed');
      return;
    }

    setOptimizing(true);
    try {
      const optimizedFiles = await ImageOptimizer.optimizeMultiple(acceptedFiles);
      setFiles(prev => [...prev, ...optimizedFiles]);
      
      optimizedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      setError('Error optimizing images');
      console.error('Optimization error:', error);
    } finally {
      setOptimizing(false);
    }
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: true
  });

  const handleRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('media', file);
    });

    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:5000/api/posts/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      }
    );
    return response;
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      setError('');
      setUploadProgress(0);
      setUploadAttempt(0);

      const response = await retryOperation(
        async () => {
          setUploadAttempt(prev => prev + 1);
          return uploadFiles();
        },
        3, // max attempts
        1000 // delay between attempts
      );

      onUploadComplete(response.data.urls);
      setFiles([]);
      setPreviews([]);
      setUploadProgress(0);
    } catch (error) {
      setError(`Upload failed after ${uploadAttempt} attempts`);
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCropComplete = async (croppedImageUrl) => {
    const response = await fetch(croppedImageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

    const newFiles = [...files, file];
    setFiles(newFiles);

    setPreviews(prev => [...prev, croppedImageUrl]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(previews);
    const filesArray = Array.from(files);
    const [reorderedPreview] = items.splice(result.source.index, 1);
    const [reorderedFile] = filesArray.splice(result.source.index, 1);
    
    items.splice(result.destination.index, 0, reorderedPreview);
    filesArray.splice(result.destination.index, 0, reorderedFile);

    setPreviews(items);
    setFiles(filesArray);
  };

  const handleLibrarySelect = (selectedMedia) => {
    if (!selectedMedia) {
      setShowLibrary(false);
      return;
    }

    const newFiles = [...files];
    const newPreviews = [...previews];

    selectedMedia.forEach(item => {
      newPreviews.push(item.url);
      fetch(item.url)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], item.name, { type: item.type });
          newFiles.push(file);
        });
    });

    setFiles(newFiles);
    setPreviews(newPreviews);
    setShowLibrary(false);
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 1,
          p: 2,
          textAlign: 'center',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer'
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography>
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Maximum 4 images, 5MB each
        </Typography>
      </Box>

      {optimizing && (
        <Typography color="info" variant="body2" sx={{ mt: 1 }}>
          Optimizing images...
        </Typography>
      )}

      {error && uploadAttempt > 0 && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          Upload failed (Attempt {uploadAttempt}/3)
        </Typography>
      )}

      {previews.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="previews" direction="horizontal">
              {(provided) => (
                <ImageList 
                  cols={4} 
                  rowHeight={164}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {previews.map((preview, index) => (
                    <Draggable 
                      key={index} 
                      draggableId={`preview-${index}`} 
                      index={index}
                    >
                      {(provided) => (
                        <ImageListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              bgcolor: 'background.paper'
                            }}
                            size="small"
                            onClick={() => handleRemove(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ImageListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ImageList>
              )}
            </Droppable>
          </DragDropContext>

          {loading && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </Box>
      )}

      <ImageCropper
        open={!!cropImage}
        onClose={() => setCropImage(null)}
        image={cropImage}
        platform={platform}
        onCropComplete={handleCropComplete}
      />

      <Button
        startIcon={<AddIcon />}
        onClick={() => setShowLibrary(true)}
        sx={{ mt: 2 }}
      >
        Choose from Library
      </Button>

      {showLibrary && (
        <MediaLibrary
          onSelect={handleLibrarySelect}
          multiple
        />
      )}
    </Box>
  );
};

export default MediaUpload; 
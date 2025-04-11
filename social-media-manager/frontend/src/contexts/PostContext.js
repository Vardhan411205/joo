import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const PostContext = createContext();

export const usePost = () => {
  return useContext(PostContext);
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchPosts = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }

      setPosts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createPost = async (postData) => {
    try {
      // Simulated successful post creation
      const newPost = {
        id: Date.now(),
        ...postData,
        status: 'scheduled'
      };
      setPosts(prev => [...prev, newPost]);
      return { success: true };
    } catch (error) {
      console.log('Error creating post:', error);
      return { success: false };
    }
  };

  const deletePost = useCallback(async (postId) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }

      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error deleting post:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updatePost = useCallback(async (postId, updates) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update post');
      }

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, ...updates } : post
        )
      );
      return { success: true, post: data };
    } catch (err) {
      setError(err.message);
      console.error('Error updating post:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getPostAnalytics = useCallback(async (postId) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch post analytics');
      }

      return { success: true, analytics: data };
    } catch (err) {
      setError(err.message);
      console.error('Error fetching post analytics:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const value = {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    deletePost,
    updatePost,
    getPostAnalytics
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostProvider; 
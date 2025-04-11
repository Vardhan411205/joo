import axios from 'axios';

class PostScheduler {
  static async schedulePost(postData) {
    try {
      const response = await axios.post('http://localhost:5000/api/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error scheduling post:', error);
      throw error;
    }
  }

  static async reschedulePost(postId, newDate) {
    try {
      const response = await axios.put(`http://localhost:5000/api/posts/${postId}/reschedule`, {
        newDate
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling post:', error);
      throw error;
    }
  }

  static async cancelScheduledPost(postId) {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
    } catch (error) {
      console.error('Error canceling post:', error);
      throw error;
    }
  }
}

export default PostScheduler; 
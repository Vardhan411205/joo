const schedule = require('node-schedule');
const Post = require('../models/Post');
const socialMediaService = require('./socialMediaService');

class PostScheduler {
  constructor() {
    this.jobs = new Map();
  }

  async schedulePost(post) {
    try {
      if (!post.scheduledDate) {
        throw new Error('No schedule date provided');
      }

      // Cancel existing job if it exists
      if (this.jobs.has(post._id)) {
        this.jobs.get(post._id).cancel();
      }

      // Schedule new job
      const job = schedule.scheduleJob(new Date(post.scheduledDate), async () => {
        try {
          // Update post status
          post.status = 'publishing';
          await post.save();

          // Publish to each platform
          const results = await Promise.all(
            post.platforms.map(platform => 
              socialMediaService.publishToPlatform(post, platform)
            )
          );

          // Update post with results
          post.status = 'published';
          post.publishedDate = new Date();
          post.platformPostIds = results.reduce((acc, result) => ({
            ...acc,
            [result.platform]: result.id
          }), {});
          await post.save();

          // Remove job from jobs map
          this.jobs.delete(post._id);
        } catch (error) {
          console.error(`Failed to publish post ${post._id}:`, error);
          post.status = 'failed';
          post.error = error.message;
          await post.save();
        }
      });

      // Store job reference
      this.jobs.set(post._id, job);
      
      return true;
    } catch (error) {
      console.error('Scheduling error:', error);
      throw error;
    }
  }

  async initializeScheduledPosts() {
    try {
      const posts = await Post.find({
        status: 'scheduled',
        scheduledDate: { $gt: new Date() }
      });

      console.log(`Initializing ${posts.length} scheduled posts`);

      for (const post of posts) {
        await this.schedulePost(post);
      }

      return true;
    } catch (error) {
      console.error('Error initializing scheduled posts:', error);
      throw error;
    }
  }

  cancelScheduledPost(postId) {
    if (this.jobs.has(postId)) {
      this.jobs.get(postId).cancel();
      this.jobs.delete(postId);
      return true;
    }
    return false;
  }

  async reschedulePost(postId, newDate) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      post.scheduledDate = newDate;
      await post.save();

      return this.schedulePost(post);
    } catch (error) {
      console.error('Rescheduling error:', error);
      throw error;
    }
  }

  // Reschedule all pending posts on server start
  async rescheduleAllPosts() {
    try {
      const pendingPosts = await Post.find({ 
        status: 'scheduled',
        scheduledDate: { $gt: new Date() }
      });

      for (const post of pendingPosts) {
        await this.schedulePost(post);
      }

      console.log(`Rescheduled ${pendingPosts.length} pending posts`);
    } catch (error) {
      console.error('Error rescheduling posts:', error);
    }
  }
}

module.exports = new PostScheduler(); 
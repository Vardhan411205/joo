const schedule = require('node-schedule');
const Post = require('../models/Post');
const PostPublisher = require('./postPublisher');

class Scheduler {
  static async schedulePost(post) {
    try {
      const job = schedule.scheduleJob(post.scheduledDate, async () => {
        await this.publishPost(post);
      });

      await Post.findByIdAndUpdate(post._id, {
        'metadata.scheduledJobId': job.name,
        status: 'scheduled'
      });

      return job;
    } catch (error) {
      console.error('Scheduling error:', error);
      throw error;
    }
  }

  static async cancelScheduledPost(post) {
    if (post.metadata?.scheduledJobId) {
      schedule.cancelJob(post.metadata.scheduledJobId);
      await Post.findByIdAndUpdate(post._id, {
        'metadata.scheduledJobId': null,
        status: 'draft'
      });
    }
  }

  static async reschedulePost(post, newDate) {
    await this.cancelScheduledPost(post);
    post.scheduledDate = newDate;
    await post.save();
    return this.schedulePost(post);
  }

  static async publishPost(post) {
    try {
      const result = await PostPublisher.publishPost(post);
      await Post.findByIdAndUpdate(post._id, {
        status: 'published',
        publishedDate: new Date(),
        'metadata.platformPostId': result.id
      });
    } catch (error) {
      console.error('Publishing error:', error);
      await Post.findByIdAndUpdate(post._id, { status: 'failed' });
    }
  }
}

module.exports = Scheduler; 
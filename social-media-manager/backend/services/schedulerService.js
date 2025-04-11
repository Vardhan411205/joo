const schedule = require('node-schedule');
const Post = require('../models/Post');
const Campaign = require('../models/Campaign');
const socialMediaService = require('./socialMediaService');

class SchedulerService {
  static async scheduleCampaign(campaignId, scheduleData) {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const { frequency, scheduledDate, platforms } = scheduleData;
      const posts = await Post.find({ campaign: campaignId });

      switch (frequency) {
        case 'once':
          await this.scheduleOnce(posts, scheduledDate, platforms);
          break;
        case 'daily':
          await this.scheduleDaily(posts, scheduledDate, platforms);
          break;
        case 'weekly':
          await this.scheduleWeekly(posts, scheduledDate, platforms);
          break;
        default:
          throw new Error('Invalid frequency');
      }

      await Campaign.findByIdAndUpdate(campaignId, {
        status: 'scheduled',
        scheduledDate
      });

      return { message: 'Campaign scheduled successfully' };
    } catch (error) {
      console.error('Scheduling error:', error);
      throw error;
    }
  }

  static async scheduleOnce(posts, date, platforms) {
    for (const post of posts) {
      const job = schedule.scheduleJob(date, async () => {
        try {
          await this.publishPost(post, platforms);
        } catch (error) {
          console.error(`Failed to publish post ${post._id}:`, error);
        }
      });

      await Post.findByIdAndUpdate(post._id, {
        scheduledDate: date,
        status: 'scheduled',
        platforms,
        jobId: job.name
      });
    }
  }

  static async publishPost(post, platforms) {
    try {
      const results = await Promise.all(
        platforms.map(platform => 
          socialMediaService.publishToSocialMedia(post, platform)
        )
      );

      await Post.findByIdAndUpdate(post._id, {
        status: 'published',
        publishedDate: new Date(),
        publishResults: results
      });
    } catch (error) {
      await Post.findByIdAndUpdate(post._id, {
        status: 'failed',
        error: error.message
      });
      throw error;
    }
  }

  static async schedulePost(post) {
    try {
      if (!post.scheduledDate) {
        throw new Error('No schedule date provided');
      }

      // Cancel any existing schedule for this post
      if (schedule.scheduledJobs[`post_${post._id}`]) {
        schedule.scheduledJobs[`post_${post._id}`].cancel();
      }

      // Schedule new job
      schedule.scheduleJob(`post_${post._id}`, post.scheduledDate, async () => {
        try {
          // Update post status
          post.status = 'publishing';
          await post.save();

          // Publish to each platform
          for (const platform of post.platforms) {
            await socialMediaService.publishToPlatform(post, platform);
          }

          // Update post status to published
          post.status = 'published';
          post.publishedDate = new Date();
          await post.save();
        } catch (error) {
          console.error(`Failed to publish post ${post._id}:`, error);
          post.status = 'failed';
          await post.save();
        }
      });

      return true;
    } catch (error) {
      console.error('Scheduling error:', error);
      throw error;
    }
  }

  static async reschedulePost(postId, newDate) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Cancel existing job if any
    const existingJob = schedule.scheduledJobs[postId];
    if (existingJob) {
      existingJob.cancel();
    }

    // Update post schedule date
    post.scheduledDate = newDate;
    await post.save();

    // Create new schedule
    return this.schedulePost(post);
  }

  static cancelScheduledPost(postId) {
    if (schedule.scheduledJobs[`post_${postId}`]) {
      schedule.scheduledJobs[`post_${postId}`].cancel();
      return true;
    }
    return false;
  }
}

module.exports = SchedulerService; 
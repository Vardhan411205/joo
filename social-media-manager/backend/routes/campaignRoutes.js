const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const campaignController = require('../controllers/campaignController');
const upload = require('../middleware/uploadMiddleware');
const Campaign = require('../models/Campaign');

// Campaign routes
router.route('/')
  .get(auth, campaignController.getCampaigns)
  .post(auth, campaignController.createCampaign);

router.route('/:id')
  .get(auth, campaignController.getCampaign)
  .put(auth, campaignController.updateCampaign)
  .delete(auth, campaignController.deleteCampaign);

// Campaign metrics and actions
router.get('/:id/metrics', auth, campaignController.getCampaignMetrics);
router.post('/:id/schedule', auth, campaignController.scheduleCampaign);
router.post('/:id/pause', auth, campaignController.pauseCampaign);
router.post('/:id/resume', auth, campaignController.resumeCampaign);
router.get('/:id/stats', auth, campaignController.getCampaignStats);
router.get('/:id/analytics', auth, campaignController.getCampaignMetrics);

// Campaign posts management
router.route('/:id/posts')
  .get(auth, campaignController.getCampaignPosts)
  .post(auth, campaignController.addPostToCampaign);

router.route('/:id/posts/:postId')
  .put(auth, campaignController.updateCampaignPost)
  .delete(auth, campaignController.deleteCampaignPost);

// Get all campaigns
router.get('/all', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userId: req.user.id });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single campaign
router.get('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get campaign analytics
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // TODO: Implement analytics gathering from social media platforms
    const analytics = {
      impressions: 0,
      engagements: 0,
      clicks: 0,
      shares: 0,
      // Add more metrics as needed
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get campaign posts
router.get('/:id/posts', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Make sure user owns campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(campaign.scheduledPosts);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add post to campaign
router.post('/:id/posts', auth, async (req, res) => {
  try {
    const { content, platform, scheduledTime } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Make sure user owns campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    campaign.scheduledPosts.push({
      content,
      platform,
      scheduledTime
    });

    await campaign.save();
    res.json(campaign.scheduledPosts[campaign.scheduledPosts.length - 1]);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update campaign post
router.put('/:id/posts/:postId', auth, async (req, res) => {
  try {
    const { content, platform, scheduledTime } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Make sure user owns campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const post = campaign.scheduledPosts.id(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.content = content;
    post.platform = platform;
    post.scheduledTime = scheduledTime;

    await campaign.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete campaign post
router.delete('/:id/posts/:postId', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Make sure user owns campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const post = campaign.scheduledPosts.id(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.remove();
    await campaign.save();
    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 
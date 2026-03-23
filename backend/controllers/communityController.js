const CommunityPost = require('../models/CommunityPost');

// Get all posts (for everyone)
const getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().populate('author', 'name role').sort('-createdAt');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a post
const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = new CommunityPost({
      author: req.user._id,
      title,
      content,
      tags
    });
    await post.save();
    
    // Populate author before returning so UI can show name
    await post.populate('author', 'name role');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upvote a post
const upvotePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    post.upvotes += 1; // Simplistic approach, no user tracking for double vote prevention for now
    await post.save();
    res.json({ upvotes: post.upvotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      author: req.user._id,
      content
    });
    await post.save();
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts, createPost, upvotePost, addComment };

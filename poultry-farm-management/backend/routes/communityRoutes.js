const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPosts, createPost, upvotePost, addComment } = require('../controllers/communityController');

router.route('/')
  .get(protect, getPosts) // Any logged-in user can read
  .post(protect, createPost); // Any logged in user can post

router.put('/:id/upvote', protect, upvotePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;

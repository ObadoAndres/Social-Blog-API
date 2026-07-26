import { createComment, getCommentsByPostId } from '../services/comment.services.js';
import asyncHandler from '../middlewares/asyncHandler.js';

/**
 * Create a new comment on a post
 */
export const createCommentController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const commentData = req.body;
  const userId = req.user.id;

  const comment = await createComment(commentData, userId, postId);

  res.status(201).json({
    success: true,
    message: 'Comment created successfully',
    data: comment,
  });
});

/**
 * Get all comments for a specific post
 */
export const getCommentsByPostIdController = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await getCommentsByPostId(postId);

  res.status(200).json({
    success: true,
    data: comments,
  });
});
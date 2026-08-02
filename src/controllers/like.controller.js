import asyncHandler from "../middlewares/asyncHandler.js";
import { likePost, unlikePost } from "../services/like.services.js";

export const likePostController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const currentUser = req.user;

  const result = await likePost(postId, currentUser);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const unlikePostController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const currentUser = req.user;

  const result = await unlikePost(postId, currentUser);

  res.status(200).json({
    success: true,
    ...result,
  });
});
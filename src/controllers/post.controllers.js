import asyncHandler from "../middlewares/asyncHandler.js";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "../services/post.service.js";

export const createPostController = asyncHandler(async (req, res) => {
  const postData = req.body;
  const userId = req.user.id;

  const createdPost = await createPost(postData, userId);

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: createdPost,
  });
});

export const getPostController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await getPosts(page, limit);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getPostByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await getPostById(id);

  res.status(200).json({
    success: true,
    data: post,
  });
});

export const updatePostController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const currentUser = req.user;

  // Fixed variable name collision with the imported updatePost function
  const updatedPost = await updatePost(id, updateData, currentUser);

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
});

export const deletePostController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;

  await deletePost(id, currentUser);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

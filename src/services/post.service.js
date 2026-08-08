import Post from "../models/post.js";
import redisClient from "../config/redis.js";

export const createPost = async (postData, userId) => {
  const post = new Post({
    author: userId,
    ...postData,
  });

  const savedPost = await post.save();
  return savedPost.populate("author", "username");
};

export const getPosts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "username");
  return posts;
};

export const getPostById = async (postId) => {
  const cacheKey = `post:${postId}`;

  const cachedPost = await redisClient.get(cacheKey);

  if (cachedPost) {
    console.log("Cache Hit");
    return JSON.parse(cachedPost);
  }

  console.log("Cache Miss");

  const post = await Post.findById(postId).populate("author", "username");

  if (!post) {
    throw new Error("Post not found");
  }

  await redisClient.setEx(
    cacheKey,
    300,
    JSON.stringify(post)
  );

  return post;
};

export const updatePost = async (postId, updateData, currentUser) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  if (post.author.toString() !== currentUser.id && currentUser.role !== "admin") {
    const error = new Error("Not authorized to update this post");
    error.statusCode = 403;
    throw error;
  }

  if (updateData.title !== undefined) {
    post.title = updateData.title;
  }
  if (updateData.content !== undefined) {
    post.content = updateData.content;
  }

  const updatedPost = await post.save();
  return updatedPost.populate("author", "username");
};

export const deletePost = async (postId, currentUser) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  if (post.author.toString() !== currentUser.id && currentUser.role !== "admin") {
    const error = new Error("Not authorized to delete this post");
    error.statusCode = 403;
    throw error;
  }

  await post.deleteOne();
  return { message: "Post deleted successfully" };
};

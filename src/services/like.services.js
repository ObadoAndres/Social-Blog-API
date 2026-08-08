import Like from "../models/like.js";
import Post from "../models/post.js";
import User from "../models/user.js";

export const likePost = async (postId, currentUser) => {
  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const existingLike = await Like.findOne({
    user: currentUser.id,
    post: postId,
  });
  if (existingLike) {
    const error = new Error("User has already liked this post");
    error.statusCode = 409;
    throw error;
  }

  const like = new Like({
    user: currentUser.id,
    post: postId,
  });
  await like.save();

  post.likesCount = Math.max(0, (post.likesCount || 0) + 1);
  await post.save();

  const userDoc = await User.findById(currentUser.id).select("username");

  return {
    message: "Post liked successfully",
    likesCount: post.likesCount,
    user: userDoc ? { username: userDoc.username } : { username: currentUser.id },
  };
};

export const unlikePost = async (postId, currentUser) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const like = await Like.findOne({
    user: currentUser.id,
    post: postId,
  });
  if (!like) {
    const error = new Error("You have not liked this post");
    error.statusCode = 404;
    throw error;
  }

  await like.deleteOne();

  post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
  await post.save();

  const userDoc = await User.findById(currentUser.id).select("username");

  return {
    message: "Like deleted successfully",
    likesCount: post.likesCount,
    user: userDoc ? { username: userDoc.username } : { username: currentUser.id },
  };
};
